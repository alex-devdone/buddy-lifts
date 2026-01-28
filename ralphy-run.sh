#!/usr/bin/env bash
set -euo pipefail

log_file=".ralphy/ralphy-run.log"
total_runs=10
total_steps=3

log() {
  echo "$1" | tee -a "$log_file"
}

run_step() {
  local label="$1"
  shift
  local start end duration status tmp
  local stop_phrase="PRD complete!"
  tmp="$(mktemp)"
  start="$(date +%s)"

  log "${label}: start $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  set +e
  "$@" 2>&1 | tee "$tmp"
  status=${PIPESTATUS[0]}
  set -e

  end="$(date +%s)"
  duration=$((end - start))
  log "${label}: duration ${duration}s"
  log "${label}: last 10 lines of output"
  tail -n 10 "$tmp" >>"$log_file"
  log "${label}: exit status ${status}"

  if [ "$status" -ne 0 ]; then
    rm -f "$tmp"
    return "$status"
  fi

  if grep -q "$stop_phrase" "$tmp"; then
    rm -f "$tmp"
    log "${label}: stop phrase detected, ending run loop"
    return 2
  fi

  rm -f "$tmp"
}

start_all="$(date +%s)"
log "Run started $(date -u +%Y-%m-%dT%H:%M:%SZ)"

for run in $(seq 1 "$total_runs"); do
  sonnet_failed=false
  codex_failed=false
  gemini_failed=false

  # Step 1: Sonnet (Claude Code)
  run_step "Run ${run}/${total_runs} Step 1/${total_steps} (with --sonnet)" \
    ralphy --prd .ralphy/PRD.md --sonnet --create-pr || rc=$?
  if [ "${rc:-0}" -eq 2 ]; then
    break
  elif [ -n "${rc:-}" ] && [ "$rc" -ne 0 ]; then
    sonnet_failed=true
  fi
  unset rc

  # Step 2: Gemini
  run_step "Run ${run}/${total_runs} Step 2/${total_steps} (with --gemini)" \
    ralphy --prd .ralphy/PRD.md --gemini --create-pr || rc=$?
  if [ "${rc:-0}" -eq 2 ]; then
    break
  elif [ -n "${rc:-}" ] && [ "$rc" -ne 0 ]; then
    gemini_failed=true
  fi
  unset rc

  # Step 3: Codex (OpenAI)
  run_step "Run ${run}/${total_runs} Step 3/${total_steps} (with --codex)" \
    ralphy --prd .ralphy/PRD.md --codex --create-pr || rc=$?
  if [ "${rc:-0}" -eq 2 ]; then
    break
  elif [ -n "${rc:-}" ] && [ "$rc" -ne 0 ]; then
    codex_failed=true
  fi
  unset rc

  # If all models failed, wait 5 minutes before retrying
  if [ "$codex_failed" = true ] && [ "$sonnet_failed" = true ] && [ "$gemini_failed" = true ]; then
    log "All models timed out, waiting 5 minutes before retry..."
    sleep 300
  fi
done

end_all="$(date +%s)"
total_duration=$((end_all - start_all))
log "Run finished $(date -u +%Y-%m-%dT%H:%M:%SZ)"
log "Total duration ${total_duration}s"

# ralphy --prd .ralphy/PRD.md --gemini --create-pr
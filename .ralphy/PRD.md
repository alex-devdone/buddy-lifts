# PRD: Buddy Lifts - Collaborative Gym Training App

**Goal:** Build a mobile-first collaborative gym training app where friends can create, share, and complete workouts together with real-time progress tracking and AI-powered summaries.

**Date:** 2026-01-24

## Context

- **Stack:** Next.js 16, tRPC, Drizzle ORM, Supabase, Better-Auth
- **Key patterns:** Hybrid data (Supabase reads, tRPC writes), protectedProcedure for auth
- **Constraints:** Mobile-first, use existing auth, follow Biome linting, shadcn/ui components

## Phase 1: Foundation (parallel_group: 1)

### Database Schema
- [x] Create `packages/db/src/schema/training.ts` - trainings table (id, userId, name, description, createdAt, updatedAt)
- [x] Create `packages/db/src/schema/exercise.ts` - exercises table (id, trainingId, name, targetSets, targetReps, weight, order, restSeconds)
- [x] Create `packages/db/src/schema/training-session.ts` - active sessions (id, trainingId, hostUserId, inviteCode, accessType, status, startedAt, completedAt)
- [x] Create `packages/db/src/schema/session-participant.ts` - participants (id, sessionId, odUserId, role: host/admin/read, joinedAt)
- [x] Create `packages/db/src/schema/exercise-progress.ts` - per-exercise progress (id, sessionId, odUserId, exerciseId, completedReps JSON array, completedAt)
- [x] Create `packages/db/src/schema/friend.ts` - friendships (id, userId, friendId, status: pending/accepted/blocked, createdAt)
- [x] Export all schemas from `packages/db/src/schema/index.ts`
- [x] Run `bun run db:push` to sync schema with Supabase

### Authentication Enhancement
- [x] Add Google OAuth provider to `packages/auth/src/index.ts` using Better-Auth socialProviders
- [x] Update `apps/web/src/lib/auth-client.ts` with Google sign-in method
<!-- - [ ] Create Google OAuth credentials in Google Cloud Console (manual step - document in README) -->

## Phase 2: Core Backend (parallel_group: 2)

### tRPC Routers
- [x] Create `packages/api/src/routers/training.ts` - create, update, delete trainings (protectedProcedure)
- [x] Create `packages/api/src/routers/exercise.ts` - CRUD for exercises within trainings
- [x] Create `packages/api/src/routers/exercise-parser.ts` - AI-powered text-to-exercises mutation using LLM (parse "10x4 pushup, 10,10,8,6 pull ups between" -> structured exercises)
- [x] Create `packages/api/src/routers/session.ts` - start/end sessions, generate invite codes, join session
- [x] Create `packages/api/src/routers/progress.ts` - record exercise completion, calculate percentages
- [x] Create `packages/api/src/routers/friend.ts` - send/accept/reject/remove friend requests
- [x] Create `packages/api/src/routers/ai-summary.ts` - generate training summary comparing participants' performance
- [x] Register all routers in `packages/api/src/routers/index.ts`

### Invite System
- [x] Create invite code generator utility in `packages/api/src/utils/invite-code.ts` (nanoid-based, 8 chars)
- [x] Add invite validation and expiry logic in session router

### Email Notifications (Supabase Edge Functions)
- [x] Create Supabase Edge Function `supabase/functions/notify-join/index.ts` - email when someone joins training
- [x] Create Supabase Edge Function `supabase/functions/notify-complete/index.ts` - email with progress summary on completion
- [x] Set up database triggers in Supabase to invoke edge functions

## Phase 3: UI Components (parallel_group: 3)

### Training Management
- [x] Create `apps/web/src/components/training/training-card.tsx` - training preview card
- [x] Create `apps/web/src/components/training/training-form.tsx` - create/edit training form
- [x] Create `apps/web/src/components/training/exercise-parser-input.tsx` - natural language input with AI parsing
- [x] Create `apps/web/src/components/training/exercise-list.tsx` - sortable exercise list with drag-drop

### Session Components
- [x] Create `apps/web/src/components/session/session-lobby.tsx` - waiting room before starting
- [x] Create `apps/web/src/components/session/invite-link-dialog.tsx` - generate/copy invite link with access level
- [x] Create `apps/web/src/components/session/participant-grid.tsx` - grid layout for 1-3 participants (mobile responsive)

### Progress Visualization (Mobile-First)
- [x] Create `apps/web/src/components/session/body-progress.tsx` - SVG human body with CSS muscle growth animation (0-100%)
- [x] Create `apps/web/src/components/session/exercise-checklist.tsx` - checklist overlay on body visualization
- [x] Create `apps/web/src/components/session/progress-input.tsx` - input for actual reps completed (e.g., did 8 of 10)
- [x] Create `apps/web/src/components/session/live-progress-bar.tsx` - real-time progress bar per participant

### Friend Management
- [x] Create `apps/web/src/components/friends/friend-list.tsx` - list with remove action
- [x] Create `apps/web/src/components/friends/friend-request-card.tsx` - accept/reject UI
- [x] Create `apps/web/src/components/friends/add-friend-dialog.tsx` - search and send request

### Feed & History
- [x] Create `apps/web/src/components/feed/training-feed.tsx` - upcoming and past trainings (yours + friends)
- [x] Create `apps/web/src/components/feed/feed-item.tsx` - training preview with join button for friends' trainings

### AI Summary
- [x] Create `apps/web/src/components/summary/training-summary.tsx` - post-workout summary with AI analysis
- [x] Create `apps/web/src/components/summary/participant-comparison.tsx` - comparison chart between participants

## Phase 4: Pages & Routing (parallel_group: 4)

### App Pages
- [x] Create `apps/web/src/app/trainings/page.tsx` - list all trainings with create button
- [x] Create `apps/web/src/app/trainings/new/page.tsx` - create new training
- [x] Create `apps/web/src/app/trainings/[id]/page.tsx` - training detail/edit
- [x] Create `apps/web/src/app/trainings/[id]/session/page.tsx` - active training session with live progress
- [x] Create `apps/web/src/app/join/[code]/page.tsx` - invite link handler (auth required, then join)
- [x] Create `apps/web/src/app/friends/page.tsx` - friend list and requests
- [x] Create `apps/web/src/app/feed/page.tsx` - training feed (your + friends' trainings)
- [x] Update `apps/web/src/components/header.tsx` - add navigation for Trainings, Feed, Friends

### Auth Pages
<!-- - [ ] Update sign-in page to include Google OAuth button -->
- [x] Add redirect logic for invite links (save code, redirect to login, then join)

## Phase 5: Real-time & Polish (parallel_group: 5)

### Real-time Subscriptions
- [x] Add Supabase real-time subscription for session participants in session page
- [x] Add Supabase real-time subscription for exercise progress updates
- [x] Implement optimistic updates for progress recording

### Mobile Optimization
- [x] Ensure all components use responsive Tailwind classes (mobile-first)
- [x] Test body SVG animation on mobile viewport sizes
- [x] Add touch-friendly controls for progress input
- [x] Implement swipe gestures for exercise navigation (optional)

### Error Handling & UX
- [x] Add loading skeletons for all data-fetching components
- [x] Add toast notifications for actions (joined, completed, etc.)
- [x] Add error boundaries for session components
- [x] Add offline indicator for real-time connection status

## Phase 6: Testing & QA (parallel_group: 6)

- [x] Write unit tests for exercise parser in `packages/api/src/routers/__tests__/exercise-parser.test.ts`
- [x] Write unit tests for invite code generation
- [x] Write integration tests for session flow
- [x] Run `bun run check` and fix linting issues
- [x] Run `bun run check-types` and fix type errors
- [x] Run `bun run build` and verify no build errors
- [x] Manual E2E test: create training -> start session -> share link -> friend joins -> complete -> view summary

## Acceptance Criteria

- [x] Users can sign in with Google OAuth
- [x] Users can create trainings by typing natural language (AI parses to exercises)
- [x] Users can start a session and generate invite links (read/admin access)
- [x] Friends can join via invite link (forced login if not authenticated)
- [x] 1-3 participants visible on screen with body visualization
- [x] Body animation shows progress from thin to muscular (0-100%)
- [x] Users can input actual reps (e.g., 8/10) with percentage calculation
- [x] Email notifications sent on join and completion (via Supabase Edge Functions)
- [x] Users can view friends' upcoming trainings in feed and join
- [x] AI summary generated after training completion comparing participants
- [x] All UI is mobile-friendly and responsive
- [x] All tests pass, no type errors, linting passes, build succeeds

## Notes

- Use existing `useSupabaseQuery` hook for all read operations with real-time
- Use `protectedProcedure` for all authenticated tRPC mutations
- Follow shadcn/ui patterns for component styling
- SVG body should have distinct muscle groups that can be individually animated
- Consider Framer Motion for smoother CSS transitions if needed

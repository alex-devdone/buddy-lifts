# Supabase Edge Functions Setup

This directory contains Supabase Edge Functions for email notifications in the Buddy Lifts app.

## Functions

### 1. notify-join
Sends an email notification to the training session host when a new participant joins.

**Trigger:** INSERT on `session_participant` table

**Email includes:**
- Name of the participant who joined
- Training session name and description
- Participant role (read/admin)
- Timestamp of when they joined
- Link to view the active session

### 2. notify-complete
Sends an email notification to all participants when a training session is completed.

**Trigger:** UPDATE on `training_session` table when `status` changes to 'completed'

**Email includes:**
- Training session name and duration
- Individual completion percentage and rank
- Team results comparison table
- Session highlights (participants, exercises, average completion)
- Link to view training details

## Prerequisites

### 1. Enable pg_net Extension
The triggers use the `pg_net` extension to make HTTP requests from PostgreSQL. Enable it in your Supabase dashboard:

1. Go to Database > Extensions
2. Search for "pg_net"
3. Click to enable

Alternatively, run this SQL:
```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### 2. Configure Email (Resend)
Supabase uses Resend for email sending. Set up Resend in your Supabase dashboard:

1. Go to Authentication > Email Templates
2. Follow the prompts to set up Resend
3. Verify your sender domain

### 3. Set App Settings
Configure the Supabase URL and service role key as database settings:

```sql
-- Set your Supabase project URL
INSERT INTO app.settings (key, value)
VALUES ('supabase_url', 'https://your-project.supabase.co')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Set your service role key (already available in Supabase)
-- The triggers use: current_setting('app.settings.service_role_key', true)
```

## Deployment

### Deploy Edge Functions

1. Install the Supabase CLI:
```bash
brew install supabase/tap/supabase
```

2. Link to your Supabase project:
```bash
supabase link --project-ref your-project-ref
```

3. Deploy the functions:
```bash
supabase functions deploy notify-join
supabase functions deploy notify-complete
```

Or deploy all at once:
```bash
supabase functions deploy
```

### Set Function Permissions

After deployment, make sure the functions are accessible:

1. Go to Edge Functions in your Supabase dashboard
2. Click on each function
3. Ensure "Require authentication" is unchecked (the functions handle their own security via service role key)

### Deploy Database Triggers

Run the SQL files in the `triggers/` directory:

1. In Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase/triggers/notify-join-trigger.sql`
3. Run the query
4. Repeat for `supabase/triggers/notify-complete-trigger.sql`

Or via CLI:
```bash
psql "$DATABASE_URL" -f supabase/triggers/notify-join-trigger.sql
psql "$DATABASE_URL" -f supabase/triggers/notify-complete-trigger.sql
```

## Environment Variables

The edge functions use these environment variables (automatically available in Supabase):

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations

## Testing

### Test notify-join

1. Start a training session
2. Have a friend join via invite code
3. Host should receive an email notification

### Test notify-complete

1. Complete an active training session
2. All participants should receive an email with progress summary

## Troubleshooting

### Emails not sending
- Check if pg_net extension is enabled: `SELECT * FROM pg_extension WHERE extname = 'pg_net';`
- Verify Resend is configured in Authentication > Email Templates
- Check Edge Function logs in Supabase dashboard

### Triggers not firing
- Verify triggers exist: `SELECT * FROM pg_trigger WHERE tgname LIKE 'notify%';`
- Check trigger function logs in PostgreSQL logs
- Ensure `app.settings` table has the correct values

### pg_net not working
If pg_net is not available or not working, you can:
1. Use Supabase webhooks as an alternative
2. Call the edge functions directly from your API layer after database operations
3. Use pg_cron or a background worker job

### Local Development

To test edge functions locally:

```bash
supabase functions serve notify-join
supabase functions serve notify-complete
```

Then test with curl:

```bash
# Test notify-join
curl -X POST http://localhost:54321/functions/v1/notify-join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-service-role-key" \
  -d '{
    "old_record": null,
    "record": {
      "id": "test-id",
      "sessionId": "session-123",
      "odUserId": "user-123",
      "role": "read",
      "joinedAt": "2026-01-25T10:00:00Z"
    },
    "type": "INSERT",
    "table": "session_participant",
    "schema": "public"
  }'
```

## Alternative: API-Based Triggers

If database triggers are not feasible, the edge functions can be called directly from the API layer:

```typescript
// In packages/api/src/routers/session.ts
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "@buddy-lifts/env";

async function notifyParticipantJoin(sessionId: string, participantId: string) {
  await fetch(`${SUPABASE_URL}/functions/v1/notify-join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      sessionId,
      participantId,
    }),
  });
}

// Call this after successful join mutation
```

This approach gives you more control and easier debugging but requires code changes.

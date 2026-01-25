-- Trigger function to call notify-join edge function when a participant joins
CREATE OR REPLACE FUNCTION call_notify_join_function()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
  payload JSON;
  response TEXT;
  http_status INTEGER;
BEGIN
  -- Construct the edge function URL
  -- Replace with your Supabase project URL and function name
  edge_function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-join';

  -- Build the payload
  payload := json_build_object(
    'old_record', to_jsonb(OLD),
    'record', to_jsonb(NEW),
    'type', 'INSERT',
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA
  );

  -- Call the edge function asynchronously
  -- Note: This requires the pg_net extension to be installed
  -- Alternatively, use pg_http or implement as a background job
  SELECT
    content INTO response,
    status INTO http_status
  FROM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := payload::text,
    timeout_milliseconds := 5000
  );

  -- Log the result (optional)
  IF http_status != 200 THEN
    RAISE WARNING 'notify-join edge function failed: % %', http_status, response;
  END IF;

  -- Return the new row to allow the insert to proceed
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the insert if the edge function call fails
    RAISE WARNING 'Error calling notify-join edge function: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_participant_join ON session_participant;

-- Create trigger to call the edge function on INSERT
CREATE TRIGGER on_participant_join
AFTER INSERT ON session_participant
FOR EACH ROW
EXECUTE FUNCTION call_notify_join_function();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION call_notify_join_function() TO postgres;

COMMENT ON FUNCTION call_notify_join_function() IS 'Calls the notify-join edge function when a new participant joins a training session';

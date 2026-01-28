-- Trigger function to call notify-complete edge function when training session status changes to 'completed'
CREATE OR REPLACE FUNCTION call_notify_complete_function()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
  payload JSON;
  response TEXT;
  http_status INTEGER;
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status != 'completed' OR (OLD.status IS NOT NULL AND OLD.status = 'completed') THEN
    RETURN NEW;
  END IF;

  -- Construct the edge function URL
  -- Replace with your Supabase project URL and function name
  edge_function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-complete';

  -- Build the payload
  payload := json_build_object(
    'old_record', to_jsonb(OLD),
    'record', to_jsonb(NEW),
    'type', 'UPDATE',
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
    RAISE WARNING 'notify-complete edge function failed: % %', http_status, response;
  END IF;

  -- Return the new row to allow the update to proceed
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the update if the edge function call fails
    RAISE WARNING 'Error calling notify-complete edge function: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_session_complete ON training_session;

-- Create trigger to call the edge function on UPDATE when status changes to 'completed'
CREATE TRIGGER on_session_complete
AFTER UPDATE OF status ON training_session
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION call_notify_complete_function();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION call_notify_complete_function() TO postgres;

COMMENT ON FUNCTION call_notify_complete_function() IS 'Calls the notify-complete edge function when a training session status changes to completed';

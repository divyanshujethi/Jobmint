CREATE TABLE IF NOT EXISTS job_dead_letter_queue (
  id text PRIMARY KEY,
  company_name text,
  title text,
  source_url text,
  external_id text,
  raw_payload text,
  rejection_reason text NOT NULL,
  status text NOT NULL DEFAULT 'DROPPED',
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dlq_created_at ON job_dead_letter_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_dlq_rejection_reason ON job_dead_letter_queue(rejection_reason);

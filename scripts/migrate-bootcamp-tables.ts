import { db, sql } from "../packages/database/src/index";

async function main() {
  console.log("Creating bootcamp tables if not exist...");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS course_certificates (
      id text PRIMARY KEY NOT NULL,
      user_id text NOT NULL,
      course_id text NOT NULL,
      recipient_name text NOT NULL,
      recipient_email text NOT NULL,
      score integer DEFAULT 100 NOT NULL,
      github_url text,
      verification_hash text NOT NULL,
      issued_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS bootcamp_enrollments (
      id text PRIMARY KEY NOT NULL,
      user_id text NOT NULL,
      track_id text NOT NULL,
      student_name text NOT NULL,
      student_email text NOT NULL,
      student_phone text,
      college_name text NOT NULL,
      degree_branch text NOT NULL,
      roll_number text NOT NULL,
      github_username text,
      status text DEFAULT 'ACTIVE' NOT NULL,
      offer_letter_id text NOT NULL UNIQUE,
      noc_letter_id text NOT NULL UNIQUE,
      current_day integer DEFAULT 1 NOT NULL,
      unlocked_day integer DEFAULT 1 NOT NULL,
      github_fork_url text,
      os_contribution_pr_url text,
      os_contribution_status text DEFAULT 'NOT_STARTED' NOT NULL,
      capstone_repo_url text,
      certificate_id text,
      final_grade text,
      final_score integer,
      payment_order_id text,
      payment_status text DEFAULT 'PAID' NOT NULL,
      amount_paid integer DEFAULT 499 NOT NULL,
      enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS bootcamp_daily_submissions (
      id text PRIMARY KEY NOT NULL,
      enrollment_id text NOT NULL,
      user_id text NOT NULL,
      track_id text NOT NULL,
      day_number integer NOT NULL,
      day_title text NOT NULL,
      github_commit_url text NOT NULL,
      assignment_notes text,
      code_snippet text,
      passed_code_challenge boolean DEFAULT false,
      status text DEFAULT 'SUBMITTED' NOT NULL,
      mentor_feedback text,
      submitted_at timestamp with time zone DEFAULT now() NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `);

  console.log("MIGRATION_BOOTCAMP_TABLES_SUCCESS");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});

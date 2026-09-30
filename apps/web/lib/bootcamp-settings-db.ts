import { db, sql } from "@repo/database";

export interface TrackSettingRecord {
  trackId: string;
  admissionStatus: "OPEN" | "OPENING_SOON" | "WAITLIST" | "CLOSED";
  openingDate: string | null;
  cohortName: string | null;
  announcement: string | null;
  maxSeats: number | null;
  seatsRemaining: number | null;
  isFeatured: boolean;
  updatedAt?: string;
}

export interface WaitlistRecord {
  id: string;
  trackId: string;
  trackTitle?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  college?: string | null;
  degreeBranch?: string | null;
  notes?: string | null;
  notified: boolean;
  createdAt: string;
}

let tablesEnsured = false;

export async function ensureBootcampTables(): Promise<void> {
  if (tablesEnsured) return;

  try {
    // 1. Ensure bootcamp_track_settings exists
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS bootcamp_track_settings (
        track_id TEXT PRIMARY KEY,
        admission_status TEXT NOT NULL DEFAULT 'OPEN',
        opening_date TIMESTAMP WITH TIME ZONE,
        cohort_name TEXT,
        announcement TEXT,
        max_seats INTEGER,
        seats_remaining INTEGER,
        is_featured BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `));

    // 2. Ensure bootcamp_waitlist exists
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS bootcamp_waitlist (
        id TEXT PRIMARY KEY,
        track_id TEXT NOT NULL,
        track_title TEXT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        college TEXT,
        degree_branch TEXT,
        notes TEXT,
        notified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `));

    // 3. Ensure bootcamp_enrollments has noc_addressee and semester_year columns
    await db.execute(sql.raw(`
      ALTER TABLE bootcamp_enrollments ADD COLUMN IF NOT EXISTS noc_addressee TEXT;
      ALTER TABLE bootcamp_enrollments ADD COLUMN IF NOT EXISTS semester_year TEXT;
    `));

    tablesEnsured = true;
  } catch (err) {
    console.error("[BootcampDB] Error ensuring tables:", err);
  }
}

export async function getAllTrackSettings(): Promise<Record<string, TrackSettingRecord>> {
  await ensureBootcampTables();

  try {
    const res: any = await db.execute(
      sql.raw(`SELECT * FROM bootcamp_track_settings ORDER BY track_id ASC;`)
    );

    const rows: any[] = Array.isArray(res) ? res : res?.rows || [];
    const map: Record<string, TrackSettingRecord> = {};

    rows.forEach((r) => {
      map[r.track_id] = {
        trackId: r.track_id,
        admissionStatus: r.admission_status || "OPEN",
        openingDate: r.opening_date ? new Date(r.opening_date).toISOString() : null,
        cohortName: r.cohort_name || null,
        announcement: r.announcement || null,
        maxSeats: r.max_seats || null,
        seatsRemaining: r.seats_remaining || null,
        isFeatured: Boolean(r.is_featured),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      };
    });

    return map;
  } catch (err) {
    console.error("[BootcampDB] Error fetching track settings:", err);
    return {};
  }
}

export async function upsertTrackSetting(setting: Partial<TrackSettingRecord> & { trackId: string }) {
  await ensureBootcampTables();

  const trackId = setting.trackId.trim();
  const admissionStatus = setting.admissionStatus || "OPEN";
  const openingDateVal = setting.openingDate ? `'${new Date(setting.openingDate).toISOString()}'::timestamptz` : "NULL";
  const cohortNameVal = setting.cohortName ? `'${setting.cohortName.replace(/'/g, "''")}'` : "NULL";
  const announcementVal = setting.announcement ? `'${setting.announcement.replace(/'/g, "''")}'` : "NULL";
  const maxSeatsVal = typeof setting.maxSeats === "number" ? setting.maxSeats : "NULL";
  const seatsRemainingVal = typeof setting.seatsRemaining === "number" ? setting.seatsRemaining : "NULL";
  const isFeaturedVal = setting.isFeatured ? "TRUE" : "FALSE";

  const query = `
    INSERT INTO bootcamp_track_settings (
      track_id, admission_status, opening_date, cohort_name, announcement, max_seats, seats_remaining, is_featured, updated_at
    ) VALUES (
      '${trackId.replace(/'/g, "''")}',
      '${admissionStatus.replace(/'/g, "''")}',
      ${openingDateVal},
      ${cohortNameVal},
      ${announcementVal},
      ${maxSeatsVal},
      ${seatsRemainingVal},
      ${isFeaturedVal},
      NOW()
    )
    ON CONFLICT (track_id) DO UPDATE SET
      admission_status = EXCLUDED.admission_status,
      opening_date = EXCLUDED.opening_date,
      cohort_name = EXCLUDED.cohort_name,
      announcement = EXCLUDED.announcement,
      max_seats = EXCLUDED.max_seats,
      seats_remaining = EXCLUDED.seats_remaining,
      is_featured = EXCLUDED.is_featured,
      updated_at = NOW()
    RETURNING *;
  `;

  const res: any = await db.execute(sql.raw(query));
  const rows = Array.isArray(res) ? res : res?.rows || [];
  return rows[0] || null;
}

export async function addWaitlistEntry(entry: {
  trackId: string;
  trackTitle?: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  degreeBranch?: string;
  notes?: string;
}): Promise<WaitlistRecord> {
  await ensureBootcampTables();

  const id = crypto.randomUUID();
  const trackId = entry.trackId.replace(/'/g, "''");
  const trackTitle = entry.trackTitle ? `'${entry.trackTitle.replace(/'/g, "''")}'` : "NULL";
  const name = entry.name.replace(/'/g, "''");
  const email = entry.email.trim().toLowerCase().replace(/'/g, "''");
  const phone = entry.phone ? `'${entry.phone.replace(/'/g, "''")}'` : "NULL";
  const college = entry.college ? `'${entry.college.replace(/'/g, "''")}'` : "NULL";
  const degreeBranch = entry.degreeBranch ? `'${entry.degreeBranch.replace(/'/g, "''")}'` : "NULL";
  const notes = entry.notes ? `'${entry.notes.replace(/'/g, "''")}'` : "NULL";

  const query = `
    INSERT INTO bootcamp_waitlist (
      id, track_id, track_title, name, email, phone, college, degree_branch, notes, notified, created_at
    ) VALUES (
      '${id}', '${trackId}', ${trackTitle}, '${name}', '${email}', ${phone}, ${college}, ${degreeBranch}, ${notes}, FALSE, NOW()
    )
    RETURNING *;
  `;

  const res: any = await db.execute(sql.raw(query));
  const rows = Array.isArray(res) ? res : res?.rows || [];
  return rows[0] || { id, ...entry, notified: false, createdAt: new Date().toISOString() };
}

export async function getWaitlistEntries(): Promise<WaitlistRecord[]> {
  await ensureBootcampTables();

  try {
    const res: any = await db.execute(
      sql.raw(`SELECT * FROM bootcamp_waitlist ORDER BY created_at DESC;`)
    );
    const rows = Array.isArray(res) ? res : res?.rows || [];
    return rows.map((r: any) => ({
      id: r.id,
      trackId: r.track_id,
      trackTitle: r.track_title || null,
      name: r.name,
      email: r.email,
      phone: r.phone || null,
      college: r.college || null,
      degreeBranch: r.degree_branch || null,
      notes: r.notes || null,
      notified: Boolean(r.notified),
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("[BootcampDB] Error fetching waitlist entries:", err);
    return [];
  }
}

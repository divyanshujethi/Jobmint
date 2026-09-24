import { NextRequest, NextResponse } from 'next/server';
import { getLiveJobs } from '@/lib/db-jobs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'ALL';
    const mode = searchParams.get('mode') || 'ALL';
    const verified = searchParams.get('verified') === 'true';

    let jobs = await getLiveJobs();

    if (q) {
      const query = q.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.companyName.toLowerCase().includes(query) ||
          j.location.toLowerCase().includes(query) ||
          j.skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (type !== 'ALL') {
      jobs = jobs.filter((j) => j.jobType === type);
    }

    if (mode !== 'ALL') {
      jobs = jobs.filter((j) => j.workMode === mode);
    }

    if (verified) {
      jobs = jobs.filter((j) => j.isVerified);
    }

    return NextResponse.json({
      jobs,
      total: jobs.length,
      source: 'postgresql-jobmint-prod'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

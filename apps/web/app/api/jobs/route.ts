import { NextRequest, NextResponse } from 'next/server';
import { getLiveJobs, JOBS_CACHE_KEY } from '@/lib/db-jobs';
import { getCache } from '@/lib/redis';

export async function GET(req: NextRequest) {
  try {
    const wasCached = !!(await getCache(JOBS_CACHE_KEY));
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

    return NextResponse.json(
      {
        jobs,
        total: jobs.length,
        source: wasCached ? 'redis-cache-hit' : 'postgresql-db-miss',
      },
      {
        headers: {
          'X-Cache': wasCached ? 'HIT' : 'MISS',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

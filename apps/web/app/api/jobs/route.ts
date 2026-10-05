import { NextRequest, NextResponse } from 'next/server';
import { getLiveJobs, JOBS_CACHE_KEY } from '@/lib/db-jobs';
import { getCache } from '@/lib/redis';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'ALL';
    const mode = searchParams.get('mode') || 'ALL';
    const experience = searchParams.get('exp') || searchParams.get('experience') || 'ALL';
    const locationParam = searchParams.get('location') || searchParams.get('loc') || 'ALL';
    const verified = searchParams.get('verified') === 'true';

    const cacheKey = `${JOBS_CACHE_KEY}:${type !== 'ALL' ? type : 'ALL'}:4000`;
    const wasCached = !!(await getCache(cacheKey)) || !!(await getCache(JOBS_CACHE_KEY));

    let jobs = await getLiveJobs({ limit: 4000, jobType: type });

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
      const targetMode = mode.toUpperCase().replace(/[-_]/g, '');
      jobs = jobs.filter((j) => {
        const jMode = (j.workMode || '').toUpperCase().replace(/[-_]/g, '');
        if (targetMode === 'ONSITE') return jMode.includes('ONSITE') || jMode.includes('OFFICE');
        if (targetMode === 'REMOTE') return jMode.includes('REMOTE');
        if (targetMode === 'HYBRID') return jMode.includes('HYBRID');
        return j.workMode === mode;
      });
    }

    if (experience !== 'ALL') {
      jobs = jobs.filter((j) => {
        const exp = j.experienceYears ?? 0;
        if (experience === '0' || experience === 'FRESHER') return exp === 0 || j.jobType === 'INTERNSHIP';
        if (experience === '1-2') return exp >= 1 && exp <= 2;
        if (experience === '3-5') return exp >= 3 && exp <= 5;
        if (experience === '5+') return exp >= 5;
        return true;
      });
    }

    if (locationParam !== 'ALL') {
      const loc = locationParam.toLowerCase();
      jobs = jobs.filter((j) => {
        const jLoc = (j.location || '').toLowerCase();
        if (loc === 'bengaluru' || loc === 'bangalore') {
          return jLoc.includes('bengaluru') || jLoc.includes('bangalore');
        }
        if (loc === 'delhi_ncr' || loc === 'delhi' || loc === 'ncr') {
          return jLoc.includes('delhi') || jLoc.includes('noida') || jLoc.includes('gurgaon') || jLoc.includes('gurugram') || jLoc.includes('ncr');
        }
        if (loc === 'hyderabad') return jLoc.includes('hyderabad');
        if (loc === 'pune') return jLoc.includes('pune');
        if (loc === 'mumbai') return jLoc.includes('mumbai');
        if (loc === 'remote') {
          const jMode = (j.workMode || '').toUpperCase();
          return jMode.includes('REMOTE') || jLoc.includes('remote');
        }
        if (loc === 'india') return jLoc.includes('india');
        return jLoc.includes(loc);
      });
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

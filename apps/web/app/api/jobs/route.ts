import { NextRequest, NextResponse } from 'next/server';
import { getLiveJobs, getTotalActiveJobsCount, JOBS_CACHE_KEY } from '@/lib/db-jobs';
import { getCache } from '@/lib/redis';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    // Rate limit: 120 requests per minute per IP for public jobs feed
    const rateLimit = await checkRateLimit(req, {
      maxRequests: 120,
      windowSeconds: 60,
      prefix: "rl:jobs",
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: "You have exceeded the rate limit. Please try again shortly.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetInSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetInSeconds),
          },
        }
      );
    }
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const rawType = searchParams.get('type') || 'ALL';
    // Normalize type parameter to handle lowercase or uppercase gracefully
    const type = rawType.toUpperCase();
    const mode = searchParams.get('mode') || 'ALL';
    const experience = searchParams.get('exp') || searchParams.get('experience') || 'ALL';
    const locationParam = searchParams.get('location') || searchParams.get('loc') || 'ALL';
    const verified = searchParams.get('verified') === 'true';

    // Pagination & Projection parameters
    const cursor = searchParams.get('cursor');
    const page = parseInt(searchParams.get('page') || '0', 10);
    const limitParam = searchParams.get('limit');
    const isFull = searchParams.get('full') === 'true' || searchParams.get('fields') === 'full';

    // Fetch total count and live jobs concurrently from Postgres backed by Redis
    const [totalCatalogCount, allFetchedJobs] = await Promise.all([
      getTotalActiveJobsCount(type),
      getLiveJobs({
        limit: 10000,
        jobType: type,
        includeDetails: isFull,
      }),
    ]);

    let filtered = allFetchedJobs;

    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.companyName.toLowerCase().includes(query) ||
          j.location.toLowerCase().includes(query) ||
          j.skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (type !== 'ALL') {
      filtered = filtered.filter((j) => (j.jobType || '').toUpperCase() === type);
    }

    if (mode !== 'ALL') {
      const targetMode = mode.toUpperCase().replace(/[-_]/g, '');
      filtered = filtered.filter((j) => {
        const jMode = (j.workMode || '').toUpperCase().replace(/[-_]/g, '');
        if (targetMode === 'ONSITE') return jMode.includes('ONSITE') || jMode.includes('OFFICE');
        if (targetMode === 'REMOTE') return jMode.includes('REMOTE');
        if (targetMode === 'HYBRID') return jMode.includes('HYBRID');
        return j.workMode === mode;
      });
    }

    if (experience !== 'ALL') {
      filtered = filtered.filter((j) => {
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
      filtered = filtered.filter((j) => {
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
      filtered = filtered.filter((j) => j.isVerified);
    }

    const hasUserFilters = Boolean(
      q ||
      mode !== 'ALL' ||
      experience !== 'ALL' ||
      locationParam !== 'ALL' ||
      verified
    );

    const total = hasUserFilters ? filtered.length : totalCatalogCount;

    // Handle cursor or page pagination
    let paginatedJobs = filtered;
    let nextCursor: string | null = null;
    let hasMore = false;

    if (cursor || limitParam || page > 0) {
      const pageSize = Math.min(Math.max(1, parseInt(limitParam || '50', 10)), 1000);

      let startIndex = 0;
      if (cursor) {
        const cursorIdx = filtered.findIndex((j) => j.id === cursor);
        if (cursorIdx !== -1) {
          startIndex = cursorIdx + 1;
        }
      } else if (page > 1) {
        startIndex = (page - 1) * pageSize;
      }

      paginatedJobs = filtered.slice(startIndex, startIndex + pageSize);
      hasMore = startIndex + pageSize < filtered.length;
      if (hasMore && paginatedJobs.length > 0) {
        nextCursor = paginatedJobs[paginatedJobs.length - 1].id;
      }
    }

    return NextResponse.json(
      {
        jobs: paginatedJobs,
        total,
        totalCatalog: totalCatalogCount,
        count: paginatedJobs.length,
        hasMore,
        nextCursor,
        projection: isFull ? 'full' : 'lean',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

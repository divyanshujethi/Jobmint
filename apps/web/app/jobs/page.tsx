import { getLiveJobs } from "@/lib/db-jobs";
import { getPlatformMetrics } from "@/lib/platform-metrics";
import { JobsFeedClient } from "@/components/jobs-feed-client";

export const revalidate = 60; // Revalidate every 60s for lightning fast SSR with fresh database jobs

export default async function JobsPage() {
  const [initialJobs, metrics] = await Promise.all([
    getLiveJobs({ limit: 60 }),
    getPlatformMetrics(),
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Verified Tech Jobs in India and Remote — RoleNest",
    description:
      "Explore verified software engineering, AI, and developer jobs with direct ATS links and ghosting protection.",
    numberOfItems: initialJobs.length,
    itemListElement: initialJobs.slice(0, 30).map((job, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "JobPosting",
        title: job.title,
        description: job.description || `${job.title} opportunity at ${job.companyName}`,
        datePosted: job.postedAt || new Date().toISOString(),
        validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        employmentType:
          job.jobType === "FULL_TIME" ? "FULL_TIME" : job.jobType === "INTERNSHIP" ? "INTERN" : "OTHER",
        hiringOrganization: {
          "@type": "Organization",
          name: job.companyName,
          sameAs: `https://rolenest.in/companies/${job.companySlug}`,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location || "Remote",
            addressCountry: "IN",
          },
        },
        jobLocationType: job.workMode === "REMOTE" ? "TELECOMMUTE" : undefined,
        applicantLocationRequirements: job.workMode === "REMOTE" ? { "@type": "Country", name: "India" } : undefined,
        url: `https://rolenest.in/jobs/${job.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <JobsFeedClient
        initialJobs={initialJobs}
        initialTotal={metrics.activeJobs}
        initialVerified24h={metrics.verified24hCount}
        initialLastCrawl={metrics.lastCrawlTime}
      />
      <noscript>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="text-xl font-bold mb-4 text-slate-900">
            Verified Tech Openings ({initialJobs.length} loaded)
          </h2>
          <div className="space-y-4">
            {initialJobs.map((job) => (
              <article key={job.id} className="p-4 bg-white rounded-xl border border-slate-200">
                <a
                  href={`/jobs/${job.slug}`}
                  className="text-base font-bold text-emerald-600 hover:underline"
                >
                  {job.title}
                </a>
                <p className="text-sm text-slate-600 mt-1">
                  <strong>{job.companyName}</strong> • {job.location || "Remote"} • {job.jobType}
                </p>
                {job.salaryOrStipend && (
                  <p className="text-xs text-slate-500 mt-1">{job.salaryOrStipend}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </noscript>
    </>
  );
}

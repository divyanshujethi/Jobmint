import { getLiveJobs, getTotalActiveJobsCount } from "@/lib/db-jobs";
import { JobsFeedClient } from "@/components/jobs-feed-client";

export const revalidate = 60; // Revalidate every 60s for lightning fast SSR with fresh database jobs

export default async function JobsPage() {
  const [initialJobs, initialTotal] = await Promise.all([
    getLiveJobs({ limit: 60 }),
    getTotalActiveJobsCount(),
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Verified Tech Jobs in India and Remote — Role Nest",
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
      <JobsFeedClient initialJobs={initialJobs} initialTotal={initialTotal} />
    </>
  );
}

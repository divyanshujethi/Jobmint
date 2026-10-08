import { getLiveJobs, getTotalActiveJobsCount } from "@/lib/db-jobs";
import { InternshipsFeedClient } from "@/components/internships-feed-client";

export const revalidate = 60; // Revalidate every 60s for fresh database internships

export default async function InternshipsPage() {
  const [initialInternships, initialTotal] = await Promise.all([
    getLiveJobs({ limit: 40, jobType: "INTERNSHIP" }),
    getTotalActiveJobsCount("INTERNSHIP"),
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Paid Tech Internships in India & Remote — Role Nest",
    description:
      "Explore verified software engineering, AI, and developer internships with official stipends and direct ATS apply links.",
    numberOfItems: initialInternships.length,
    itemListElement: initialInternships.slice(0, 30).map((internship, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "JobPosting",
        title: internship.title,
        description:
          internship.description || `${internship.title} internship opportunity at ${internship.companyName}`,
        datePosted: internship.postedAt || new Date().toISOString(),
        validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        employmentType: "INTERN",
        hiringOrganization: {
          "@type": "Organization",
          name: internship.companyName,
          sameAs: `https://rolenest.in/companies/${internship.companySlug}`,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: internship.location || "Remote",
            addressCountry: "IN",
          },
        },
        jobLocationType: internship.workMode === "REMOTE" ? "TELECOMMUTE" : undefined,
        applicantLocationRequirements:
          internship.workMode === "REMOTE" ? { "@type": "Country", name: "India" } : undefined,
        url: `https://rolenest.in/jobs/${internship.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <InternshipsFeedClient initialInternships={initialInternships} initialTotal={initialTotal} />
    </>
  );
}

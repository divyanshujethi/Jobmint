import { getLiveCompanies } from "@/lib/db-companies";
import { CompaniesFeedClient } from "@/components/companies-feed-client";

export const revalidate = 60; // Revalidate every 60s for fresh database company profiles

export default async function CompaniesDirectoryPage() {
  const companies = await getLiveCompanies();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Tech Employers & Transparent Companies in India — RoleNest",
    description:
      "Browse verified tech employers, unicorns, and emerging startups actively hiring engineers in India with Truth Teller transparency metrics.",
    numberOfItems: companies.length,
    itemListElement: companies.slice(0, 30).map((company, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Organization",
        name: company.name,
        url: company.website || `https://rolenest.in/companies/${company.slug}`,
        description: company.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: company.location || "India",
          addressCountry: "IN",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <CompaniesFeedClient initialCompanies={companies} />
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLiveJobs, getLiveJobBySlug } from "@/lib/db-jobs";
import { resolvePseoCategory } from "@/lib/pseo-data";
import { PseoLanding } from "@/components/pseo-landing";
import { JobApplyButton } from "@/components/job-apply-button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building2, ShieldCheck, ArrowRight } from "lucide-react";

interface InternshipPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: InternshipPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pseo = resolvePseoCategory(slug);

  if (pseo) {
    const title = pseo.metaTitle.includes("Internship")
      ? pseo.metaTitle
      : pseo.metaTitle.replace("Jobs", "Internships & Fresher Roles");

    return {
      title,
      description: pseo.metaDescription,
      alternates: {
        canonical: `https://rolenest.in/internships/${slug}`,
      },
      openGraph: {
        title,
        description: pseo.metaDescription,
        url: `https://rolenest.in/internships/${slug}`,
        siteName: "Role Nest",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: pseo.metaDescription,
      },
    };
  }

  const job = await getLiveJobBySlug(slug);
  if (job) {
    return {
      title: `${job.title} at ${job.companyName} | Role Nest Internships`,
      description: `Apply for ${job.title} at ${job.companyName} (${job.location}). Verified stipend: ${job.salaryOrStipend || "Competitive"}. Direct ATS apply link with anti-ghosting follow-up tracking.`,
      alternates: {
        canonical: `https://rolenest.in/internships/${slug}`,
      },
    };
  }

  return {
    title: "Verified IT Internships in India | Role Nest",
    description: "Browse verified engineering and tech internships across top Indian tech hubs with direct ATS applications.",
  };
}

export default async function InternshipSlugPage({ params }: InternshipPageProps) {
  const { slug } = await params;

  // 1. Check if it's a programmatic SEO landing page
  const pseo = resolvePseoCategory(slug);
  if (pseo) {
    const allJobs = await getLiveJobs();
    // Filter specifically for internships or fresher entry roles matching the query
    const internshipJobs = allJobs.filter((j) => {
      const isIntern =
        j.jobType === "INTERNSHIP" ||
        j.experienceYears <= 1 ||
        j.title.toLowerCase().includes("intern") ||
        j.title.toLowerCase().includes("fresher");
      return isIntern && pseo.filterFn(j);
    });

    // Provide topic customized for internships
    const internshipTopic = {
      ...pseo,
      heading: pseo.heading.includes("Internship")
        ? pseo.heading
        : `${pseo.heading} Internships`,
      subheading: `Verified tech internships and early-career roles with transparent stipends and direct ATS apply links.`,
    };

    return <PseoLanding topic={internshipTopic} jobs={internshipJobs} />;
  }

  // 2. Check if it matches an individual internship posting
  const job = await getLiveJobBySlug(slug);
  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link href="/internships" className="hover:text-emerald-700">Internships</Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-xs">{job.title}</span>
      </div>

      {/* Internship Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified ATS Direct Apply
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {job.companyName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span>•</span>
              <span className="font-bold text-emerald-700">
                {job.salaryOrStipend || "Competitive Stipend"}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <JobApplyButton
              jobId={job.id}
              jobTitle={job.title}
              companyName={job.companyName}
              requiredSkills={job.skills}
              jobDescription={job.description}
              source={job.source}
              sourceUrl={job.sourceUrl}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <div className="pt-4 border-t border-slate-100 space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-bold text-slate-900 text-base">About this Internship</h2>
          <p>{job.description}</p>
        </div>

        {/* Application details */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-600">
            Apply directly on official company portal. No middleman agencies.
          </span>
          <JobApplyButton
            jobId={job.id}
            jobTitle={job.title}
            companyName={job.companyName}
            requiredSkills={job.skills}
            jobDescription={job.description}
            source={job.source}
            sourceUrl={job.sourceUrl}
          />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { MockJob } from "@/lib/mock-jobs";
import { PseoTopic, PSEO_TOPICS } from "@/lib/pseo-data";
import { JobCard } from "@/components/job-card";
import {
  Sparkles,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PseoLandingProps {
  topic: PseoTopic;
  jobs: MockJob[];
}

export function PseoLanding({ topic, jobs }: PseoLandingProps) {
  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rolenest.in",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Jobs",
        "item": "https://rolenest.in/jobs",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": topic.title,
        "item": `https://rolenest.in/jobs/${topic.slug}`,
      },
    ],
  };

  // FAQPage Schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/jobs" className="hover:text-emerald-600 transition-colors">
          Jobs
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-800 font-semibold">{topic.title}</span>
      </nav>

      {/* HERO HEADER */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Programmatic Hiring Directory
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-0.5 text-xs font-mono text-slate-300">
              Updated Daily
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {topic.heading}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {topic.subheading}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> 100% Verified Telemetry
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Briefcase className="h-4 w-4 text-slate-400" /> {jobs.length} Active Listings
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="h-4 w-4 text-slate-400" /> Under 3 Days Median Review
            </div>
          </div>
        </div>
      </div>

      {/* JOBS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Verified Postings</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
              {jobs.length} roles available
            </span>
          </h2>
          <Link href="/jobs" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View all categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
            <Briefcase className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-sm text-slate-600 font-medium">
              No direct matches currently active for this specific criteria.
            </p>
            <Link href="/jobs">
              <Button size="sm" variant="outline" className="text-xs">
                Browse All Open Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* RELATED SEARCHES / TOPIC CLUSTERS */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <TrendingUp className="h-4 w-4 text-emerald-600" /> Related Career Searches & Hubs
        </div>
        <div className="flex flex-wrap gap-2">
          {topic.relatedSlugs.map((relSlug) => {
            const relTopic = PSEO_TOPICS[relSlug];
            const label = relTopic ? relTopic.title : relSlug.replace(/-/g, " ");
            return (
              <Link
                key={relSlug}
                href={`/jobs/${relSlug}`}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-medium text-slate-700 hover:text-emerald-700 transition-colors"
              >
                {label} →
              </Link>
            );
          })}
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS (RICH SNIPPETS) */}
      {topic.faqs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Frequently Asked Questions regarding {topic.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {topic.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { ImageResponse } from "next/og";
import { getLiveJobBySlug } from "@/lib/db-jobs";
import { resolvePseoCategory } from "@/lib/pseo-data";

export const runtime = "nodejs";
export const alt = "Role Nest Tech Careers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getLiveJobBySlug(slug);
  const pseo = !job ? resolvePseoCategory(slug) : null;

  const title = job ? job.title : pseo ? pseo.heading : "Verified Tech Careers | Role Nest";
  const subtitle = job
    ? `${job.companyName} • ${job.location} (${job.workMode})`
    : pseo
    ? "Verified Tech Jobs with Real-Time Recruiter Telemetry"
    : "Verified Software Engineer Jobs & High-Stipend Internships";
  const salary = job?.salaryOrStipend || "Competitive Compensation";
  const tag = job?.jobType?.replace("_", " ") || (pseo ? "CURATED COLLECTION" : "VERIFIED OPPORTUNITY");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#020617",
          backgroundImage: "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 70px",
          fontFamily: "sans-serif",
          color: "#f8fafc",
          border: "12px solid #0f172a",
        }}
      >
        {/* TOP BRAND HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "bold",
                color: "#020617",
              }}
            >
              RN
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px", color: "#ffffff" }}>
                Role Nest
              </div>
              <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                Truth Teller Career Platform
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#34d399",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "0.5px",
            }}
          >
            ✓ VERIFIED RECRUITER ACTIVE
          </div>
        </div>

        {/* MIDDLE CONTENT: JOB TITLE & COMPANY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: "#1e293b",
                color: "#93c5fd",
                fontSize: "15px",
                fontWeight: "700",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              {tag}
            </span>
            {job?.isFeatured && (
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(245, 158, 11, 0.2)",
                  color: "#fbbf24",
                  fontSize: "15px",
                  fontWeight: "700",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                }}
              >
                ★ FEATURED PLACEMENT
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: title.length > 35 ? "48px" : "58px",
              fontWeight: "900",
              lineHeight: 1.15,
              color: "#ffffff",
              letterSpacing: "-1px",
              maxWidth: "1050px",
            }}
          >
            {title}
          </div>

          <div style={{ fontSize: "24px", color: "#cbd5e1", fontWeight: "500" }}>
            {subtitle}
          </div>
        </div>

        {/* BOTTOM STATS & SALARY FOOTER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "2px solid #1e293b",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{ fontSize: "14px", color: "#64748b", textTransform: "uppercase", fontFamily: "monospace" }}>
              Compensation
            </span>
            <span style={{ fontSize: "28px", fontWeight: "900", color: "#34d399", fontFamily: "monospace" }}>
              {salary}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#94a3b8", fontSize: "15px" }}>
            <span>rolenest.in/jobs/{slug}</span>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: "10px",
                backgroundColor: "#10b981",
                color: "#020617",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Apply on Role Nest →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

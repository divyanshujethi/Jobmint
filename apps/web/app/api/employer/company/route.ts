import { NextRequest, NextResponse } from "next/server";
import { db, companies, companyMembers, users, eq } from "@repo/database";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await db
      .select({
        company: companies,
        role: companyMembers.role,
      })
      .from(companyMembers)
      .innerJoin(companies, eq(companyMembers.companyId, companies.id))
      .where(eq(companyMembers.userId, session.user.id))
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ company: null });
    }

    return NextResponse.json({
      company: membership[0].company,
      role: membership[0].role,
    });
  } catch (error: any) {
    console.error("Error fetching employer company:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to create a company profile." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, website, location, industry, description, gstin, corporateEmail } = body;

    if (!name || !website) {
      return NextResponse.json(
        { error: "Company name and website are required." },
        { status: 400 }
      );
    }

    const effectiveEmail = (corporateEmail || session.user.email || "").toLowerCase();
    const emailDomain = effectiveEmail.split("@")[1] || "";
    
    let websiteDomain = "";
    try {
      const url = new URL(website.startsWith("http") ? website : `https://${website}`);
      websiteDomain = url.hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      websiteDomain = website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
    }

    const freeMailProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "proton.me", "live.com"];
    const isFreeMail = freeMailProviders.includes(emailDomain);
    const domainMatches = !isFreeMail && (emailDomain === websiteDomain || emailDomain.endsWith(`.${websiteDomain}`));

    const isVerified = Boolean(domainMatches);
    const verificationMethod = isVerified ? "WORK_EMAIL" : (isFreeMail ? "MANUAL" : "PENDING_ADMIN_REVIEW");

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;

    // Create Company in PostgreSQL
    const [newCompany] = await db
      .insert(companies)
      .values({
        name: name.trim(),
        slug,
        website: website.trim(),
        domain: websiteDomain,
        corporateEmail: effectiveEmail,
        location: location || "Remote",
        industry: industry || "Technology",
        description: description || "",
        gstin: gstin ? gstin.trim().toUpperCase() : null,
        isVerified,
        verificationMethod,
        verifiedAt: isVerified ? new Date() : null,
      })
      .returning();

    // Link user to company
    await db.insert(companyMembers).values({
      companyId: newCompany.id,
      userId: session.user.id,
      role: "OWNER",
    });

    // Update user role to EMPLOYER
    await db.update(users).set({ role: "EMPLOYER" }).where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      company: newCompany,
      isVerified,
      message: isVerified
        ? "Company profile verified via corporate email domain match!"
        : "Company profile created. Pending administrative review due to public email domain.",
    });
  } catch (error: any) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
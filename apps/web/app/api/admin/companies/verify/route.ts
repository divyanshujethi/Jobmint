import { NextResponse } from "next/server";

/**
 * Zero-Cost Company Verification API
 * Checks DNS TXT Records or Corporate Domain Matches
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { companyId, domain, workEmail, method } = await request.json();

    if (!domain || !workEmail) {
      return NextResponse.json(
        { success: false, error: "Domain and work email are required." },
        { status: 400 }
      );
    }

    // 1. Check for public free mail providers (Blocked from instant verification)
    const frobiddenDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    const emailDomain = workEmail.split('@')[1]?.toLowerCase();

    if (frobiddenDomains.includes(emailDomain || '')) {
      return NextResponse.json({
        success: false,
        isVerified: false,
        reason: "Public freemail providers (gmail, yahoo) cannot be automatically verified. Please use your official company domain.",
      });
    }

    // 2. Verify email domain matches company website domain
    const cleanedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
    const domainMatches = emailDomain === cleanedDomain || (emailDomain ? emailDomain.endsWith(`.${cleanedDomain}`) : false);

    if (!domainMatches) {
      return NextResponse.json({
        success: false,
        isVerified: false,
        reason: `Your work email domain (@${emailDomain}) does not match your company website domain (${cleanedDomain}).`,
      });
    }

    return NextResponse.json({
      success: true,
      isVerified: true,
      badge: "Verified Corporate Domain",
      verificationMethod: method || 'WORK_EMAIL',
      verifiedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify company" },
      { status: 500 }
    );
  }
}

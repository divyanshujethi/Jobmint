import { NextRequest, NextResponse } from "next/server";
import {
  db,
  applications,
  jobs,
  companies,
  candidateProfiles,
  users,
  courseCertificates,
  desc,
  eq,
} from "@repo/database";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
        source: "postgresql-jobmint-prod",
      });
    }

    // Query authenticated user
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
        source: "postgresql-jobmint-prod",
      });
    }

    const currentUserId = userList[0].id;
    const notifs: any[] = [];
    const now = Date.now();

    // Query candidate profile
    const profileList = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, currentUserId))
      .limit(1);

    if (profileList.length > 0) {
      const candidateProfileId = profileList[0].id;
      const userApps = await db
        .select({
          id: applications.id,
          status: applications.status,
          appliedAt: applications.appliedAt,
          lastViewedAt: applications.lastViewedAt,
          jobTitle: jobs.title,
          jobSlug: jobs.slug,
          companyName: companies.name,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(applications.candidateProfileId, candidateProfileId))
        .orderBy(desc(applications.appliedAt))
        .limit(10);

      for (const app of userApps) {
        const days = Math.floor(
          (now - new Date(app.appliedAt).getTime()) / (1000 * 60 * 60 * 24)
        );

        notifs.push({
          id: `notif-app-${app.id}`,
          type: "VIEWED",
          title: `Applied: ${app.jobTitle}`,
          message: `Your application to ${app.companyName} was submitted. Truth Teller telemetry is tracking recruiter activity.`,
          timestampAgo: days === 0 ? "Today" : `${days}d ago`,
          isRead: false,
          linkUrl: "/applications",
        });

        if (app.lastViewedAt) {
          notifs.push({
            id: `notif-view-${app.id}`,
            type: "VIEWED",
            title: `Resume Viewed by ${app.companyName}`,
            message: `A recruiter from ${app.companyName} reviewed your resume for ${app.jobTitle}.`,
            timestampAgo: "Recent",
            isRead: false,
            linkUrl: "/applications",
          });
        }

        if (!app.lastViewedAt && days >= 7) {
          notifs.push({
            id: `notif-ghost-${app.id}`,
            type: "GHOSTING",
            title: `Truth Teller Inactivity Alert (${days}d)`,
            message: `${app.companyName} has not viewed your application in ${days} days. We recommend applying to active roles.`,
            timestampAgo: `${days}d ago`,
            isRead: false,
            linkUrl: "/applications",
          });
        }
      }
    }

    // Query real course certificates
    try {
      const earnedCerts = await db
        .select()
        .from(courseCertificates)
        .where(eq(courseCertificates.userId, currentUserId))
        .orderBy(desc(courseCertificates.issuedAt))
        .limit(5);

      for (const cert of earnedCerts) {
        notifs.push({
          id: `notif-cert-${cert.id}`,
          type: "SHORTLISTED",
          title: "Verified Certificate Earned!",
          message: `Congratulations! You passed the technical examination for ${cert.courseId} with a verified grade of ${cert.score}%.`,
          timestampAgo: "Verified",
          isRead: false,
          linkUrl: `/certificates/verify/${cert.id}`,
        });
      }
    } catch {}

    return NextResponse.json({
      notifications: notifs,
      unreadCount: notifs.filter((n) => !n.isRead).length,
      source: "postgresql-jobmint-prod",
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json({ success: true, message: "All notifications marked as read" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { auth } from "@/auth";
import { verifyAdminSession } from "@/lib/api-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BootcampAdminPanelClient } from "./admin-client";

export const metadata = {
  title: "Internship & Bootcamp Admin Command Center",
  description: "Manage virtual internships, track admission statuses, opening soon schedules, and student progress.",
};

export default async function BootcampAdminPage() {
  const session = await auth();

  // 1. If not logged in, redirect to login
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // 2. Strict SuperAdmin verification
  const userEmail = session.user.email?.toLowerCase();
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              403 Access Denied
            </span>
            <h1 className="text-2xl font-black text-white">
              SuperAdmin Clearance Required
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account <strong>{session.user.email}</strong> is not authorized to manage internship admissions and student records on RoleNest.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/">
              <Button variant="outline" className="w-full text-xs text-slate-300">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Return to Internship Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <BootcampAdminPanelClient userEmail={userEmail || ""} />;
}

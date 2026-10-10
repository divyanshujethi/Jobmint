import { Metadata } from 'next';
import { auth } from '@/auth';
import { verifyAdminSession } from '@/lib/api-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSystemDashboard from './client/client-page';

export const metadata: Metadata = {
  title: "Zero-Cost Quota Monitor & Architecture | RoleNest",
  description: "Live cloud resource consumption and quota circuit breakers for RoleNest infrastructure.",
};

export default async function AdminSystemPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin/system");
  }

  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <Lock className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              403 Access Denied
            </span>
            <h1 className="text-2xl font-bold text-white">SuperAdmin Clearance Required</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account <strong>{session.user.email}</strong> is not listed as an authorized administrator.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/">
              <Button variant="outline" className="w-full text-xs text-slate-300">
                Return to RoleNest Board
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminSystemDashboard />;
}


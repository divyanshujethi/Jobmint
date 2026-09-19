"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_CONFIG, UserRole } from "@repo/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, Building, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<string>(UserRole.CANDIDATE);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // After registration redirect to role-specific onboarding
    if (role === UserRole.CANDIDATE) {
      window.location.href = "/onboarding/candidate";
    } else {
      window.location.href = "/onboarding/employer";
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-200 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg">
            J
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Join {APP_CONFIG.name}
          </CardTitle>
          <CardDescription>
            Choose your account type to get started for free
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* ROLE TOGGLE */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole(UserRole.CANDIDATE)}
                className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                  role === UserRole.CANDIDATE
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-600"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <GraduationCap className="h-5 w-5 mb-1.5 text-emerald-600" />
                <span className="text-xs font-bold">Candidate / Student</span>
                <span className="text-[10px] text-slate-500">Find jobs & roadmaps</span>
              </button>

              <button
                type="button"
                onClick={() => setRole(UserRole.EMPLOYER)}
                className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                  role === UserRole.EMPLOYER
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-600"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <Building className="h-5 w-5 mb-1.5 text-emerald-600" />
                <span className="text-xs font-bold">Employer / Company</span>
                <span className="text-[10px] text-slate-500">Hire young talent</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Aman Sharma or Acme Recruiter"
                  className="pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder={role === UserRole.CANDIDATE ? "student@college.edu" : "recruiter@company.com"}
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? "Creating account..." : `Create ${role === UserRole.CANDIDATE ? "Candidate" : "Employer"} Account`}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

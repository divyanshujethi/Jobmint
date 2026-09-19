"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_CONFIG } from "@repo/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Submit via NextAuth credentials
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-200 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg">
            J
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back to {APP_CONFIG.name}
          </CardTitle>
          <CardDescription>
            Enter your email below to log into your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="student@college.edu or recruiter@company.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <Link href="#" className="text-xs text-emerald-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in to Account"}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            <p>
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-semibold text-emerald-600 hover:underline">
                Create free account <ArrowRight className="inline h-3 w-3" />
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

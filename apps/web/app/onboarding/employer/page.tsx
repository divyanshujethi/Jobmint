"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building, ShieldCheck, ArrowRight, Check } from "lucide-react";

export default function EmployerOnboardingPage() {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("AI & Software Development");
  const [description, setDescription] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
            <Building className="h-3.5 w-3.5 text-emerald-600" /> Employer Setup
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Create Your Company Profile
          </CardTitle>
          <CardDescription>
            Join companies hiring high-quality students and freshers with verifiable transparency.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleComplete}>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Company Name
              </label>
              <Input
                type="text"
                placeholder="e.g. ABC Technologies"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Company Website
                </label>
                <Input
                  type="url"
                  placeholder="https://abctech.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Headquarters Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Bangalore, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Industry Sector
              </label>
              <Input
                type="text"
                placeholder="e.g. AI / Machine Learning, SaaS, Web3, FinTech"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Short Description
              </label>
              <textarea
                className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 min-h-[90px]"
                placeholder="Tell candidates what your company builds and what kind of young talent you are looking for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Our Transparency Commitment:</span>
                <p className="mt-0.5 text-emerald-800">
                  By joining JobMint, you commit to reviewing applications promptly or notifying candidates. This gives your company the &quot;Fast Reviewer ✓&quot; badge!
                </p>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full font-bold gap-2" disabled={isSaved}>
              {isSaved ? (
                <>
                  <Check className="h-5 w-5" /> Company Profile Created!
                </>
              ) : (
                <>
                  Complete Setup & Post Job <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

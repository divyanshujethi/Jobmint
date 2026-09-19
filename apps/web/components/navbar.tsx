"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_CONFIG } from "@repo/shared";
import { Sparkles, Briefcase, Compass, Building2, Menu, X, ShieldCheck, Zap } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
              J
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {APP_CONFIG.name}
              </span>
              <span className="hidden text-[10px] font-medium text-emerald-600 -mt-1 sm:block">
                Truth & Transparency
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              Jobs
            </Link>
            <Link
              href="/internships"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Internships
            </Link>
            <Link
              href="/recommendations"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Zap className="h-4 w-4 text-emerald-600" />
              For You
            </Link>
            <Link
              href="/roadmaps"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Compass className="h-4 w-4 text-blue-500" />
              Roadmaps
              <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700">
                Free
              </span>
            </Link>
            <Link
              href="/applications"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              My Applications
            </Link>
            <Link
              href="/companies"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Building2 className="h-4 w-4" />
              Companies
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
          <Link href="/employer/applicants">
            <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-600">
              Applicants
            </Button>
          </Link>
          <Link href="/employer/jobs/new">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Post a Job
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href="/jobs"
              className="flex items-center gap-2 py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
              onClick={() => setIsOpen(false)}
            >
              <Briefcase className="h-5 w-5" />
              Jobs
            </Link>
            <Link
              href="/internships"
              className="flex items-center gap-2 py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
              onClick={() => setIsOpen(false)}
            >
              <Sparkles className="h-5 w-5 text-amber-500" />
              Internships
            </Link>
            <Link
              href="/roadmaps"
              className="flex items-center gap-2 py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
              onClick={() => setIsOpen(false)}
            >
              <Compass className="h-5 w-5 text-blue-500" />
              Roadmaps (100% Free)
            </Link>
            <Link
              href="/companies"
              className="flex items-center gap-2 py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
              onClick={() => setIsOpen(false)}
            >
              <Building2 className="h-5 w-5" />
              Companies
            </Link>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
              <Link href="/employer/jobs/new" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full">
                  For Employers (Post a Job)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

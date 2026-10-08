"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gift,
  Users,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Award,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  Code2,
  CheckCircle2,
  Eye,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReferralsAndRewardsPage() {
  const [myReferralCode, setMyReferralCode] = useState<string>("INVITE");
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [invitedFriendsCount, setInvitedFriendsCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/streak")
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        if (data?.referralCode) {
          setMyReferralCode(data.referralCode);
          setIsLoggedIn(true);
        }
        if (typeof data?.referralCount === "number") {
          setInvitedFriendsCount(data.referralCount);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setMyReferralCode("RN-JOIN");
        setInvitedFriendsCount(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const inviteUrl = `https://rolenest.in/register?ref=${myReferralCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Sign up on RoleNest using my invite link to get 7 Days Free Pro Subscription (unlimited AI roadmaps & verified jobs): ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Join RoleNest with my invite code ${myReferralCode} for 7 Days Free Pro Subscription!`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${text}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 font-sans">
      {/* HERO SECTION: REFER A FRIEND & GET 7 DAYS PRO */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
              <Gift className="h-4 w-4 text-amber-300" />
              REFER A FRIEND • 7 DAYS FREE PRO
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Refer RoleNest to a Friend, Both Get 1 Week Free Pro!
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-medium">
              Share your invite link with college classmates or developer peers. When they sign up and verify their email, <strong className="text-amber-300 font-bold">both of you receive 7 Days of Free Pro Subscription</strong> — credited automatically to your accounts!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-700/60 rounded-xl px-4 py-2.5">
                <Users className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-indigo-200">
                  Friends Joined: <strong className="text-white font-bold text-sm ml-1">{invitedFriendsCount}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl px-4 py-2.5">
                <Award className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-emerald-200">
                  Pro Days Earned: <strong className="text-emerald-300 font-bold text-sm ml-1">{invitedFriendsCount * 7} Days Free</strong>
                </span>
              </div>
            </div>
          </div>

          {/* SHARE ACTION CARD */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 w-full lg:w-96 shrink-0 shadow-lg space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center justify-between">
              <span>Your Personal Invite Link</span>
              <span className="font-mono text-amber-300">CODE: {myReferralCode}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-indigo-500/40 rounded-xl p-2.5">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="bg-transparent text-xs text-white font-mono flex-1 outline-none select-all truncate"
              />
              <button
                onClick={handleCopyInviteLink}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-2.5 py-1 text-xs font-bold transition-colors shrink-0"
              >
                {copiedInvite ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                onClick={handleShareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 w-full h-10 shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Share
              </Button>
              <Button
                onClick={handleShareTelegram}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent font-bold text-xs gap-1.5 w-full h-10"
              >
                <Share2 className="h-4 w-4" />
                Telegram Share
              </Button>
            </div>

            <p className="text-[11px] text-indigo-200/80 text-center leading-tight">
              🎁 When your friend registers with your code &amp; activates their profile, 7 Days Pro is credited to both of your accounts in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS (3 SIMPLE STEPS) */}
      <div className="mt-12 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
            Simple &amp; Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How the Referral Program Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            No credit cards, no fake cash payouts, no complicated conditions. Just real free access for you and your friends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold font-mono text-base border border-indigo-200">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Share Your Link</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send your personal invite link or referral code to your batchmates, friends, or programming communities.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold font-mono text-base border border-emerald-200">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Friend Verifies Email</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your friend signs up using your link and confirms their email address. Their account is immediately upgraded with 7 Days of Free Pro!
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold font-mono text-base border border-amber-200">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">You Get 7 Days Free Pro</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We instantly add 7 Days of Pro Subscription to your account plus 100 XP towards Campus Battles. If you refer 5 friends, you get 35 days!
            </p>
          </div>
        </div>
      </div>

      {/* WHAT ROLENEST PRO UNLOCKS */}
      <div className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-0.5 text-xs font-bold font-mono">
            <Sparkles className="h-3.5 w-3.5" /> PRO SUBSCRIPTION BENEFITS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            What You &amp; Your Friends Unlock with Pro
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            RoleNest Pro gives engineers the unfair advantage needed to land high-paying software jobs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Compass className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Full Curriculum Roadmaps</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access complete project repositories, codebases, and interactive architectures across AI/ML, Full-Stack, and Distributed Systems.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Code2 className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">AI STAR Resume Improver</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlimited AI rewrites that format your bullet points with high-impact action verbs and measurable engineering metrics.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Eye className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Truth Teller Recruiter Alerts</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track exactly when recruiters open your resume, read your code, or shortlist your profile in real-time.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Award className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Campus Leaderboard Boost</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Double XP earnings, streak freezes, and top-tier placement visibility across partner companies.
            </p>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="mt-14 space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 text-center">
          Frequently Asked Questions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              Is there any limit to how many friends I can refer?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No! There is no limit. Every single verified friend who signs up gives you an additional 7 Days of Free Pro. 10 friends = 70 Days of free Pro access.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              When are the 7 days credited?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The 7 days are credited instantly the moment your referred friend clicks their email verification link and confirms their account.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              Do I or my friend need to pay or enter a card?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero payment required. No credit card, UPI, or auto-debit is collected. The 7-day Pro access is 100% free and automatic.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              Where do I find my invite code?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your personal code is displayed in the card above. You can also view it anytime inside your Account Settings or Campus Leaderboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

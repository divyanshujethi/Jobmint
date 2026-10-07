import { Metadata, Viewport } from "next";
import { InteractiveStudyCanvas } from "@/components/interactive-canvas";
import { StudyNavbar } from "@/components/study-navbar";
import { StudyFooter } from "@/components/study-footer";

export const metadata: Metadata = {
  title: "Interactive Course Canvas & Visual Roadmaps | StudyNest Academy",
  description:
    "Zero-cost, node-based interactive visual study roadmap for modern tech roles. Master full-stack, AI/ML engineering, and cloud architecture with interactive nodes and verified project capstones.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function CanvasPage() {
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <StudyNavbar />
      <main className="flex-1 flex flex-col">
        <InteractiveStudyCanvas />
      </main>
      <StudyFooter />
    </div>
  );
}

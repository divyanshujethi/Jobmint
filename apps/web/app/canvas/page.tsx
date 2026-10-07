import { Metadata, Viewport } from "next";
import { InteractiveStudyCanvas } from "@/components/interactive-canvas";
import { StudyNavbar } from "@/components/study-navbar";
import { StudyFooter } from "@/components/study-footer";

export const metadata: Metadata = {
  title: {
    absolute: "Interactive Course Canvas & Visual Roadmaps — StudyNest Academy",
  },
  description:
    "Zero-cost, node-based interactive visual study roadmap for modern tech roles. Master full-stack, AI/ML engineering, and cloud architecture with interactive nodes and verified project capstones.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function CanvasPage() {
  return (
    <div className="h-screen bg-[#060814] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden">
      <StudyNavbar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <InteractiveStudyCanvas />
      </main>
    </div>
  );
}

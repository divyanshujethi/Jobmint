import { Metadata, Viewport } from "next";
import { InteractiveStudyCanvas } from "@/components/interactive-canvas";

export const metadata: Metadata = {
  title: "Interactive Visual Skill Canvas | Role Nest",
  description:
    "Zero-cost, node-based interactive study roadmap for modern tech roles. Master full-stack, AI/ML engineering, and cloud architecture with verified project capstones and real employer job matching.",
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function CanvasPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 flex flex-col">
      <InteractiveStudyCanvas />
    </main>
  );
}

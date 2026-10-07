import { Metadata, Viewport } from "next";
import { StudyWhiteboard } from "@/components/study-whiteboard";
import { StudyNavbar } from "@/components/study-navbar";

export const metadata: Metadata = {
  title: {
    absolute: "Study Whiteboard & Visual Notes Studio — StudyNest Academy",
  },
  description:
    "Google Notes style technical notepad and infinite vector whiteboarding for students and engineers. Sketch architecture diagrams, organize study thoughts, and download as PDF or Image.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function WhiteboardPage() {
  return (
    <div className="h-screen bg-[#060814] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden">
      <StudyNavbar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <StudyWhiteboard />
      </main>
    </div>
  );
}

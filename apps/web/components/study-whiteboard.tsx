"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  PenTool,
  MousePointer,
  StickyNote,
  Square,
  Circle as CircleIcon,
  MoveRight,
  Eraser,
  Undo2,
  Trash2,
  Download,
  FileText,
  Image as ImageIcon,
  Printer,
  Plus,
  Search,
  Pin,
  Tag,
  CheckSquare,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Grid,
  Layers,
  Sparkles,
  ArrowLeft,
  X,
  Copy,
  Check,
  Share2,
  Palette,
  FileCode,
  FolderOpen,
} from "lucide-react";
import { Button } from "./ui/button";

// ── Types ──
export interface WhiteboardStroke {
  id: string;
  type: "pen" | "highlighter" | "arrow" | "rect" | "circle";
  color: string;
  strokeWidth: number;
  points: { x: number; y: number }[];
}

export interface GoogleNote {
  id: string;
  title: string;
  content: string;
  color: "amber" | "cyan" | "emerald" | "rose" | "purple" | "obsidian";
  pinned: boolean;
  category: string;
  checklist?: { id: string; text: string; done: boolean }[];
  updatedAt: string;
}

const NOTE_COLORS = [
  { id: "obsidian", label: "Obsidian Void", bg: "bg-[#0f142e] border-indigo-900/60 text-slate-100", dot: "bg-[#161f4a]" },
  { id: "amber", label: "Warm Amber", bg: "bg-[#2a1d08] border-amber-500/40 text-amber-100", dot: "bg-amber-400" },
  { id: "cyan", label: "Electric Cyan", bg: "bg-[#06202c] border-cyan-500/40 text-cyan-100", dot: "bg-cyan-400" },
  { id: "emerald", label: "Neon Emerald", bg: "bg-[#06241a] border-emerald-500/40 text-emerald-100", dot: "bg-emerald-400" },
  { id: "rose", label: "Sunset Rose", bg: "bg-[#2d0f1c] border-pink-500/40 text-pink-100", dot: "bg-pink-400" },
  { id: "purple", label: "Royal Violet", bg: "bg-[#200f33] border-purple-500/40 text-purple-100", dot: "bg-purple-400" },
] as const;

const CATEGORIES = [
  "All Notes",
  "System Design",
  "DSA & Algorithms",
  "Frontend Architecture",
  "Backend & DB",
  "Interview Prep",
  "Quick Ideas",
];

const STROKE_COLORS = [
  { id: "#6366f1", label: "Indigo", bg: "bg-indigo-500" },
  { id: "#06b6d4", label: "Cyan", bg: "bg-cyan-400" },
  { id: "#10b981", label: "Emerald", bg: "bg-emerald-400" },
  { id: "#f59e0b", label: "Amber", bg: "bg-amber-400" },
  { id: "#ec4899", label: "Rose", bg: "bg-pink-500" },
  { id: "#ffffff", label: "White", bg: "bg-white" },
];

const DEFAULT_NOTES: GoogleNote[] = [];

export function StudyWhiteboard() {
  const [activeTab, setActiveTab] = useState<"notes" | "whiteboard" | "split">("notes");
  const [notes, setNotes] = useState<GoogleNote[]>(DEFAULT_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Notes");

  // New Note Creation State
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newColor, setNewColor] = useState<GoogleNote["color"]>("obsidian");
  const [newCategory, setNewCategory] = useState("System Design");
  const [editingNote, setEditingNote] = useState<GoogleNote | null>(null);

  // Whiteboard Drawing State
  const [tool, setTool] = useState<"select" | "pen" | "highlighter" | "arrow" | "rect" | "circle" | "eraser">("pen");
  const [strokeColor, setStrokeColor] = useState("#6366f1");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [gridType, setGridType] = useState<"dots" | "grid" | "blank">("dots");
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<WhiteboardStroke | null>(null);

  // Canvas Pan & Zoom
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const whiteboardContainerRef = useRef<HTMLDivElement>(null);
  const notesContainerRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("studynest_google_notes");
      if (savedNotes) {
        const parsed: GoogleNote[] = JSON.parse(savedNotes);
        // Filter out legacy placeholder dummy notes if user had them previously cached
        const filtered = parsed.filter((n) => !["n1", "n2", "n3"].includes(n.id));
        setNotes(filtered);
      }
      const savedStrokes = localStorage.getItem("studynest_whiteboard_drawing");
      if (savedStrokes) {
        setStrokes(JSON.parse(savedStrokes));
      }
    } catch {}
  }, []);

  const saveNotesToStorage = (updatedNotes: GoogleNote[]) => {
    setNotes(updatedNotes);
    try {
      localStorage.setItem("studynest_google_notes", JSON.stringify(updatedNotes));
    } catch {}
  };

  const saveStrokesToStorage = (updatedStrokes: WhiteboardStroke[]) => {
    setStrokes(updatedStrokes);
    try {
      localStorage.setItem("studynest_whiteboard_drawing", JSON.stringify(updatedStrokes));
    } catch {}
  };

  // Create Note
  const handleCreateNote = () => {
    if (!newTitle.trim() && !newContent.trim()) {
      setIsCreatingNote(false);
      return;
    }
    const newNoteItem: GoogleNote = {
      id: `note-${Date.now()}`,
      title: newTitle.trim() || "Untitled Note",
      content: newContent.trim(),
      color: newColor,
      pinned: false,
      category: newCategory,
      updatedAt: "Just now",
    };
    saveNotesToStorage([newNoteItem, ...notes]);
    setNewTitle("");
    setNewContent("");
    setNewColor("obsidian");
    setIsCreatingNote(false);
  };

  // Toggle Note Pin
  const togglePin = (noteId: string) => {
    const updated = notes.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n));
    saveNotesToStorage(updated);
  };

  // Delete Note
  const deleteNote = (noteId: string) => {
    saveNotesToStorage(notes.filter((n) => n.id !== noteId));
  };

  // Toggle Checklist Item
  const toggleChecklistItem = (noteId: string, itemId: string) => {
    const updated = notes.map((n) => {
      if (n.id === noteId && n.checklist) {
        return {
          ...n,
          checklist: n.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
        };
      }
      return n;
    });
    saveNotesToStorage(updated);
  };

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Notes" || n.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchQuery, selectedCategory]);

  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.pinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.pinned), [filteredNotes]);

  // ── Screen to World Coordinates ──
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = whiteboardContainerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (clientX - rect.left - pan.x) / scale,
        y: (clientY - rect.top - pan.y) / scale,
      };
    },
    [pan, scale]
  );

  // ── Whiteboard Mouse Handlers ──
  const handleWhiteboardMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) return;

    if (tool === "select") {
      setIsPanning(true);
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    } else if (tool === "eraser") {
      // Erase stroke under cursor if clicked
      const world = screenToWorld(e.clientX, e.clientY);
      setStrokes((prev) =>
        prev.filter((s) => !s.points.some((pt) => Math.hypot(pt.x - world.x, pt.y - world.y) < 25))
      );
    } else {
      const world = screenToWorld(e.clientX, e.clientY);
      const newStroke: WhiteboardStroke = {
        id: `stroke-${Date.now()}`,
        type: tool,
        color: strokeColor,
        strokeWidth: tool === "highlighter" ? 16 : strokeWidth,
        points: [world],
      };
      setCurrentStroke(newStroke);
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isPanning && tool === "select") {
        setPan({
          x: e.clientX - startPanRef.current.x,
          y: e.clientY - startPanRef.current.y,
        });
      } else if (currentStroke) {
        const world = screenToWorld(e.clientX, e.clientY);
        setCurrentStroke((prev) => {
          if (!prev) return null;
          if (prev.type === "pen" || prev.type === "highlighter") {
            return { ...prev, points: [...prev.points, world] };
          } else {
            return { ...prev, points: [prev.points[0], world] };
          }
        });
      }
    };

    const onMouseUp = () => {
      if (isPanning) setIsPanning(false);
      if (currentStroke) {
        saveStrokesToStorage([...strokes, currentStroke]);
        setCurrentStroke(null);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isPanning, currentStroke, strokes, tool, screenToWorld]);

  // Undo and Clear
  const undoStroke = () => {
    if (strokes.length > 0) {
      saveStrokesToStorage(strokes.slice(0, -1));
    }
  };

  const clearWhiteboard = () => {
    if (confirm("Clear all drawings on the whiteboard?")) {
      saveStrokesToStorage([]);
    }
  };

  // ── EXPORT FUNCTIONS (PDF, PNG, SVG) ──

  // 1. Download as Image (PNG)
  const downloadAsImage = () => {
    const svgEl = whiteboardContainerRef.current?.querySelector("svg");
    const width = 1920;
    const height = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#060814";
    ctx.fillRect(0, 0, width, height);

    // Grid dots
    ctx.fillStyle = "#1e293b";
    for (let x = 0; x < width; x += 28) {
      for (let y = 0; y < height; y += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);

        // Header Watermark
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("StudyNest Academy • Architectural Whiteboard Notes", 40, 50);
        ctx.fillStyle = "#818cf8";
        ctx.font = "14px monospace";
        ctx.fillText(`Exported on ${new Date().toLocaleDateString()} • study.rolenest.in/whiteboard`, 40, 80);

        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `studynest-whiteboard-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  // 2. Download as SVG Vector
  const downloadAsSvg = () => {
    const svgEl = whiteboardContainerRef.current?.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studynest-whiteboard-vector-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 3. Download / Print as PDF
  const downloadAsPdf = () => {
    // Open a formatted printable document window with clean PDF layout
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to generate and download your PDF notes.");
      return;
    }

    const notesHtml = filteredNotes
      .map(
        (n) => `
        <div style="page-break-inside: avoid; margin-bottom: 24px; padding: 18px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #4f46e5; background: #eef2ff; padding: 2px 8px; border-radius: 6px;">${n.category}</span>
            <span style="font-size: 11px; color: #64748b;">${n.updatedAt}</span>
          </div>
          <h2 style="font-size: 16px; font-weight: bold; color: #0f172a; margin: 0 0 8px 0;">${n.title}</h2>
          <div style="font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${n.content}</div>
          ${
            n.checklist && n.checklist.length > 0
              ? `<div style="margin-top: 12px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
                  ${n.checklist
                    .map(
                      (c) => `
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #475569; margin-top: 4px;">
                      <span style="font-weight: bold; color: ${c.done ? "#059669" : "#94a3b8"}">${c.done ? "[x]" : "[ ]"}</span>
                      <span style="text-decoration: ${c.done ? "line-through" : "none"}">${c.text}</span>
                    </div>`
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>
      `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>StudyNest Academy - Visual Engineering Notes</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
            .meta { font-size: 12px; color: #64748b; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
            @media print {
              body { padding: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <h1>StudyNest Academy • Engineering Study Notes</h1>
          <div class="meta">Exported on ${new Date().toLocaleDateString()} • Verified Candidate Notes • study.rolenest.in</div>
          ${notesHtml}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Helper for rendering strokes
  const renderStroke = (stroke: WhiteboardStroke) => {
    if (stroke.points.length === 0) return null;

    if (stroke.type === "pen" || stroke.type === "highlighter") {
      if (stroke.points.length === 1) {
        return (
          <circle
            key={stroke.id}
            cx={stroke.points[0].x}
            cy={stroke.points[0].y}
            r={stroke.strokeWidth / 2}
            fill={stroke.color}
            opacity={stroke.type === "highlighter" ? 0.35 : 1}
          />
        );
      }
      const d = stroke.points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), "");
      return (
        <path
          key={stroke.id}
          d={d}
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={stroke.type === "highlighter" ? 0.35 : 0.95}
        />
      );
    } else if (stroke.type === "arrow" && stroke.points.length >= 2) {
      const p1 = stroke.points[0];
      const p2 = stroke.points[stroke.points.length - 1];
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const headLen = 14;
      const aLeftX = p2.x - headLen * Math.cos(angle - Math.PI / 6);
      const aLeftY = p2.y - headLen * Math.sin(angle - Math.PI / 6);
      const aRightX = p2.x - headLen * Math.cos(angle + Math.PI / 6);
      const aRightY = p2.y - headLen * Math.sin(angle + Math.PI / 6);
      return (
        <g key={stroke.id}>
          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={stroke.color} strokeWidth={stroke.strokeWidth} strokeLinecap="round" />
          <polygon points={`${p2.x},${p2.y} ${aLeftX},${aLeftY} ${aRightX},${aRightY}`} fill={stroke.color} />
        </g>
      );
    } else if (stroke.type === "rect" && stroke.points.length >= 2) {
      const p1 = stroke.points[0];
      const p2 = stroke.points[stroke.points.length - 1];
      const rx = Math.min(p1.x, p2.x);
      const ry = Math.min(p1.y, p2.y);
      const rw = Math.abs(p2.x - p1.x);
      const rh = Math.abs(p2.y - p1.y);
      return (
        <rect
          key={stroke.id}
          x={rx}
          y={ry}
          width={rw}
          height={rh}
          rx={6}
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.strokeWidth}
          strokeDasharray="6 4"
        />
      );
    } else if (stroke.type === "circle" && stroke.points.length >= 2) {
      const p1 = stroke.points[0];
      const p2 = stroke.points[stroke.points.length - 1];
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;
      const rx = Math.abs(p2.x - p1.x) / 2;
      const ry = Math.abs(p2.y - p1.y) / 2;
      return (
        <ellipse
          key={stroke.id}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.strokeWidth}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#060814] text-slate-100 overflow-hidden font-sans select-none">
      {/* TOP HEADER CONTROLS */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-indigo-950/80 bg-[#0c1024]/90 px-6 py-3 backdrop-blur-xl z-30 gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/canvas"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950/70 border border-indigo-900/60 text-slate-400 hover:text-white hover:bg-indigo-900/60 transition-colors"
            title="Return to Course Canvas"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              Study Whiteboard &amp; Notes Studio
              <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300 font-mono">
                Google Notes Style
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Personalized technical notepad + infinite spatial vector board. Download as PDF, PNG, or SVG anytime.
            </p>
          </div>
        </div>

        {/* WORKSPACE MODE SWITCHER & DOWNLOAD ACTIONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tabs: Google Notes | Infinite Whiteboard | Split View */}
          <div className="flex items-center rounded-xl bg-[#101533] p-1 border border-indigo-900/50 shadow-inner">
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "notes"
                  ? "bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <StickyNote className="h-3.5 w-3.5" />
              <span>Google Notes ({notes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("whiteboard")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "whiteboard"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>Vector Whiteboard</span>
            </button>
            <button
              onClick={() => setActiveTab("split")}
              className={`hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "split"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Split Studio</span>
            </button>
          </div>

          {/* DOWNLOAD MENU (PDF, Image PNG, SVG) */}
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={downloadAsPdf}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-lg shadow-rose-600/20 border border-rose-500/30"
              title="Print or Save all notes as PDF"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </Button>

            <Button
              size="sm"
              onClick={downloadAsImage}
              variant="outline"
              className="border-indigo-900/80 bg-[#101533] text-slate-200 hover:bg-[#161d47] font-bold text-xs gap-1.5 rounded-xl"
              title="Download canvas as 2x PNG Image"
            >
              <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
              <span>Download Image</span>
            </Button>

            <Button
              size="sm"
              onClick={downloadAsSvg}
              variant="outline"
              className="hidden sm:inline-flex border-indigo-900/80 bg-[#101533] text-slate-200 hover:bg-[#161d47] font-bold text-xs gap-1.5 rounded-xl"
              title="Download vector SVG"
            >
              <FileCode className="h-3.5 w-3.5 text-amber-400" />
              <span>SVG</span>
            </Button>
          </div>
        </div>
      </header>

      {/* WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* TAB 1: GOOGLE NOTES VIEW */}
        {(activeTab === "notes" || activeTab === "split") && (
          <div
            ref={notesContainerRef}
            className={`flex flex-col bg-[#060814] overflow-y-auto ${
              activeTab === "split" ? "w-1/2 border-r border-indigo-950/80" : "w-full"
            } p-6`}
          >
            {/* GOOGLE KEEP STYLE NOTE CREATOR */}
            <div className="max-w-2xl mx-auto w-full mb-8">
              {!isCreatingNote ? (
                <div
                  onClick={() => setIsCreatingNote(true)}
                  className="flex items-center justify-between rounded-2xl bg-[#0f1430] border border-indigo-900/60 p-4 shadow-xl cursor-text hover:border-indigo-700/80 transition-all text-slate-400 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Plus className="h-5 w-5 text-indigo-400" />
                    <span>Take a new technical note or architecture thought...</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <StickyNote className="h-4 w-4" />
                    <CheckSquare className="h-4 w-4" />
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-[#0e1438] border border-indigo-700/70 p-5 shadow-2xl space-y-3 animate-in fade-in duration-150">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Title (e.g. Raft Consensus Trade-offs)"
                    className="w-full bg-transparent text-base font-extrabold text-white placeholder-slate-500 focus:outline-none"
                    autoFocus
                  />
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Take notes, record algorithms, paste interview questions or code snippets..."
                    rows={4}
                    className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-mono"
                  />

                  {/* Note Creator Controls */}
                  <div className="flex flex-wrap items-center justify-between border-t border-indigo-950/80 pt-3 gap-2">
                    <div className="flex items-center gap-2">
                      {/* Color Selector */}
                      <div className="flex items-center gap-1.5">
                        {NOTE_COLORS.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setNewColor(c.id)}
                            className={`h-5 w-5 rounded-full transition-transform ${c.dot} ${
                              newColor === c.id ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                            }`}
                            title={c.label}
                          />
                        ))}
                      </div>

                      {/* Category Selector */}
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="bg-[#101533] border border-indigo-900/60 text-slate-300 text-[11px] font-bold rounded-xl px-2.5 py-1 focus:outline-none"
                      >
                        {CATEGORIES.filter((c) => c !== "All Notes").map((cat) => (
                          <option key={cat} value={cat} className="bg-[#090d22] text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsCreatingNote(false)}
                        className="text-slate-400 hover:text-white text-xs font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCreateNote}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md"
                      >
                        Save Note
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* SEARCH & CATEGORY FILTER */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search across technical notes..."
                    className="w-full bg-[#0c102a] border border-indigo-950/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all shrink-0 ${
                        selectedCategory === cat
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-[#101533] text-slate-400 hover:text-white border border-indigo-900/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* NOTES GRID (GOOGLE KEEP STYLE) */}
            <div className="max-w-6xl mx-auto w-full space-y-6">
              {/* PINNED NOTES SECTION */}
              {pinnedNotes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    <Pin className="h-3.5 w-3.5 text-amber-400" />
                    <span>Pinned Technical Notes</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pinnedNotes.map((note) => renderNoteCard(note))}
                  </div>
                </div>
              )}

              {/* OTHER NOTES SECTION */}
              <div className="space-y-3">
                {pinnedNotes.length > 0 && (
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    All Notes ({otherNotes.length})
                  </div>
                )}
                {otherNotes.length === 0 && pinnedNotes.length === 0 ? (
                  <div className="text-center py-16 rounded-3xl border border-dashed border-indigo-950/80 bg-[#080c20]/40 p-8">
                    <StickyNote className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white">No notes found</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery ? "Try a different search keyword" : "Create your first Google Notes card above"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {otherNotes.map((note) => renderNoteCard(note))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPATIAL VECTOR WHITEBOARD VIEW */}
        {(activeTab === "whiteboard" || activeTab === "split") && (
          <div
            ref={whiteboardContainerRef}
            onMouseDown={handleWhiteboardMouseDown}
            className={`relative flex-1 overflow-hidden bg-[#060814] ${
              gridType === "dots"
                ? "bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px]"
                : gridType === "grid"
                ? "bg-[linear-gradient(to_right,#0f1535_1px,transparent_1px),linear-gradient(to_bottom,#0f1535_1px,transparent_1px)] [background-size:32px_32px]"
                : ""
            } ${tool === "select" ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-crosshair"}`}
          >
            {/* Vector Transform Layer */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: "0 0",
              }}
              className="absolute inset-0 w-[4000px] h-[3000px] pointer-events-auto"
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {strokes.map(renderStroke)}
                {currentStroke && renderStroke(currentStroke)}
              </svg>
            </div>

            {/* FLOATING WHITEBOARD TOOLBAR */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-[#0c1024]/95 border border-indigo-900/80 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-xl z-30">
              {/* Tool Selection */}
              <div className="flex items-center gap-1 border-r border-indigo-900/60 pr-2">
                <button
                  onClick={() => setTool("select")}
                  title="Pan & Move"
                  className={`p-2 rounded-xl transition-all ${
                    tool === "select"
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <MousePointer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTool("pen")}
                  title="Vector Freehand Pen"
                  className={`p-2 rounded-xl transition-all ${
                    tool === "pen"
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <PenTool className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTool("highlighter")}
                  title="Neon Highlighter"
                  className={`p-2 rounded-xl transition-all ${
                    tool === "highlighter"
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTool("arrow")}
                  title="Flowchart Arrow"
                  className={`p-2 rounded-xl transition-all ${
                    tool === "arrow"
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <MoveRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTool("rect")}
                  title="System Rectangle"
                  className={`p-2 rounded-xl transition-all ${
                    tool === "rect"
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Square className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTool("circle")}
                  title="Node Circle"
                  className={`p-2 rounded-xl transition-all ${
                    tool === "circle"
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CircleIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-1.5 border-r border-indigo-900/60 pr-2">
                {STROKE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setStrokeColor(c.id)}
                    className={`h-5 w-5 rounded-full transition-transform ${c.bg} ${
                      strokeColor === c.id ? "ring-2 ring-white scale-110" : "opacity-75 hover:opacity-100"
                    }`}
                    title={c.label}
                  />
                ))}
              </div>

              {/* Stroke Width */}
              <div className="flex items-center gap-1 border-r border-indigo-900/60 pr-2">
                {[2, 4, 8].map((w) => (
                  <button
                    key={w}
                    onClick={() => setStrokeWidth(w)}
                    className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      strokeWidth === w ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {w === 2 ? "S" : w === 4 ? "M" : "L"}
                  </button>
                ))}
              </div>

              {/* Grid and Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setGridType((prev) => (prev === "dots" ? "grid" : prev === "grid" ? "blank" : "dots"))}
                  title="Toggle Canvas Grid"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={undoStroke}
                  disabled={strokes.length === 0}
                  title="Undo Last Stroke"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  onClick={clearWhiteboard}
                  title="Clear Whiteboard"
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Floating Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-2xl border border-indigo-900/80 bg-[#0c1024]/95 p-1.5 shadow-2xl backdrop-blur-xl z-20">
              <button
                onClick={() => setScale((s) => Math.min(2, s + 0.15))}
                title="Zoom In"
                className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-indigo-950/60"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setScale((s) => Math.max(0.4, s - 0.15))}
                title="Zoom Out"
                className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-indigo-950/60"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setScale(1);
                  setPan({ x: 40, y: 30 });
                }}
                title="Reset View"
                className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-indigo-950/60"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EDIT NOTE MODAL */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0d1338] rounded-3xl border border-indigo-700/80 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <input
                type="text"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                className="bg-transparent text-lg font-black text-white focus:outline-none w-full"
              />
              <button
                onClick={() => setEditingNote(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <textarea
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              rows={8}
              className="w-full bg-[#050819] border border-indigo-950 p-3 rounded-2xl text-xs text-slate-200 focus:outline-none resize-none font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-mono">Last edited: {editingNote.updatedAt}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingNote(null)}
                  className="border-indigo-900 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    saveNotesToStorage(notes.map((n) => (n.id === editingNote.id ? editingNote : n)));
                    setEditingNote(null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper to render individual Google Notes card
  function renderNoteCard(note: GoogleNote) {
    const colorStyle = NOTE_COLORS.find((c) => c.id === note.color)?.bg || NOTE_COLORS[0].bg;

    return (
      <div
        key={note.id}
        onClick={() => setEditingNote(note)}
        className={`group relative rounded-2xl border p-4.5 shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl cursor-pointer ${colorStyle}`}
      >
        {/* Card Header: Category & Pin */}
        <div className="flex items-start justify-between mb-2">
          <span className="rounded-md bg-black/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-mono opacity-80">
            {note.category}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note.id);
              }}
              className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${
                note.pinned ? "text-amber-400" : "text-slate-400 hover:text-white"
              }`}
              title={note.pinned ? "Unpin Note" : "Pin Note to Top"}
            >
              <Pin className="h-3.5 w-3.5 fill-current" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
              title="Delete Note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-extrabold text-white leading-tight mb-2">
          {note.title}
        </h3>

        {/* Content Body */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-5 whitespace-pre-wrap font-sans">
          {note.content}
        </p>

        {/* Optional Checklist */}
        {note.checklist && note.checklist.length > 0 && (
          <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
            {note.checklist.map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChecklistItem(note.id, item.id);
                }}
                className="flex items-center gap-2 text-[11px] text-slate-300 hover:text-white cursor-pointer"
              >
                <div
                  className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${
                    item.done ? "bg-emerald-500 border-emerald-400 text-black" : "border-slate-500"
                  }`}
                >
                  {item.done && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
                <span className={item.done ? "line-through text-slate-500" : ""}>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer: Date */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>{note.updatedAt}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300">Click to edit →</span>
        </div>
      </div>
    );
  }
}

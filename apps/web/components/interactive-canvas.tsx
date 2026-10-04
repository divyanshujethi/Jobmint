"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  CanvasTrack,
  CanvasNode,
  CANVAS_TRACKS,
} from "@/lib/canvas-data";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Circle,
  Clock,
  Briefcase,
  ExternalLink,
  Code2,
  Sparkles,
  BookOpen,
  X,
  ArrowRight,
  ShieldCheck,
  Compass,
  Copy,
  Check,
  GraduationCap,
  Play,
  Lightbulb,
  Info,
  HelpCircle,
  Network,
  GitFork,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Cloud,
  FileCode,
  Terminal,
  Youtube,
  Layers,
} from "lucide-react";
import { Button } from "./ui/button";
import { KnowledgeGraphView } from "./knowledge-graph-view";

const ROLE_SWITCHERS = [
  { id: "fullstack-web", label: "Frontend Engineer", icon: "💻", badge: "React 19 & Web" },
  { id: "backend-go-node", label: "Backend Go/Node", icon: "⚡", badge: "Distributed Systems" },
  { id: "ai-engineer-2026", label: "Python AI/ML Agent Engineer", icon: "🤖", badge: "PyTorch & RAG" },
  { id: "cloud-devops", label: "DevOps/SRE", icon: "☁️", badge: "K8s & Cloud" },
  { id: "govtech-aspirant", label: "GovTech Aspirant", icon: "🏛️", badge: "India Stack & DPI" },
];

export function InteractiveStudyCanvas() {
  const [viewMode, setViewMode] = useState<"roadmap" | "graph">("roadmap");
  const [activeTrackId, setActiveTrackId] = useState<string>("fullstack-web");
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [nodeNote, setNodeNote] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHelpBanner, setShowHelpBanner] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [cloudSynced, setCloudSynced] = useState(false);

  // Canvas Pan & Zoom State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTrack = useMemo(() => {
    return CANVAS_TRACKS.find((t) => t.id === activeTrackId) || CANVAS_TRACKS[0];
  }, [activeTrackId]);

  // Load completed nodes from localStorage AND PostgreSQL cloud sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jobmint_completed_nodes");
      if (saved) {
        setCompletedNodes(new Set(JSON.parse(saved)));
      }
    } catch {}

    // Cloud sync check with PostgreSQL
    fetch("/api/user/canvas-progress")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && Array.isArray(data.completedNodes)) {
          setCompletedNodes((prev) => {
            const merged = new Set([...Array.from(prev), ...data.completedNodes]);
            try {
              localStorage.setItem("jobmint_completed_nodes", JSON.stringify(Array.from(merged)));
            } catch {}
            return merged;
          });
          setCloudSynced(true);
        }
      })
      .catch(() => {});
  }, []);

  // Sync node note
  useEffect(() => {
    if (selectedNode) {
      const savedNote = localStorage.getItem(`jobmint_canvas_note_${selectedNode.id}`) || "";
      setNodeNote(savedNote);
      setCopiedCode(false);
      setShowAnswer(false);
    }
  }, [selectedNode]);

  const handleNoteChange = (text: string) => {
    setNodeNote(text);
    if (selectedNode) {
      try {
        localStorage.setItem(`jobmint_canvas_note_${selectedNode.id}`, text);
      } catch {}
      // Sync note to cloud
      fetch("/api/user/canvas-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: { id: selectedNode.id, text } }),
      }).catch(() => {});
    }
  };

  const toggleNodeCompletion = (nodeId: string) => {
    const isNowCompleted = !completedNodes.has(nodeId);
    setCompletedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      try {
        localStorage.setItem("jobmint_completed_nodes", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });

    // Cloud sync with PostgreSQL
    fetch("/api/user/canvas-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodeId, isCompleted: isNowCompleted }),
    })
      .then((res) => {
        if (res.ok) setCloudSynced(true);
      })
      .catch(() => {});
  };

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyBadgeMarkdown = () => {
    const mdBadge = `[![Role Nest Verified Skill Tree](https://img.shields.io/badge/Role%20Nest-Skills%20Verified-059669?style=for-the-badge&logo=codeforces&logoColor=white)](https://rolenest.in/canvas)`;
    navigator.clipboard.writeText(mdBadge);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2500);
  };

  const downloadSkillTreeSvg = () => {
    const svgEl = containerRef.current?.querySelector("svg");
    if (!svgEl) return;

    // Create a standalone SVG document
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rolenest-${activeTrack.id}-skill-tree.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadSkillTreePng = () => {
    const svgEl = containerRef.current?.querySelector("svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    canvas.width = 1800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw background
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Watermark branding
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`Role Nest Verified Skill Tree • ${activeTrack.title}`, 40, 40);
      ctx.fillStyle = "#059669";
      ctx.font = "14px monospace";
      ctx.fillText(`Mastered: ${progressCount}/${activeTrack.nodes.length} Nodes • rolenest.in/canvas`, 40, 70);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `rolenest-${activeTrack.id}-skill-tree.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // ── Robust Window-Level Pan Handlers (Prevents Stuck Dragging) ──
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(".canvas-node") ||
      (e.target as HTMLElement).closest(".drawer-content") ||
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }
    setIsPanning(true);
    startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  useEffect(() => {
    if (!isPanning) return;

    const onMouseMove = (e: MouseEvent) => {
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
    };

    const onMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isPanning]);

  // ── Trackpad / Mouse Wheel Zoom & Pan with explicit passive: false ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement)?.closest(".drawer-content")) {
        return; // allow drawer to scroll naturally
      }
      e.preventDefault();

      if (e.ctrlKey || Math.abs(e.deltaY) > 80) {
        // Zoom
        const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
        setScale((prev) => Math.min(1.8, Math.max(0.4, prev + zoomFactor)));
      } else {
        // 2-finger pan on trackpad
        setPan((prev) => ({
          x: prev.x - e.deltaX * 0.8,
          y: prev.y - e.deltaY * 0.8,
        }));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  // ── Mobile Touch Pan & Pinch Zoom ──
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".drawer-content")) return;

    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX - pan.x, y: t.clientY - pan.y };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current = {
        x: pan.x,
        y: pan.y,
        dist: Math.sqrt(dx * dx + dy * dy),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".drawer-content")) return;

    if (e.touches.length === 1 && touchStartRef.current.dist === undefined) {
      const t = e.touches[0];
      setPan({
        x: t.clientX - touchStartRef.current.x,
        y: t.clientY - touchStartRef.current.y,
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const ratio = newDist / touchStartRef.current.dist;
      setScale((prev) => Math.min(1.8, Math.max(0.4, prev * ratio)));
      touchStartRef.current.dist = newDist;
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = { x: 0, y: 0 };
  };

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.min(1.8, Math.max(0.4, Number((prev + delta).toFixed(2)))));
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 60, y: 30 });
  };

  // Node coordinate map
  const nodeMap = useMemo(() => {
    const map = new Map<string, CanvasNode>();
    activeTrack.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [activeTrack]);

  // Generate connection paths
  const connections = useMemo(() => {
    const lines: Array<{
      id: string;
      from: CanvasNode;
      to: CanvasNode;
      isCompleted: boolean;
      d: string;
    }> = [];

    activeTrack.nodes.forEach((node) => {
      node.dependencies.forEach((depId) => {
        const parent = nodeMap.get(depId);
        if (parent) {
          const startX = parent.x + 230;
          const startY = parent.y + 60;
          const endX = node.x;
          const endY = node.y + 60;
          const dx = endX - startX;
          const controlOffset = Math.max(dx * 0.45, 50);
          const d = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
          const isCompleted = completedNodes.has(parent.id) && completedNodes.has(node.id);
          lines.push({
            id: `${parent.id}->${node.id}`,
            from: parent,
            to: node,
            isCompleted,
            d,
          });
        }
      });
    });

    return lines;
  }, [activeTrack, nodeMap, completedNodes]);

  const progressCount = activeTrack.nodes.filter((n) => completedNodes.has(n.id)).length;
  const progressPercentage = Math.round((progressCount / activeTrack.nodes.length) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 overflow-hidden select-none">
      <style>{`
        @keyframes flowPulse {
          0% { stroke-dashoffset: 36; }
          100% { stroke-dashoffset: 0; }
        }
        .canvas-line-flow {
          stroke-dasharray: 8 6;
          animation: flowPulse 1.4s linear infinite;
        }
      `}</style>

      {/* Top Header & Mode / Track Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur-md z-20 gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Interactive Study &amp; Developer Skill Canvas
              <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-700 font-mono">
                RoleNest Labs (Beta)
              </span>
            </h1>
            <p className="text-xs text-slate-600">
              Interactive visual learning: Explore linear career tracks or deep-dive into the interconnected knowledge network graph.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode("roadmap")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === "roadmap"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GitFork className="h-3.5 w-3.5 text-emerald-600" />
              <span>Roadmap Tree</span>
            </button>
            <button
              onClick={() => setViewMode("graph")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === "graph"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Network className="h-3.5 w-3.5 text-emerald-600" />
              <span>Knowledge Graph (Network)</span>
            </button>
          </div>

          {/* Export Skill Tree Artifact Button */}
          <Button
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export Skill Tree Artifact</span>
          </Button>

          {cloudSynced && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-700">
              <Cloud className="h-3.5 w-3.5 text-emerald-600" />
              Synced to PostgreSQL
            </span>
          )}

          <button
            onClick={() => setShowHelpBanner(!showHelpBanner)}
            title="What is this Canvas for?"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ROLE-BASED QUICK SWITCHERS (Prominent 5 Core Disciplines) */}
      {viewMode === "roadmap" && (
        <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto z-15">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Role Tracks:
            </span>
            <div className="flex items-center gap-1.5">
              {ROLE_SWITCHERS.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveTrackId(role.id);
                    setSelectedNode(null);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                    activeTrackId === role.id
                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20"
                      : "bg-white text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80 shadow-2xs"
                  }`}
                >
                  <span>{role.icon}</span>
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* More Tracks Selector */}
          <div className="flex items-center gap-1 shrink-0">
            <select
              value={ROLE_SWITCHERS.some((r) => r.id === activeTrackId) ? "" : activeTrackId}
              onChange={(e) => {
                if (e.target.value) {
                  setActiveTrackId(e.target.value);
                  setSelectedNode(null);
                }
              }}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 shadow-2xs"
            >
              <option value="" disabled>More Specialized Tracks...</option>
              {CANVAS_TRACKS.filter((t) => !ROLE_SWITCHERS.some((r) => r.id === t.id)).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Explanatory Guide Banner (What is this for?) */}
      {showHelpBanner && (
        <div className="bg-emerald-50/90 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-900 flex items-center justify-between gap-4 z-15 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="leading-relaxed">
              <strong>Personalized Skill Tree:</strong> Progress is permanently saved to your verified candidate account in PostgreSQL. Click any node to inspect 3-minute code blueprints, interview questions, and linked video clips.
            </div>
          </div>
          <button
            onClick={() => setShowHelpBanner(false)}
            className="text-emerald-700 hover:text-emerald-950 p-1 rounded hover:bg-emerald-100 transition-colors shrink-0"
            title="Dismiss notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* View Mode: Knowledge Graph Network */}
      {viewMode === "graph" ? (
        <KnowledgeGraphView />
      ) : (
        <>
          {/* Subheader: Track Details & Progress Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-2 text-xs text-slate-600 z-10">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {activeTrack.badge}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 hidden md:inline">{activeTrack.description}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-[11px] text-slate-600">
                Skills Mastered: <strong className="text-emerald-700 font-bold">{progressCount}/{activeTrack.nodes.length}</strong> ({progressPercentage}%)
              </span>
              <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden bg-slate-50 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px]"
          >
            {/* Transform Container */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: "0 0",
                transition: isPanning ? "none" : "transform 0.05s ease-out",
              }}
              className="absolute inset-0 w-[2700px] h-[950px] pointer-events-auto"
            >
              {/* SVG Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>

                {connections.map((conn) => (
                  <g key={conn.id}>
                    {conn.isCompleted ? (
                      <path
                        d={conn.d}
                        fill="none"
                        stroke="url(#activeGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="canvas-line-flow"
                      />
                    ) : (
                      <path
                        d={conn.d}
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        strokeLinecap="round"
                      />
                    )}
                  </g>
                ))}
              </svg>

              {/* Canvas Nodes */}
              {activeTrack.nodes.map((node) => {
            const isCompleted = completedNodes.has(node.id);
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: "230px",
                }}
                className={`canvas-node absolute rounded-2xl border-2 p-4 shadow-sm transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-600 bg-white ring-4 ring-emerald-500/20 scale-105 z-30 shadow-lg"
                    : isCompleted
                    ? "border-emerald-500 bg-emerald-50/70 hover:border-emerald-600 hover:shadow-md"
                    : "border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md"
                }`}
              >
                {/* Node Level Badge & Toggle */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-mono ${
                      node.level === "Capstone"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : node.level === "Advanced"
                        ? "bg-purple-100 text-purple-900 border border-purple-300"
                        : node.level === "Intermediate"
                        ? "bg-blue-100 text-blue-900 border border-blue-300"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    }`}
                  >
                    {node.level}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNodeCompletion(node.id);
                    }}
                    title={isCompleted ? "Mark Incomplete" : "Mark Mastered"}
                    className="text-slate-400 hover:text-emerald-600 transition-colors p-0.5"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300 hover:text-slate-500" />
                    )}
                  </button>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {node.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {node.subtitle}
                </p>

                {/* Key Skills Preview */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {node.skills.slice(0, 2).map((s, i) => (
                    <span
                      key={i}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-700 border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                  {node.skills.length > 2 && (
                    <span className="text-[9px] text-slate-400 self-center">
                      +{node.skills.length - 2} more
                    </span>
                  )}
                </div>

                {/* Footer Badges */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {node.estimatedHours}h
                  </span>

                  <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    <Briefcase className="h-3 w-3" />
                    {node.matchedJobsCount} Jobs
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Zoom & Pan Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur-md z-20">
          <button
            onClick={() => handleZoom(0.15)}
            title="Zoom In"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            title="Zoom Out"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            title="Reset Canvas Position"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Canvas Hint Badge */}
        <div className="absolute bottom-6 left-6 hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-1.5 text-xs text-slate-600 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Click any node to inspect free docs, code blueprints, and matching vacancies</span>
        </div>

        {/* Node Side Drawer */}
        {selectedNode && (
          <div className="drawer-content absolute top-0 right-0 h-full w-full sm:w-[480px] border-l border-slate-200 bg-white p-6 shadow-2xl z-40 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                    {selectedNode.level} Milestone
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                    {selectedNode.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedNode.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mastered Toggle Button */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex items-center gap-2">
                  {completedNodes.has(selectedNode.id) ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {completedNodes.has(selectedNode.id) ? "Marked as Mastered" : "Not Yet Mastered"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Counts toward your candidate Dev Score
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={completedNodes.has(selectedNode.id) ? "outline" : "default"}
                  onClick={() => toggleNodeCompletion(selectedNode.id)}
                  className={`text-xs font-bold ${
                    completedNodes.has(selectedNode.id)
                      ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                  }`}
                >
                  {completedNodes.has(selectedNode.id) ? "Mark Incomplete" : "Mark Mastered"}
                </Button>
              </div>

              {/* Core Mental Model Description */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <span>Core Architecture &amp; Mental Models</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedNode.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target Technical Skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.skills.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-xs font-bold font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Capstone Challenge */}
              {selectedNode.projectTask && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-emerald-600" />
                      <span>Hands-on Project Challenge</span>
                    </span>
                    <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold font-mono">
                      Portfolio
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedNode.projectTask}
                  </p>
                </div>
              )}

              {/* Interactive Code Blueprint */}
              {selectedNode.mentalModelSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-blue-600" />
                      <span>3-Minute Code Blueprint</span>
                    </span>
                    <button
                      onClick={() => copySnippet(selectedNode.mentalModelSnippet!)}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600 transition-colors lowercase font-mono"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCode ? "copied" : "copy snippet"}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-slate-900 text-slate-100 p-3.5 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                    <code>{selectedNode.mentalModelSnippet}</code>
                  </pre>
                </div>
              )}

              {/* ASSOCIATED POTD INTERVIEW QUESTION */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-900">
                    <Terminal className="h-3.5 w-3.5 text-purple-600" />
                    <span>Associated Interview Question (POTD)</span>
                  </div>
                  <span className="rounded bg-purple-100 text-purple-800 px-1.5 py-0.5 text-[9px] font-bold font-mono">
                    Coding Prep
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {selectedNode.interviewQuestion?.question ||
                    `In production systems, what are the primary trade-offs and common failure modes when scaling ${selectedNode.title}?`}
                </p>

                {showAnswer ? (
                  <div className="mt-2 text-xs text-slate-700 bg-white p-3 rounded-lg border border-purple-200 leading-relaxed animate-in fade-in duration-150">
                    <div className="font-bold text-[11px] text-purple-900 mb-1">Architectural Solution:</div>
                    <p>
                      {selectedNode.interviewQuestion?.answer ||
                        `To scale ${selectedNode.title} reliably, isolate bottlenecks using non-blocking asynchronous patterns, enforce strict schema validation, and ensure idempotency across distributed state mutations.`}
                    </p>
                    <button
                      onClick={() => setShowAnswer(false)}
                      className="mt-2 text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
                    >
                      <ChevronUp className="h-3 w-3" /> Hide Solution
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
                  >
                    <ChevronDown className="h-3 w-3" /> Reveal Verified Interview Answer
                  </button>
                )}

                <div className="pt-1">
                  <Link
                    href={selectedNode.interviewQuestion?.potdLink || "/problems"}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 hover:text-purple-950 underline"
                  >
                    <span>Practice Problem in Online Code Editor →</span>
                  </Link>
                </div>
              </div>

              {/* LINKED VIDEO LESSON FROM /PLAYLISTS */}
              <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-red-900">
                    <Youtube className="h-3.5 w-3.5 text-red-600" />
                    <span>Linked Video Masterclass</span>
                  </div>
                  <span className="rounded bg-red-100 text-red-800 px-1.5 py-0.5 text-[9px] font-bold font-mono">
                    Free /playlists
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900">
                  {selectedNode.linkedPlaylist?.title || `${selectedNode.title} Deep Dive & Architecture`}
                </div>
                <p className="text-[11px] text-slate-600">
                  Curated by {selectedNode.linkedPlaylist?.creator || "Role Nest Technical Curators"} • Integrated video chapters and notes
                </p>

                <div className="pt-1">
                  <Link
                    href="/playlists"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 text-[11px] transition-colors shadow-2xs"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Watch in In-App Video Player</span>
                  </Link>
                </div>
              </div>

              {/* Free Curated Study Links */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Curated Documentation &amp; Labs</span>
                </div>
                <div className="space-y-1.5">
                  {selectedNode.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-all group"
                    >
                      <span className="flex items-center gap-2 truncate pr-2 font-medium">
                        <span className="rounded bg-slate-200 text-slate-700 px-1.5 py-0.5 text-[9px] font-bold font-mono">
                          {res.type}
                        </span>
                        <span className="truncate">{res.title}</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Study Notes (Synced to Cloud) */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>Your Learning Notes</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Auto-synced to cloud</span>
                </div>
                <textarea
                  value={nodeNote}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="Record your breakthroughs, key algorithms, or questions here..."
                  rows={3}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 mt-6 flex items-center gap-3">
              <Link
                href="/jobs"
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>View {selectedNode.matchedJobsCount} Matching Roles</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* EXPORTABLE VISUAL RESUME ARTIFACT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
                  Visual Resume Artifact
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1.5">
                  Export Your Skill Tree
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Embed your verified technical milestones directly into your GitHub profile <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">README.md</code> or portfolio.
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Active Track Progress Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{activeTrack.title}</span>
                <span className="font-mono font-bold text-emerald-800">
                  {progressCount}/{activeTrack.nodes.length} Nodes Mastered
                </span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600">
                PostgreSQL Cloud Ledger: Your node completions are registered under your account.
              </p>
            </div>

            {/* Export Actions */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  onClick={downloadSkillTreeSvg}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 h-10"
                >
                  <Download className="h-4 w-4" />
                  <span>Download SVG Tree</span>
                </Button>
                <Button
                  onClick={downloadSkillTreePng}
                  variant="outline"
                  className="border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-xs rounded-xl gap-1.5 h-10"
                >
                  <Download className="h-4 w-4 text-emerald-600" />
                  <span>Download PNG (2x Res)</span>
                </Button>
              </div>

              {/* GitHub README Badge Snippet */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5 text-slate-600" />
                    <span>GitHub README Markdown Badge</span>
                  </span>
                  <button
                    onClick={copyBadgeMarkdown}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
                  >
                    {copiedBadge ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedBadge ? "Copied!" : "Copy Markdown"}</span>
                  </button>
                </div>
                <pre className="rounded-xl bg-slate-900 text-slate-200 p-2.5 text-[11px] font-mono overflow-x-auto select-all">
                  <code>{`[![Role Nest Verified Skill Tree](https://img.shields.io/badge/Role%20Nest-Skills%20Verified-059669?style=for-the-badge&logo=codeforces&logoColor=white)](https://rolenest.in/canvas)`}</code>
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(false)}
                className="text-xs font-bold rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

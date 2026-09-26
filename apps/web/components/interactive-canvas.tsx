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
} from "lucide-react";
import { Button } from "./ui/button";

export function InteractiveStudyCanvas() {
  const [activeTrackId, setActiveTrackId] = useState<string>(CANVAS_TRACKS[0].id);
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [nodeNote, setNodeNote] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHelpBanner, setShowHelpBanner] = useState(true);

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

  // Load completed nodes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jobmint_completed_nodes");
      if (saved) {
        setCompletedNodes(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  // Sync node note
  useEffect(() => {
    if (selectedNode) {
      const savedNote = localStorage.getItem(`jobmint_canvas_note_${selectedNode.id}`) || "";
      setNodeNote(savedNote);
      setCopiedCode(false);
    }
  }, [selectedNode]);

  const handleNoteChange = (text: string) => {
    setNodeNote(text);
    if (selectedNode) {
      try {
        localStorage.setItem(`jobmint_canvas_note_${selectedNode.id}`, text);
      } catch {}
    }
  };

  const toggleNodeCompletion = (nodeId: string) => {
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
  };

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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

  // ── Trackpad / Mouse Wheel Zoom & Pan ──
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if ((e.target as HTMLElement).closest(".drawer-content")) {
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
          const d = `M ${startX} ${startY} C ${startX + dx * 0.5} ${startY}, ${endX - dx * 0.5} ${endY}, ${endX} ${endY}`;
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

      {/* Top Header & Track Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur-md z-20 gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Interactive Career Roadmap &amp; Skill Trees
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 font-mono">
                2026 Edition
              </span>
            </h1>
            <p className="text-xs text-slate-600">
              Prerequisite knowledge graph: Click any skill node for tutorials, code patterns &amp; verified hiring companies.
            </p>
          </div>
        </div>

        {/* Track Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {CANVAS_TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => {
                setActiveTrackId(track.id);
                setSelectedNode(null);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTrackId === track.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {track.title}
            </button>
          ))}
          <button
            onClick={() => setShowHelpBanner(!showHelpBanner)}
            title="What is this Canvas for?"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-1"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Explanatory Guide Banner (What is this for?) */}
      {showHelpBanner && (
        <div className="bg-emerald-50/90 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-900 flex items-center justify-between gap-4 z-15 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="leading-relaxed">
              <strong>What is this for?</strong> This interactive skill tree maps out your exact engineering career path in prerequisite order.
              <strong> Click any node</strong> to view free curated documentation, code patterns, and verified capstone tasks. Mark mastered skills to track your hire-readiness.
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
        onWheel={handleWheel}
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
                {/* Base connection line */}
                <path
                  d={conn.d}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                />
                {/* Animated active connection path */}
                {conn.isCompleted ? (
                  <path
                    d={conn.d}
                    fill="none"
                    stroke="url(#activeGradient)"
                    strokeWidth="3.5"
                    className="canvas-line-flow"
                  />
                ) : (
                  <path
                    d={conn.d}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-40"
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                    <span>Capstone Project Challenge</span>
                  </span>
                  <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold font-mono">
                    Portfolio
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  {selectedNode.capstoneProject.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedNode.capstoneProject.description}
                </p>
              </div>

              {/* Interactive Code Blueprint */}
              {selectedNode.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-blue-600" />
                      <span>Code Blueprint &amp; Pattern</span>
                    </span>
                    <button
                      onClick={() => copySnippet(selectedNode.codeSnippet!)}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600 transition-colors lowercase font-mono"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCode ? "copied" : "copy"}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-slate-900 text-slate-100 p-3.5 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                    <code>{selectedNode.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Free Curated Study Links */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Curated Free Resources</span>
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

              {/* Study Notes */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Your Learning Notes (Saved Locally)
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
    </div>
  );
}

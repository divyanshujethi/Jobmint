"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { Button } from "./ui/button";

export function InteractiveStudyCanvas() {
  const [activeTrackId, setActiveTrackId] = useState<string>(CANVAS_TRACKS[0].id);
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [nodeNote, setNodeNote] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);

  // Canvas Pan & Zoom State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
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

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".canvas-node") || (e.target as HTMLElement).closest(".drawer-content")) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.min(1.6, Math.max(0.5, prev + delta)));
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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden select-none">
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

      {/* Top Navigation & Track Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 py-3.5 backdrop-blur-md z-20 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Visual Skill Canvas
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                2026 Edition
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive node-graph roadmap: What to study, where to study, mental models &amp; verified project challenges.
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
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTrackId === track.id
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {track.title}
            </button>
          ))}
        </div>
      </div>

      {/* Subheader: Track Details & Progress Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50 px-6 py-2 text-xs text-slate-300 z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400">{activeTrack.badge}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 hidden md:inline">{activeTrack.description}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[11px] text-slate-400">
            Track Progress: <strong className="text-emerald-400">{progressCount}/{activeTrack.nodes.length}</strong> ({progressPercentage}%)
          </span>
          <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
      >
        {/* Transform Container */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: isPanning ? "none" : "transform 0.1s ease-out",
          }}
          className="absolute inset-0 w-[2700px] h-[950px] pointer-events-auto"
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="inactiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {connections.map((conn) => (
              <g key={conn.id}>
                {/* Base connection line */}
                <path
                  d={conn.d}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="4"
                />
                <path
                  d={conn.d}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 4"
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
                    stroke="#475569"
                    strokeWidth="1.5"
                    className="canvas-line-flow opacity-40"
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
                className={`canvas-node absolute rounded-2xl border p-4 shadow-xl transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-400 bg-slate-900 ring-2 ring-emerald-400/50 scale-105 z-30 shadow-emerald-500/20"
                    : isCompleted
                    ? "border-emerald-500/80 bg-slate-900/95 shadow-emerald-950/40 hover:border-emerald-400"
                    : "border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-850"
                }`}
              >
                {/* Node Level Badge & Toggle */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      node.level === "Capstone"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : node.level === "Advanced"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : node.level === "Intermediate"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
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
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-sm font-bold text-white leading-tight">
                  {node.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {node.subtitle}
                </p>

                {/* Key Skills Preview */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {node.skills.slice(0, 2).map((s, i) => (
                    <span
                      key={i}
                      className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[9px] font-mono text-slate-300 border border-slate-700/50"
                    >
                      {s}
                    </span>
                  ))}
                  {node.skills.length > 2 && (
                    <span className="text-[9px] text-slate-500 self-center">
                      +{node.skills.length - 2} more
                    </span>
                  )}
                </div>

                {/* Footer Badges */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {node.estimatedHours}h
                  </span>

                  <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <Briefcase className="h-3 w-3" />
                    {node.matchedJobsCount} Jobs
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Zoom & Pan Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur-md z-20">
          <button
            onClick={() => handleZoom(0.15)}
            title="Zoom In"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            title="Zoom Out"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            title="Reset Canvas Position"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Canvas Hint Badge */}
        <div className="absolute bottom-6 left-6 hidden sm:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Click any node to inspect free video lectures, exact docs, code blueprints &amp; capstone benchmarks</span>
        </div>

        {/* Node Side Drawer */}
        {selectedNode && (
          <div className="drawer-content absolute top-0 right-0 h-full w-full sm:w-[460px] border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl p-6 shadow-2xl z-40 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {selectedNode.category} • {selectedNode.level}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">
                    {selectedNode.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedNode.subtitle} • Estimated {selectedNode.estimatedHours} Hours
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* SECTION 1: WHAT TO STUDY */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  What You Will Master:
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedNode.description}
                  </p>
                  {selectedNode.keyTopics && selectedNode.keyTopics.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      {selectedNode.keyTopics.map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* SECTION 2: MENTAL MODEL & CODE BLUEPRINT */}
              {selectedNode.mentalModelSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="h-4 w-4 text-emerald-400" />
                      Mental Model &amp; Code Blueprint:
                    </span>
                    <button
                      onClick={() => copySnippet(selectedNode.mentalModelSnippet || "")}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors font-mono"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-[11px] text-emerald-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                    {selectedNode.mentalModelSnippet}
                  </pre>
                </div>
              )}

              {/* SECTION 3: WHERE TO STUDY (EXACT FREE RESOURCES) */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Where to Study (100% Free Links):</span>
                  <span className="text-[10px] text-emerald-400 font-bold">$0 Paid Fees</span>
                </span>
                <div className="space-y-2">
                  {selectedNode.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3 hover:border-emerald-500 hover:bg-slate-800/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-400">
                          {res.type === "video" ? (
                            <Play className="h-3.5 w-3.5 fill-current" />
                          ) : (
                            <BookOpen className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-400">
                            {res.title}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{res.provider}</div>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* SECTION 4: MATCHING INTERACTIVE COURSE */}
              {selectedNode.matchedCourseId && (
                <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">Interactive Certification Track</div>
                      <div className="text-[11px] text-emerald-200/80">Includes verifiable JobMint course diploma</div>
                    </div>
                  </div>
                  <Link href={`/courses/${selectedNode.matchedCourseId}/certificate`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs shrink-0">
                      Open Course
                    </Button>
                  </Link>
                </div>
              )}

              {/* SECTION 5: PROOF-OF-WORK BENCHMARK */}
              <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-indigo-400" /> Proof-of-Work Benchmark:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNode.projectTask}
                </p>
                <div className="pt-2">
                  <Link href="/profile/github">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-1.5 text-xs border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/40"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      Verify via GitHub Project Verifier
                    </Button>
                  </Link>
                </div>
              </div>

              {/* SECTION 6: PERSONAL STUDY NOTES */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>My Study Notes &amp; Repo Links:</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Auto-saved</span>
                </span>
                <textarea
                  rows={3}
                  placeholder="Record your project repo, implementation notes, or interview takeaways here..."
                  value={nodeNote}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 space-y-2 mt-4">
              <Button
                className={`w-full gap-2 font-bold ${
                  completedNodes.has(selectedNode.id)
                    ? "bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
                onClick={() => toggleNodeCompletion(selectedNode.id)}
              >
                {completedNodes.has(selectedNode.id) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Marked as Mastered (Click to Undo)
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" />
                    Mark Node as Mastered
                  </>
                )}
              </Button>

              <Link
                href={`/jobs?q=${encodeURIComponent(selectedNode.skills[0] || "")}`}
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full gap-1.5 text-xs text-slate-300 hover:text-white border-slate-800"
                >
                  <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                  View {selectedNode.matchedJobsCount} Matching Jobs
                  <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  KNOWLEDGE_GRAPH_NODES,
  KNOWLEDGE_GRAPH_EDGES,
  KnowledgeGraphNode,
} from "@/lib/knowledge-graph-data";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  BookOpen,
  Code2,
  Briefcase,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  X,
  Play,
  Share2,
  Award,
  Layers,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Button } from "./ui/button";

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  "AI & ML": { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-800", ring: "ring-purple-400" },
  Frontend: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-800", ring: "ring-emerald-400" },
  Databases: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-800", ring: "ring-blue-400" },
  "Systems & Cloud": { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-800", ring: "ring-amber-400" },
};

export function KnowledgeGraphView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [masteredNodeIds, setMasteredNodeIds] = useState<Set<string>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [studyNote, setStudyNote] = useState("");

  // Canvas Pan & Zoom State
  const [scale, setScale] = useState(0.9);
  const [pan, setPan] = useState({ x: 80, y: 40 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load mastered concepts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jobmint_mastered_concepts");
      if (saved) {
        setMasteredNodeIds(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  // Sync quiz and notes on node selection
  useEffect(() => {
    if (selectedNode) {
      setQuizAnswer(null);
      setHasSubmittedQuiz(false);
      setCopiedCode(false);
      try {
        const note = localStorage.getItem(`jobmint_concept_note_${selectedNode.id}`) || "";
        setStudyNote(note);
      } catch {}
    }
  }, [selectedNode]);

  const handleNoteChange = (text: string) => {
    setStudyNote(text);
    if (selectedNode) {
      try {
        localStorage.setItem(`jobmint_concept_note_${selectedNode.id}`, text);
      } catch {}
    }
  };

  const handleQuizSelect = (index: number) => {
    if (hasSubmittedQuiz || !selectedNode) return;
    setQuizAnswer(index);
    setHasSubmittedQuiz(true);

    if (index === selectedNode.interactiveQuiz.correctIndex) {
      setMasteredNodeIds((prev) => {
        const next = new Set(prev).add(selectedNode.id);
        try {
          localStorage.setItem("jobmint_mastered_concepts", JSON.stringify(Array.from(next)));
        } catch {}
        return next;
      });
    }
  };

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(".graph-node") ||
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
    const onMouseUp = () => setIsPanning(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isPanning]);

  // Trackpad / Wheel zoom & pan
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if ((e.target as HTMLElement).closest(".drawer-content")) return;
    e.preventDefault();
    if (e.ctrlKey || Math.abs(e.deltaY) > 80) {
      const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
      setScale((prev) => Math.min(1.8, Math.max(0.4, prev + zoomFactor)));
    } else {
      setPan((prev) => ({
        x: prev.x - e.deltaX * 0.8,
        y: prev.y - e.deltaY * 0.8,
      }));
    }
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".drawer-content")) return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX - pan.x, y: t.clientY - pan.y };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current = { x: pan.x, y: pan.y, dist: Math.sqrt(dx * dx + dy * dy) };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".drawer-content")) return;
    if (e.touches.length === 1 && touchStartRef.current.dist === undefined) {
      const t = e.touches[0];
      setPan({ x: t.clientX - touchStartRef.current.x, y: t.clientY - touchStartRef.current.y });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const ratio = newDist / touchStartRef.current.dist;
      setScale((prev) => Math.min(1.8, Math.max(0.4, prev * ratio)));
      touchStartRef.current.dist = newDist;
    }
  };

  const nodeMap = useMemo(() => {
    const map = new Map<string, KnowledgeGraphNode>();
    KNOWLEDGE_GRAPH_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  const visibleNodes = useMemo(() => {
    if (selectedCategory === "All") return KNOWLEDGE_GRAPH_NODES;
    return KNOWLEDGE_GRAPH_NODES.filter((n) => n.category === selectedCategory);
  }, [selectedCategory]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  // Edges calculation
  const edges = useMemo(() => {
    return KNOWLEDGE_GRAPH_EDGES.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    ).map((e) => {
      const sourceNode = nodeMap.get(e.source)!;
      const targetNode = nodeMap.get(e.target)!;
      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      const d = `M ${sourceNode.x} ${sourceNode.y} Q ${midX} ${midY - 20}, ${targetNode.x} ${targetNode.y}`;

      const isConnectedToHover = hoveredNodeId === e.source || hoveredNodeId === e.target;
      const isConnectedToSelect = selectedNode?.id === e.source || selectedNode?.id === e.target;

      return {
        id: `${e.source}->${e.target}`,
        sourceNode,
        targetNode,
        relationship: e.relationship,
        d,
        midX,
        midY: midY - 10,
        highlighted: isConnectedToHover || isConnectedToSelect,
      };
    });
  }, [visibleNodeIds, nodeMap, hoveredNodeId, selectedNode]);

  const categories = ["All", "AI & ML", "Frontend", "Databases", "Systems & Cloud"];
  const totalXP = masteredNodeIds.size * 25;

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden bg-slate-50 select-none">
      {/* Top Filter and Stats Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-2.5 backdrop-blur-md z-10 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="h-3.5 w-3.5" /> Cluster:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1 text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-800">
            <Award className="h-3.5 w-3.5 text-emerald-600" />
            <span>Mastery XP: <strong>{totalXP} XP</strong></span>
          </div>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">
            Mastered: <strong className="text-slate-900">{masteredNodeIds.size} / {KNOWLEDGE_GRAPH_NODES.length}</strong> Concepts
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => (touchStartRef.current = { x: 0, y: 0 })}
        className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden bg-slate-50 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: isPanning ? "none" : "transform 0.05s ease-out",
          }}
          className="absolute inset-0 w-[1400px] h-[1150px] pointer-events-auto"
        >
          {/* SVG Connection Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="edgeGradientHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {edges.map((edge) => (
              <g key={edge.id}>
                <path
                  d={edge.d}
                  fill="none"
                  stroke={edge.highlighted ? "url(#edgeGradientHighlight)" : "#cbd5e1"}
                  strokeWidth={edge.highlighted ? 3 : 1.5}
                  strokeDasharray={edge.highlighted ? "none" : "4 4"}
                  className="transition-all duration-200"
                />
                {edge.highlighted && (
                  <text
                    x={edge.midX}
                    y={edge.midY}
                    fill="#047857"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="bg-white/80 px-1 py-0.5 rounded pointer-events-none font-mono"
                  >
                    {edge.relationship}
                  </text>
                )}
              </g>
            ))}
          </svg>

          {/* Interactive Graph Nodes */}
          {visibleNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isMastered = masteredNodeIds.has(node.id);
            const colorTheme = CATEGORY_COLORS[node.category] || CATEGORY_COLORS["Frontend"];

            // Size based on importance
            const nodeRadius = node.importance === 3 ? "w-44 p-3.5" : node.importance === 2 ? "w-40 p-3" : "w-36 p-2.5";

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  left: `${node.x - (node.importance === 3 ? 88 : 80)}px`,
                  top: `${node.y - 35}px`,
                }}
                className={`graph-node absolute rounded-2xl border-2 bg-white shadow-sm transition-all duration-200 cursor-pointer ${nodeRadius} ${
                  isSelected
                    ? "border-emerald-600 ring-4 ring-emerald-500/20 shadow-lg scale-105 z-30"
                    : isHovered
                    ? "border-emerald-400 shadow-md scale-102 z-20"
                    : "border-slate-200 hover:border-emerald-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider font-mono border ${colorTheme.bg} ${colorTheme.text} ${colorTheme.border}`}
                  >
                    {node.category}
                  </span>
                  {isMastered && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                  )}
                </div>

                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  {node.label}
                </h4>

                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {node.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Viewport Floating Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white/90 p-1.5 shadow-lg backdrop-blur-md z-20">
          <button
            onClick={() => setScale((s) => Math.min(1.8, s + 0.15))}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(0.4, s - 0.15))}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-0.5" />
          <button
            onClick={() => {
              setScale(0.9);
              setPan({ x: 80, y: 40 });
            }}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Reset Graph Center"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Interactive Concept Deep-Dive Drawer */}
      {selectedNode && (
        <div className="drawer-content absolute right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl z-40 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 sticky top-0 backdrop-blur-md z-10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold font-mono">
                  {selectedNode.category}
                </span>
                {masteredNodeIds.has(selectedNode.id) && (
                  <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Mastered (+25 XP)
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {selectedNode.label}
              </h2>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="rounded-xl p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* 60-Second Mental Model */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider font-mono">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>60-Second Intuitive Mental Model</span>
              </div>
              <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                {selectedNode.mentalModel}
              </p>
            </div>

            {/* Technical Summary */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Engineering Specification
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {selectedNode.summary}
              </p>
            </div>

            {/* Interactive Knowledge Check (Quiz) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span>Interactive Knowledge Check</span>
                </span>
                <span className="rounded bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-bold font-mono">
                  +25 XP
                </span>
              </div>

              <p className="text-xs font-bold text-slate-900 leading-snug">
                {selectedNode.interactiveQuiz.question}
              </p>

              <div className="space-y-2">
                {selectedNode.interactiveQuiz.options.map((opt, idx) => {
                  const isCorrect = idx === selectedNode.interactiveQuiz.correctIndex;
                  const isSelected = quizAnswer === idx;

                  let optionStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700";
                  if (hasSubmittedQuiz) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-red-400 bg-red-50 text-red-950 font-medium";
                    } else {
                      optionStyle = "border-slate-200 opacity-50 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect(idx)}
                      disabled={hasSubmittedQuiz}
                      className={`w-full text-left rounded-xl border p-2.5 text-xs transition-all flex items-start gap-2.5 ${optionStyle}`}
                    >
                      <span className="font-mono text-[11px] font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="leading-relaxed flex-1">{opt}</span>
                      {hasSubmittedQuiz && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      )}
                      {hasSubmittedQuiz && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {hasSubmittedQuiz && (
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">Explanation:</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {selectedNode.interactiveQuiz.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Code Blueprint Pattern */}
            {selectedNode.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-emerald-600" />
                    <span>Production Code Pattern</span>
                  </span>
                  <button
                    onClick={() => copySnippet(selectedNode.codeSnippet!)}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600 transition-colors lowercase font-mono"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? "copied!" : "copy"}</span>
                  </button>
                </div>
                <pre className="rounded-xl bg-slate-900 text-slate-100 p-3.5 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                  <code>{selectedNode.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Live Job Demand Matching */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-emerald-600" />
                  <span>Live Job Matching</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Hiring Now
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Explore real verified companies hiring for <strong>{selectedNode.matchingSkill}</strong> on Role Nest.
              </p>
              <Link href={`/jobs?q=${encodeURIComponent(selectedNode.matchingSkill)}`}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9">
                  View Matching Jobs for {selectedNode.matchingSkill}
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>

            {/* Personal Study Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block font-mono uppercase tracking-wider">
                Personal Study Notes (Auto-saved)
              </label>
              <textarea
                value={studyNote}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Jot down personal interview takeaways, mental mnemonics..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  PenTool,
  Flame,
  Trophy,
  Award,
  Zap,
  Target,
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

// Gamification Ranks
const RANKS = [
  { name: "Apprentice Coder", minXp: 0, maxXp: 500, icon: "🌱", color: "text-emerald-400" },
  { name: "Algorithm Builder", minXp: 500, maxXp: 1500, icon: "⚡", color: "text-cyan-400" },
  { name: "Systems Architect", minXp: 1500, maxXp: 3000, icon: "🛡️", color: "text-indigo-400" },
  { name: "Staff Specialist", minXp: 3000, maxXp: 5000, icon: "👑", color: "text-purple-400" },
  { name: "Grandmaster Fellow", minXp: 5000, maxXp: 10000, icon: "🔥", color: "text-amber-400" },
];

const DAILY_QUESTS = [
  { id: "q1", title: "Master an Architectural Node", xp: 100, desc: "Mark any node as mastered on the canvas", icon: "🎯" },
  { id: "q2", title: "Review 3-Min Code Blueprint", xp: 50, desc: "Inspect and copy a production blueprint", icon: "💻" },
  { id: "q3", title: "Crack an Interview POTD", xp: 50, desc: "Reveal and review the technical solution", icon: "💡" },
  { id: "q4", title: "Explore a Second Track", xp: 50, desc: "Switch and inspect a different engineering path", icon: "🗺️" },
];

const ACHIEVEMENTS = [
  { id: "a1", title: "First Commit", desc: "Master your very first roadmap node", xp: 100, icon: "🚀" },
  { id: "a2", title: "Streak Warrior", desc: "Maintain a consecutive daily learning streak", xp: 150, icon: "🔥" },
  { id: "a3", title: "Systems Thinker", desc: "Master 5 technical milestones", xp: 250, icon: "💎" },
  { id: "a4", title: "Polyglot Master", desc: "Inspect 3 specialized engineering tracks", xp: 100, icon: "🌐" },
  { id: "a5", title: "Grandmaster Aspirant", desc: "Accumulate 1,500+ Engineering XP", xp: 500, icon: "👑" },
  { id: "a6", title: "Architect Fellow", desc: "Complete 10 milestones across curricula", xp: 600, icon: "🏛️" },
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

  // ── Gamification State ──
  const [userXp, setUserXp] = useState<number>(350);
  const [streakDays, setStreakDays] = useState<number>(4);
  const [claimedQuests, setClaimedQuests] = useState<Set<string>>(new Set());
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set(["a1"]));
  const [showQuestsModal, setShowQuestsModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [floatingXp, setFloatingXp] = useState<{ id: number; text: string; x: number; y: number } | null>(null);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  // Canvas Pan & Zoom State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  const activeTrack = useMemo(() => {
    return CANVAS_TRACKS.find((t) => t.id === activeTrackId) || CANVAS_TRACKS[0];
  }, [activeTrackId]);

  // Current Rank Calculation
  const currentRank = useMemo(() => {
    return RANKS.find((r) => userXp >= r.minXp && userXp < r.maxXp) || RANKS[RANKS.length - 1];
  }, [userXp]);

  const rankProgress = useMemo(() => {
    const range = currentRank.maxXp - currentRank.minXp;
    const currentInRank = userXp - currentRank.minXp;
    return Math.min(100, Math.max(0, Math.round((currentInRank / range) * 100)));
  }, [userXp, currentRank]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem("studynest_completed_nodes");
      if (savedNodes) setCompletedNodes(new Set(JSON.parse(savedNodes)));

      const savedXp = localStorage.getItem("studynest_gamification_xp");
      if (savedXp) setUserXp(parseInt(savedXp, 10));

      const savedQuests = localStorage.getItem("studynest_claimed_quests");
      if (savedQuests) setClaimedQuests(new Set(JSON.parse(savedQuests)));

      const savedAchievements = localStorage.getItem("studynest_achievements");
      if (savedAchievements) setUnlockedAchievements(new Set(JSON.parse(savedAchievements)));
    } catch {}

    // Cloud sync check with PostgreSQL
    fetch("/api/user/canvas-progress")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && Array.isArray(data.completedNodes)) {
          setCompletedNodes((prev) => {
            const merged = new Set([...Array.from(prev), ...data.completedNodes]);
            try {
              localStorage.setItem("studynest_completed_nodes", JSON.stringify(Array.from(merged)));
            } catch {}
            return merged;
          });
          setCloudSynced(true);
        }
      })
      .catch(() => {});
  }, []);

  // Trigger floating XP & Confetti blast
  const awardXp = useCallback((amount: number, reason: string, coords?: { x: number; y: number }) => {
    setUserXp((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem("studynest_gamification_xp", next.toString());
      } catch {}
      return next;
    });

    const x = coords?.x ?? (window.innerWidth / 2);
    const y = coords?.y ?? (window.innerHeight / 2 - 40);

    setFloatingXp({ id: Date.now(), text: `+${amount} XP ${reason}`, x, y });
    setTimeout(() => setFloatingXp(null), 2200);

    triggerConfetti();
  }, []);

  // Pure canvas particle confetti engine
  const triggerConfetti = () => {
    setConfettiActive(true);
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rot: number;
      vRot: number;
      opacity: number;
    }> = [];

    const colors = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 300,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 7 + 4,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        opacity: 1,
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.rot += p.vRot;
        if (frame > 25) p.opacity -= 0.025;

        if (p.opacity > 0) {
          alive++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive > 0 && frame < 90) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setConfettiActive(false);
      }
    };
    requestAnimationFrame(animate);
  };

  // Sync node note
  useEffect(() => {
    if (selectedNode) {
      const savedNote = localStorage.getItem(`studynest_canvas_note_${selectedNode.id}`) || "";
      setNodeNote(savedNote);
      setCopiedCode(false);
      setShowAnswer(false);
    }
  }, [selectedNode]);

  const handleNoteChange = (text: string) => {
    setNodeNote(text);
    if (selectedNode) {
      try {
        localStorage.setItem(`studynest_canvas_note_${selectedNode.id}`, text);
      } catch {}
      fetch("/api/user/canvas-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: { id: selectedNode.id, text } }),
      }).catch(() => {});
    }
  };

  const toggleNodeCompletion = (nodeId: string, clientCoords?: { x: number; y: number }) => {
    const isNowCompleted = !completedNodes.has(nodeId);
    setCompletedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      try {
        localStorage.setItem("studynest_completed_nodes", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });

    if (isNowCompleted) {
      awardXp(100, "Node Mastered!", clientCoords);
      setUnlockedAchievements((prev) => {
        const next = new Set(prev);
        next.add("a1");
        if (completedNodes.size + 1 >= 5) next.add("a3");
        try {
          localStorage.setItem("studynest_achievements", JSON.stringify(Array.from(next)));
        } catch {}
        return next;
      });
    }

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
    const mdBadge = `[![StudyNest Verified Skill Tree](https://img.shields.io/badge/StudyNest-Skills%20Verified-4f46e5?style=for-the-badge&logo=codeforces&logoColor=white)](https://study.rolenest.in/canvas)`;
    navigator.clipboard.writeText(mdBadge);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2500);
  };

  const downloadSkillTreeSvg = () => {
    const svgEl = containerRef.current?.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `studynest-${activeTrack.id}-skill-tree.svg`;
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
      ctx.fillStyle = "#060814";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(`StudyNest Verified Skill Tree • ${activeTrack.title}`, 40, 45);
      ctx.fillStyle = "#6366f1";
      ctx.font = "14px monospace";
      ctx.fillText(`Mastered: ${progressCount}/${activeTrack.nodes.length} Nodes • Rank: ${currentRank.name} (${userXp} XP)`, 40, 75);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `studynest-${activeTrack.id}-skill-tree.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // ── Pan Handlers (Smooth Dragging Across Course Roadmap) ──
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(".canvas-node") ||
      (e.target as HTMLElement).closest(".drawer-content") ||
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a") ||
      (e.target as HTMLElement).closest("input") ||
      (e.target as HTMLElement).closest("textarea")
    ) {
      return;
    }

    setIsPanning(true);
    startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        setPan({
          x: e.clientX - startPanRef.current.x,
          y: e.clientY - startPanRef.current.y,
        });
      }
    };

    const onMouseUp = () => {
      if (isPanning) setIsPanning(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isPanning]);

  // Trackpad / Wheel Zoom & Pan
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement)?.closest(".drawer-content")) return;
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
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Touch Handlers
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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#060814] text-slate-100 overflow-hidden select-none font-sans relative">
      <style>{`
        @keyframes neonPulse {
          0% { stroke-dashoffset: 40; filter: drop-shadow(0 0 2px #6366f1); }
          50% { filter: drop-shadow(0 0 8px #06b6d4); }
          100% { stroke-dashoffset: 0; filter: drop-shadow(0 0 2px #6366f1); }
        }
        .canvas-neon-flow {
          stroke-dasharray: 8 6;
          animation: neonPulse 1.6s linear infinite;
        }
        @keyframes floatUpFade {
          0% { transform: translateY(0) scale(0.9); opacity: 0; }
          20% { transform: translateY(-12px) scale(1.1); opacity: 1; }
          80% { transform: translateY(-35px) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(0.95); opacity: 0; }
        }
        .animate-float-xp {
          animation: floatUpFade 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Confetti Canvas Overlay */}
      <canvas
        ref={confettiCanvasRef}
        className={`pointer-events-none fixed inset-0 z-50 ${confettiActive ? "block" : "hidden"}`}
      />

      {/* Floating XP Reward Notification */}
      {floatingXp && (
        <div
          style={{ left: `${floatingXp.x}px`, top: `${floatingXp.y}px` }}
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-400 px-4 py-2 font-black text-white text-sm shadow-2xl shadow-indigo-500/50 animate-float-xp border border-white/30 backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-amber-200 animate-spin" />
          <span>{floatingXp.text}</span>
        </div>
      )}

      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-indigo-950/80 bg-[#0c1024]/90 px-6 py-3 backdrop-blur-xl z-20 gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2 tracking-tight">
              Interactive Course Canvas
              <span className="rounded-full bg-indigo-500/20 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300 font-mono">
                StudyNest Studio
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Visual engineering roadmaps, milestone skill trees &amp; verified candidate mastery.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* LINK TO WHITEBOARD & NOTES */}
          <Link
            href="/whiteboard"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-amber-500/20 transition-all border border-amber-400/30 hover:scale-[1.02]"
            title="Open Google Notes Style Notepad and Vector Whiteboard"
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Open Whiteboard &amp; Notes</span>
          </Link>

          {/* Gamification HUD Pill */}
          <div className="flex items-center gap-2 bg-[#101533] border border-indigo-900/60 rounded-2xl px-3 py-1.5 shadow-inner">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{currentRank.icon}</span>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {currentRank.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 font-mono">{userXp} XP</span>
                  <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500"
                      style={{ width: `${rankProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-indigo-900/50 mx-1" />

            {/* Streak Counter */}
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20" title="4-day learning streak">
              <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{streakDays}d</span>
            </div>

            {/* Quests Button */}
            <button
              onClick={() => setShowQuestsModal(true)}
              className="relative p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-950/60 transition-colors"
              title="Daily Quests"
            >
              <Target className="h-4 w-4 text-cyan-400" />
              {claimedQuests.size < DAILY_QUESTS.length && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#101533]" />
              )}
            </button>

            {/* Achievements Button */}
            <button
              onClick={() => setShowAchievementsModal(true)}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-950/60 transition-colors"
              title="Career Achievements"
            >
              <Trophy className="h-4 w-4 text-amber-400" />
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-[#101533] p-1 border border-indigo-900/50 shadow-inner">
            <button
              onClick={() => setViewMode("roadmap")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === "roadmap"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GitFork className="h-3.5 w-3.5 text-cyan-400" />
              <span>Roadmap Tree</span>
            </button>
            <button
              onClick={() => setViewMode("graph")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === "graph"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Network className="h-3.5 w-3.5 text-cyan-400" />
              <span>Knowledge Graph</span>
            </button>
          </div>

          {/* Export Artifact Button */}
          <Button
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-lg shadow-indigo-600/20 border border-indigo-500/30"
          >
            <Download className="h-3.5 w-3.5 text-cyan-300" />
            <span>Export Skill Artifact</span>
          </Button>

          {cloudSynced && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-400">
              <Cloud className="h-3.5 w-3.5 text-emerald-400" />
              Synced
            </span>
          )}

          <button
            onClick={() => setShowHelpBanner(!showHelpBanner)}
            title="Canvas Guide"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-indigo-950/60 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Role Tracks Selector Pills */}
      {viewMode === "roadmap" && (
        <div className="bg-[#090d22]/90 border-b border-indigo-950/60 px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto z-15 backdrop-blur-md">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Engineering Disciplines:
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
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40"
                      : "bg-[#101533]/80 text-slate-300 hover:bg-[#161d47] hover:text-white border border-indigo-900/40"
                  }`}
                >
                  <span>{role.icon}</span>
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* More Tracks Dropdown */}
          <div className="flex items-center gap-1 shrink-0">
            <select
              value={ROLE_SWITCHERS.some((r) => r.id === activeTrackId) ? "" : activeTrackId}
              onChange={(e) => {
                if (e.target.value) {
                  setActiveTrackId(e.target.value);
                  setSelectedNode(null);
                }
              }}
              className="bg-[#101533] border border-indigo-900/60 text-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 shadow-inner"
            >
              <option value="" disabled className="bg-[#090d22] text-slate-400">More Specialized Tracks...</option>
              {CANVAS_TRACKS.filter((t) => !ROLE_SWITCHERS.some((r) => r.id === t.id)).map((t) => (
                <option key={t.id} value={t.id} className="bg-[#090d22] text-white">
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Explanatory Help Notice */}
      {showHelpBanner && (
        <div className="bg-indigo-950/40 border-b border-indigo-900/50 px-6 py-2 text-xs text-indigo-200 flex items-center justify-between gap-4 z-15 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="leading-relaxed">
              <strong className="text-white">Interactive Course Tree:</strong> Click any milestone node to inspect 3-minute code blueprints, interview questions, and gain +100 XP toward your candidate rank! For taking visual notes or drawing, open the Whiteboard Studio above.
            </div>
          </div>
          <button
            onClick={() => setShowHelpBanner(false)}
            className="text-indigo-400 hover:text-white p-1 rounded hover:bg-indigo-900/40 transition-colors shrink-0"
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
          {/* Track Details & Progress Subheader */}
          <div className="flex items-center justify-between border-b border-indigo-950/60 bg-[#090d22]/70 px-6 py-2 text-xs text-slate-400 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800/40 font-mono">
                {activeTrack.badge}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 hidden md:inline">{activeTrack.description}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-[11px] text-slate-300">
                Mastered: <strong className="text-emerald-400 font-bold">{progressCount}/{activeTrack.nodes.length}</strong> ({progressPercentage}%)
              </span>
              <div className="w-28 bg-[#101533] rounded-full h-2 overflow-hidden border border-indigo-900/40">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Course Roadmap Canvas Area */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative flex-1 overflow-hidden bg-[#060814] bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] ${
              isPanning ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {/* World Coordinates Container */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: "0 0",
                transition: isPanning ? "none" : "transform 0.05s ease-out",
              }}
              className="absolute inset-0 w-[3000px] h-[1200px] pointer-events-auto"
            >
              {/* SVG Vector Connections Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                {/* Node Connection Lines */}
                {connections.map((conn) => (
                  <g key={conn.id}>
                    {conn.isCompleted ? (
                      <path
                        d={conn.d}
                        fill="none"
                        stroke="url(#neonGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="canvas-neon-flow"
                      />
                    ) : (
                      <path
                        d={conn.d}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                      />
                    )}
                  </g>
                ))}
              </svg>

              {/* Obsidian Canvas Course Nodes */}
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
                      width: "235px",
                    }}
                    className={`canvas-node absolute rounded-2xl border p-4 shadow-xl transition-all cursor-pointer ${
                      isSelected
                        ? "border-cyan-400 bg-[#0d1433] ring-4 ring-cyan-500/30 scale-105 z-30 shadow-2xl shadow-cyan-500/20"
                        : isCompleted
                        ? "border-emerald-500/60 bg-[#07191d]/90 hover:border-emerald-400 hover:shadow-emerald-500/10"
                        : "border-indigo-950/90 bg-[#0a0f29]/95 hover:border-indigo-600/70 hover:shadow-indigo-500/10 hover:bg-[#0c1333]"
                    }`}
                  >
                    {/* Node Level Badge & Completion Toggle */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-mono ${
                          node.level === "Capstone"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : node.level === "Advanced"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : node.level === "Intermediate"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {node.level}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNodeCompletion(node.id, { x: e.clientX, y: e.clientY });
                        }}
                        title={isCompleted ? "Mark Incomplete" : "Mark Mastered (+100 XP)"}
                        className="text-slate-400 hover:text-emerald-400 transition-colors p-0.5"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-600 hover:text-cyan-400" />
                        )}
                      </button>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-sm font-extrabold text-white leading-tight">
                      {node.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {node.subtitle}
                    </p>

                    {/* Key Technical Skills */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {node.skills.slice(0, 2).map((s, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-indigo-950/70 px-2 py-0.5 text-[9px] font-mono text-indigo-300 border border-indigo-800/40"
                        >
                          {s}
                        </span>
                      ))}
                      {node.skills.length > 2 && (
                        <span className="text-[9px] text-slate-500 self-center">
                          +{node.skills.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-3 flex items-center justify-between border-t border-indigo-950/60 pt-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3 text-slate-500" />
                        {node.estimatedHours}h
                      </span>

                      <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 font-mono">
                        <Zap className="h-3 w-3 text-amber-400" />
                        +100 XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Left Hint Pill */}
            <div className="absolute bottom-6 left-6 hidden sm:flex items-center gap-2 rounded-2xl border border-indigo-900/80 bg-[#0c1024]/95 px-3.5 py-2 text-xs text-slate-300 shadow-xl backdrop-blur-xl z-20">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Click any node to inspect code blueprints, POTD interview prep &amp; earn +100 XP</span>
            </div>

            {/* Floating Zoom & Pan Controls (Bottom Right) */}
            <div className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-2xl border border-indigo-900/80 bg-[#0c1024]/95 p-1.5 shadow-2xl backdrop-blur-xl z-20">
              <button
                onClick={() => handleZoom(0.15)}
                title="Zoom In"
                className="rounded-xl p-2 text-slate-400 hover:bg-indigo-950/60 hover:text-white transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleZoom(-0.15)}
                title="Zoom Out"
                className="rounded-xl p-2 text-slate-400 hover:bg-indigo-950/60 hover:text-white transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={resetView}
                title="Reset View"
                className="rounded-xl p-2 text-slate-400 hover:bg-indigo-950/60 hover:text-white transition-colors"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Slide-out Curriculum Node Drawer (Obsidian Dark Theme) */}
            {selectedNode && (
              <div className="drawer-content absolute top-0 right-0 h-full w-full sm:w-[500px] border-l border-indigo-950/90 bg-[#080c22] p-6 shadow-2xl z-40 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
                <div className="space-y-6">
                  {/* Drawer Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                        {selectedNode.level} Milestone
                      </span>
                      <h2 className="text-xl font-black text-white mt-2">
                        {selectedNode.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {selectedNode.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedNode(null)}
                      className="rounded-xl p-1.5 text-slate-400 hover:bg-indigo-950/60 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Mastered Toggle Action Card */}
                  <div className="flex items-center justify-between rounded-2xl bg-[#0e1438] border border-indigo-900/60 p-3.5 shadow-inner">
                    <div className="flex items-center gap-3">
                      {completedNodes.has(selectedNode.id) ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-500" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{completedNodes.has(selectedNode.id) ? "Marked as Mastered" : "Ready to Master"}</span>
                          <span className="text-amber-400 font-mono text-[11px] font-bold">+100 XP</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Adds verified architectural proof to your candidate ledger
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={(e) => toggleNodeCompletion(selectedNode.id, { x: e.clientX, y: e.clientY })}
                      className={`text-xs font-bold rounded-xl transition-all ${
                        completedNodes.has(selectedNode.id)
                          ? "border border-indigo-900/80 bg-transparent text-slate-300 hover:bg-indigo-950/60"
                          : "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-600/20"
                      }`}
                    >
                      {completedNodes.has(selectedNode.id) ? "Undo Mastery" : "Mark Mastered"}
                    </Button>
                  </div>

                  {/* Core Mental Model Description */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                      <span>Architecture &amp; Mental Models</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0c1130] p-4 rounded-2xl border border-indigo-950/80 shadow-inner">
                      {selectedNode.description}
                    </p>
                  </div>

                  {/* Target Skills Pills */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Target Technical Competencies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.skills.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-xl bg-indigo-950/80 text-cyan-300 border border-indigo-800/60 px-2.5 py-1 text-xs font-bold font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hands-on Project Challenge */}
                  {selectedNode.projectTask && (
                    <div className="rounded-2xl border border-indigo-900/60 bg-[#0d1338] p-4 space-y-2 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <GraduationCap className="h-4 w-4 text-cyan-400" />
                          <span>Hands-on Architecture Challenge</span>
                        </span>
                        <span className="rounded-lg bg-indigo-500/20 text-cyan-300 px-2 py-0.5 text-[9px] font-bold font-mono border border-indigo-500/30">
                          +50 XP Challenge
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {selectedNode.projectTask}
                      </p>
                    </div>
                  )}

                  {/* Interactive Code Blueprint */}
                  {selectedNode.mentalModelSnippet && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                          <span>3-Minute Production Blueprint</span>
                        </span>
                        <button
                          onClick={() => copySnippet(selectedNode.mentalModelSnippet!)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors lowercase font-mono"
                        >
                          {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedCode ? "copied" : "copy snippet"}</span>
                        </button>
                      </div>
                      <pre className="rounded-2xl bg-[#030611] text-cyan-300 p-4 text-xs font-mono overflow-x-auto leading-relaxed border border-indigo-950/80 shadow-inner">
                        <code>{selectedNode.mentalModelSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Associated POTD Interview Question */}
                  <div className="rounded-2xl border border-purple-900/60 bg-[#120f2e] p-4 space-y-2.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-300">
                        <Terminal className="h-3.5 w-3.5 text-purple-400" />
                        <span>Associated Interview Question (POTD)</span>
                      </div>
                      <span className="rounded-lg bg-purple-500/20 text-purple-300 px-2 py-0.5 text-[9px] font-bold font-mono border border-purple-500/30">
                        +50 XP Prep
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white leading-snug">
                      {selectedNode.interviewQuestion?.question ||
                        `In production systems, what are the primary trade-offs and common failure modes when scaling ${selectedNode.title}?`}
                    </p>

                    {showAnswer ? (
                      <div className="mt-2 text-xs text-slate-200 bg-[#09071c] p-3.5 rounded-xl border border-purple-900/50 leading-relaxed animate-in fade-in duration-150">
                        <div className="font-bold text-[11px] text-purple-300 mb-1">Architectural Solution:</div>
                        <p>
                          {selectedNode.interviewQuestion?.answer ||
                            `To scale ${selectedNode.title} reliably, isolate bottlenecks using non-blocking asynchronous patterns, enforce strict schema validation, and ensure idempotency across distributed state mutations.`}
                        </p>
                        <button
                          onClick={() => setShowAnswer(false)}
                          className="mt-2 text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1"
                        >
                          <ChevronUp className="h-3 w-3" /> Hide Solution
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowAnswer(true);
                          awardXp(50, "Interview Prep Complete!");
                        }}
                        className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                      >
                        <ChevronDown className="h-3 w-3" /> Reveal Verified Architectural Answer (+50 XP)
                      </button>
                    )}

                    <div className="pt-1">
                      <Link
                        href={selectedNode.interviewQuestion?.potdLink || "/problems"}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-300 hover:text-purple-200 underline"
                      >
                        <span>Open in Cloud Code Editor →</span>
                      </Link>
                    </div>
                  </div>

                  {/* Linked Video Lesson from /playlists */}
                  <div className="rounded-2xl border border-rose-950/60 bg-[#1e0d16]/70 p-4 space-y-2 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-300">
                        <Youtube className="h-3.5 w-3.5 text-rose-400" />
                        <span>Curated Video Masterclass</span>
                      </div>
                      <span className="rounded-lg bg-rose-500/20 text-rose-300 px-2 py-0.5 text-[9px] font-bold font-mono border border-rose-500/30">
                        Free Masterclass
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white">
                      {selectedNode.linkedPlaylist?.title || `${selectedNode.title} Deep Dive & Architecture`}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Curated by {selectedNode.linkedPlaylist?.creator || "StudyNest Technical Curators"}
                    </p>

                    <div className="pt-1">
                      <Link
                        href="/playlists"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold px-3 py-1.5 text-[11px] transition-all shadow-md shadow-rose-600/20"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Watch in Academy Player</span>
                      </Link>
                    </div>
                  </div>

                  {/* Curated Documentation Links */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Curated Documentation &amp; RFCs</span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedNode.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-xl bg-[#0d1338] border border-indigo-950/80 p-2.5 text-xs text-slate-200 hover:border-cyan-500/60 hover:text-white transition-all group"
                        >
                          <span className="flex items-center gap-2 truncate pr-2 font-medium">
                            <span className="rounded-lg bg-indigo-950 px-1.5 py-0.5 text-[9px] font-bold font-mono text-cyan-300 border border-indigo-800/40">
                              {res.type}
                            </span>
                            <span className="truncate">{res.title}</span>
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Learning Notes Area */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                      <span>Architectural Scratchpad</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Synced to cloud</span>
                    </div>
                    <textarea
                      value={nodeNote}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      placeholder="Record your breakthroughs, key algorithms, or questions here..."
                      rows={3}
                      className="w-full rounded-2xl bg-[#030611] border border-indigo-950/80 p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none font-mono"
                    />
                  </div>
                </div>

                {/* Drawer Bottom Actions */}
                <div className="pt-6 border-t border-indigo-950/80 mt-6 flex items-center gap-3">
                  <Link
                    href="/problems"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-2.5 px-4 text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/25"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Practice Associated Problems</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* DAILY QUESTS MODAL */}
      {showQuestsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#0a0f29] rounded-3xl border border-indigo-900/80 shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Daily Engineering Quests
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                  <span>Earn Engineering XP</span>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complete daily habits to accelerate your path to Grandmaster Fellow.
                </p>
              </div>
              <button
                onClick={() => setShowQuestsModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-indigo-950/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {DAILY_QUESTS.map((q) => {
                const isClaimed = claimedQuests.has(q.id);
                return (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0f163b] border border-indigo-900/60 shadow-inner"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{q.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{q.title}</div>
                        <div className="text-[11px] text-slate-400">{q.desc}</div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      disabled={isClaimed}
                      onClick={() => {
                        setClaimedQuests((prev) => {
                          const next = new Set(prev);
                          next.add(q.id);
                          try {
                            localStorage.setItem("studynest_claimed_quests", JSON.stringify(Array.from(next)));
                          } catch {}
                          return next;
                        });
                        awardXp(q.xp, `Quest Completed!`);
                      }}
                      className={`text-xs font-bold rounded-xl ${
                        isClaimed
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                          : "bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-md shadow-amber-500/20"
                      }`}
                    >
                      {isClaimed ? "Claimed" : `+${q.xp} XP`}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuestsModal(false)}
                className="border-indigo-900 text-slate-300 hover:bg-indigo-950 text-xs font-bold rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS MODAL */}
      {showAchievementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0a0f29] rounded-3xl border border-indigo-900/80 shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  Career Milestones
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span>Engineering Trophies</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Permanent milestones unlocked on your verified candidate ledger.
                </p>
              </div>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-indigo-950/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {ACHIEVEMENTS.map((a) => {
                const isUnlocked = unlockedAchievements.has(a.id);
                return (
                  <div
                    key={a.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? "bg-[#111842] border-indigo-700/80 shadow-lg shadow-indigo-500/10"
                        : "bg-[#0c1028]/60 border-indigo-950/50 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{a.title}</span>
                          {isUnlocked && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{a.desc}</div>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-indigo-900/40 flex items-center justify-between text-[10px] font-mono">
                      <span className={isUnlocked ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        {isUnlocked ? "Unlocked" : "Locked"}
                      </span>
                      <span className="text-amber-400 font-bold">+{a.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAchievementsModal(false)}
                className="border-indigo-900 text-slate-300 hover:bg-indigo-950 text-xs font-bold rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT SKILL TREE ARTIFACT MODAL (Obsidian Dark Theme) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0a0f29] rounded-3xl border border-indigo-900/80 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Visual Resume Artifact
                </span>
                <h3 className="text-xl font-black text-white mt-1.5">
                  Export Your Skill Tree
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Embed your verified technical milestones directly into your GitHub profile <code className="bg-indigo-950 px-1 py-0.5 rounded text-[11px] text-cyan-300">README.md</code> or portfolio.
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-indigo-950/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Active Track Progress Card */}
            <div className="rounded-2xl border border-indigo-900/60 bg-[#0e1438] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{activeTrack.title}</span>
                <span className="font-mono font-bold text-cyan-300">
                  {progressCount}/{activeTrack.nodes.length} Nodes Mastered
                </span>
              </div>
              <div className="w-full bg-[#101533] rounded-full h-2 overflow-hidden border border-indigo-900/40">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Candidate Rank: <span className="text-amber-400 font-bold">{currentRank.name} ({userXp} XP)</span> • Synced to PostgreSQL.
              </p>
            </div>

            {/* Export Actions */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  onClick={downloadSkillTreeSvg}
                  className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 gap-1.5 h-10 border border-indigo-400/30"
                >
                  <Download className="h-4 w-4" />
                  <span>Download SVG Tree</span>
                </Button>
                <Button
                  onClick={downloadSkillTreePng}
                  variant="outline"
                  className="border-indigo-900/80 bg-[#101533] text-slate-200 hover:bg-[#161d47] font-bold text-xs rounded-xl gap-1.5 h-10"
                >
                  <Download className="h-4 w-4 text-cyan-400" />
                  <span>Download PNG (2x Res)</span>
                </Button>
              </div>

              {/* GitHub README Badge Snippet */}
              <div className="rounded-2xl border border-indigo-900/60 bg-[#0e1438] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5 text-cyan-400" />
                    <span>GitHub README Markdown Badge</span>
                  </span>
                  <button
                    onClick={copyBadgeMarkdown}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedBadge ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedBadge ? "Copied!" : "Copy Markdown"}</span>
                  </button>
                </div>
                <pre className="rounded-xl bg-[#030611] text-cyan-300 p-2.5 text-[11px] font-mono overflow-x-auto select-all border border-indigo-950">
                  <code>{`[![StudyNest Verified Skill Tree](https://img.shields.io/badge/StudyNest-Skills%20Verified-4f46e5?style=for-the-badge&logo=codeforces&logoColor=white)](https://study.rolenest.in/canvas)`}</code>
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(false)}
                className="border-indigo-900 text-slate-300 hover:bg-indigo-950 text-xs font-bold rounded-xl"
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

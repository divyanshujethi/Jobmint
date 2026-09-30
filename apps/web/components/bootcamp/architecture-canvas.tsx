"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Server,
  Database,
  Globe,
  Shield,
  Layers,
  Activity,
  Cpu,
  Radio,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addPlayerXp, triggerConfetti } from "@/lib/game-engine";

export interface CanvasNode {
  id: string;
  name: string;
  category: "entry" | "gateway" | "compute" | "storage" | "queue";
  iconName: string;
  x: number;
  y: number;
  status: "idle" | "simulating" | "passed" | "error";
  description: string;
}

export interface CanvasConnection {
  id: string;
  from: string;
  to: string;
}

interface ArchitectureCanvasProps {
  dayNumber: number;
  trackTitle: string;
  subdomain: string;
  onArchitectureVerified?: () => void;
}

const DEFAULT_NODES: CanvasNode[] = [
  {
    id: "client",
    name: "Web / Mobile Client",
    category: "entry",
    iconName: "Globe",
    x: 40,
    y: 120,
    status: "idle",
    description: "Generates incoming HTTPS requests & API traffic.",
  },
  {
    id: "proxy",
    name: "Nginx / Edge Gateway",
    category: "gateway",
    iconName: "Shield",
    x: 260,
    y: 70,
    status: "idle",
    description: "Reverse proxy, TLS termination & SSL certificate handling.",
  },
  {
    id: "ratelimit",
    name: "Rate Limiter (Redis)",
    category: "gateway",
    iconName: "Activity",
    x: 260,
    y: 220,
    status: "idle",
    description: "Token-bucket algorithmic filter against DDoS & abusive clients.",
  },
  {
    id: "service",
    name: "Backend Application Service",
    category: "compute",
    iconName: "Cpu",
    x: 520,
    y: 120,
    status: "idle",
    description: "Executes business logic, input validation, and ORM operations.",
  },
  {
    id: "cache",
    name: "Redis Cache Layer",
    category: "storage",
    iconName: "Layers",
    x: 760,
    y: 60,
    status: "idle",
    description: "Sub-millisecond in-memory cache for hot reads & active sessions.",
  },
  {
    id: "database",
    name: "PostgreSQL Primary ACID DB",
    category: "storage",
    iconName: "Database",
    x: 760,
    y: 210,
    status: "idle",
    description: "Persistent transactional database with WAL replication.",
  },
];

const DEFAULT_CONNECTIONS: CanvasConnection[] = [
  { id: "c1", from: "client", to: "proxy" },
  { id: "c2", from: "proxy", to: "service" },
];

export function ArchitectureCanvas({
  dayNumber,
  trackTitle,
  subdomain,
  onArchitectureVerified,
}: ArchitectureCanvasProps) {
  const [nodes, setNodes] = useState<CanvasNode[]>(DEFAULT_NODES);
  const [connections, setConnections] = useState<CanvasConnection[]>(DEFAULT_CONNECTIONS);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<{
    success: boolean;
    rps: number;
    latency: number;
    errors: string[];
  } | null>(null);

  // Dragging support
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Helper to get icon
  const renderNodeIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return <Globe className="h-5 w-5 text-sky-400" />;
      case "Shield":
        return <Shield className="h-5 w-5 text-indigo-400" />;
      case "Activity":
        return <Activity className="h-5 w-5 text-amber-400" />;
      case "Cpu":
        return <Cpu className="h-5 w-5 text-emerald-400" />;
      case "Layers":
        return <Layers className="h-5 w-5 text-purple-400" />;
      case "Database":
        return <Database className="h-5 w-5 text-rose-400" />;
      default:
        return <Server className="h-5 w-5 text-teal-400" />;
    }
  };

  // Node connection handler
  const handleNodeClick = (nodeId: string) => {
    if (simulating) return;

    if (!selectedSource) {
      setSelectedSource(nodeId);
    } else {
      if (selectedSource === nodeId) {
        setSelectedSource(null);
        return;
      }

      // Check if connection already exists
      const exists = connections.some(
        (c) =>
          (c.from === selectedSource && c.to === nodeId) ||
          (c.from === nodeId && c.to === selectedSource)
      );

      if (!exists) {
        setConnections((prev) => [
          ...prev,
          {
            id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            from: selectedSource,
            to: nodeId,
          },
        ]);
        setSimulationResult(null);
      }
      setSelectedSource(null);
    }
  };

  const handleRemoveConnection = (connId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
    setSimulationResult(null);
  };

  // Mouse handlers for dragging nodes
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (simulating) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(rect.width - 180, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(10, Math.min(rect.height - 110, e.clientY - rect.top - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Run Architecture Simulation
  const handleRunSimulation = () => {
    setSimulating(true);
    setSimulationLog(["[00.00s] Initializing Traffic Engine: 2,500 Virtual Clients..."]);
    setSimulationResult(null);

    // Check architecture topology rules
    const hasClientToGateway = connections.some(
      (c) =>
        (c.from === "client" && (c.to === "proxy" || c.to === "service" || c.to === "ratelimit")) ||
        ((c.from === "proxy" || c.from === "service") && c.to === "client")
    );

    const hasService = connections.some((c) => c.from === "service" || c.to === "service");

    const hasStorage = connections.some(
      (c) =>
        (c.from === "service" && (c.to === "database" || c.to === "cache")) ||
        ((c.from === "database" || c.from === "cache") && c.to === "service")
    );

    const hasRateLimiter = connections.some(
      (c) => c.from === "ratelimit" || c.to === "ratelimit"
    );

    setTimeout(() => {
      setSimulationLog((prev) => [
        ...prev,
        "[00.45s] HTTP/3 TLS handshake established over Edge Gateway.",
      ]);
    }, 450);

    setTimeout(() => {
      setSimulationLog((prev) => [
        ...prev,
        "[00.90s] Routing 2,500 req/sec through connection mesh...",
      ]);
    }, 900);

    setTimeout(() => {
      const errors: string[] = [];
      if (!hasClientToGateway) {
        errors.push("Missing Ingress Route: Client is not connected to Gateway or Service.");
      }
      if (!hasService) {
        errors.push("Missing Compute: Application Service is not wired into the pipeline.");
      }
      if (!hasStorage) {
        errors.push("Data Loss Warning: Backend Service has no database or cache connected.");
      }

      const passed = errors.length === 0;

      if (passed) {
        setSimulationLog((prev) => [
          ...prev,
          "[01.40s] Database connection pool healthy: 40 active connections.",
          hasRateLimiter
            ? "[01.70s] Rate Limiter active: 0 dropped packets, DDoS resilience OK."
            : "[01.70s] Notice: Consider connecting Redis Rate Limiter for DDoS hardening.",
          "[02.00s] Architecture Simulation Passed! 2,500 req/sec sustained with P99 < 16ms.",
        ]);
        setSimulationResult({
          success: true,
          rps: 2500,
          latency: hasRateLimiter ? 14 : 26,
          errors: [],
        });
        setNodes((prev) => prev.map((n) => ({ ...n, status: "passed" })));
        addPlayerXp(250);
        triggerConfetti();
        if (onArchitectureVerified) {
          onArchitectureVerified();
        }
      } else {
        setSimulationLog((prev) => [
          ...prev,
          `[01.50s] CRITICAL TOPOLOGY ERROR: ${errors[0]}`,
          "[02.00s] Simulation terminated with HTTP 502/504 pipeline failure.",
        ]);
        setSimulationResult({
          success: false,
          rps: 420,
          latency: 480,
          errors,
        });
        setNodes((prev) =>
          prev.map((n) =>
            errors.some((err) => err.toLowerCase().includes(n.id))
              ? { ...n, status: "error" }
              : n
          )
        );
      }
      setSimulating(false);
    }, 2000);
  };

  const handleReset = () => {
    setNodes(DEFAULT_NODES);
    setConnections(DEFAULT_CONNECTIONS);
    setSelectedSource(null);
    setSimulationResult(null);
    setSimulationLog([]);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl space-y-0">
      {/* CANVAS TOOLBAR */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 uppercase">
              Interactive Architecture Canvas
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Day {dayNumber} Pipeline Simulator
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Click any node then click another to wire them. Drag nodes to reposition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedSource && (
            <div className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs text-amber-300 flex items-center gap-1.5 animate-pulse">
              <span>Select target node to connect</span>
              <button
                onClick={() => setSelectedSource(null)}
                className="hover:text-white"
                title="Cancel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <Button
            onClick={handleReset}
            disabled={simulating}
            size="sm"
            variant="outline"
            className="h-8 rounded-lg border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>

          <Button
            onClick={handleRunSimulation}
            disabled={simulating}
            size="sm"
            className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
          >
            {simulating ? (
              <>
                <Activity className="h-3.5 w-3.5 animate-spin" />
                <span>Simulating Traffic...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Simulate &amp; Verify Pipeline</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* SVG WORKSPACE CANVAS */}
      <div
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[380px] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 overflow-hidden select-none cursor-crosshair"
      >
        {/* SVG WIRES LAYER */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {connections.map((conn) => {
            const sourceNode = nodes.find((n) => n.id === conn.from);
            const targetNode = nodes.find((n) => n.id === conn.to);
            if (!sourceNode || !targetNode) return null;

            // Compute center ports
            const x1 = sourceNode.x + 85;
            const y1 = sourceNode.y + 45;
            const x2 = targetNode.x + 85;
            const y2 = targetNode.y + 45;

            // Smooth cubic bezier
            const dx = Math.abs(x2 - x1) * 0.5;
            const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

            return (
              <g key={conn.id} className="group">
                {/* Background thick clickable path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.4)"
                  strokeWidth="3"
                  className="transition-all"
                />

                {/* Animated traffic packets when simulating */}
                {simulating && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    filter="url(#glow)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="100"
                      to="0"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  </path>
                )}

                {/* Connection center label */}
                <circle
                  cx={(x1 + x2) / 2}
                  cy={(y1 + y2) / 2}
                  r="7"
                  fill="#0f172a"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* INTERACTIVE NODES */}
        {nodes.map((node) => {
          const isSelected = selectedSource === node.id;
          const isBeingDragged = draggingNodeId === node.id;

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
              }}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
              onClick={() => handleNodeClick(node.id)}
              className={`absolute w-[180px] rounded-xl p-3 border cursor-pointer transition-shadow shadow-lg select-none ${
                isSelected
                  ? "border-amber-400 bg-amber-950/40 ring-2 ring-amber-400/50 shadow-amber-500/20"
                  : node.status === "passed"
                  ? "border-emerald-500 bg-slate-900/90 shadow-emerald-500/20"
                  : node.status === "error"
                  ? "border-red-500 bg-red-950/40 shadow-red-500/20"
                  : "border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900"
              } ${isBeingDragged ? "scale-105 z-20" : "z-10"}`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {renderNodeIcon(node.iconName)}
                  </div>
                  <span className="text-[11px] font-extrabold text-white leading-tight">
                    {node.name}
                  </span>
                </div>
              </div>

              <p className="text-[9px] text-slate-400 line-clamp-2 mt-1 leading-tight">
                {node.description}
              </p>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/80 text-[9px] font-mono">
                <span
                  className={
                    node.status === "passed"
                      ? "text-emerald-400 font-bold"
                      : node.status === "error"
                      ? "text-red-400 font-bold"
                      : isSelected
                      ? "text-amber-400 font-bold"
                      : "text-slate-500"
                  }
                >
                  {isSelected
                    ? "SOURCE SELECT"
                    : node.status === "passed"
                    ? "✓ HEALTHY"
                    : node.status === "error"
                    ? "⚠ BOTTLENECK"
                    : "ACTIVE NODE"}
                </span>

                <span className="text-slate-500 text-[8px] uppercase">
                  {connections.filter((c) => c.from === node.id || c.to === node.id).length} links
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIMULATION CONSOLE & METRICS */}
      <div className="border-t border-slate-800 bg-slate-900/90 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">
              Live Pipeline Telemetry &amp; Log
            </span>
          </div>

          {simulationResult && (
            <div className="flex items-center gap-3">
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                  simulationResult.success
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-red-500/20 text-red-300 border border-red-500/40"
                }`}
              >
                {simulationResult.success ? "VERIFIED (P99: 14ms)" : "PIPELINE FAILED"}
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Throughput: <strong className="text-white">{simulationResult.rps} req/s</strong>
              </span>
            </div>
          )}
        </div>

        {/* LOG TERMINAL */}
        <div className="rounded-xl bg-black/80 border border-slate-800/80 p-3 font-mono text-[11px] text-slate-300 space-y-1 max-h-[110px] overflow-y-auto">
          {simulationLog.length === 0 ? (
            <span className="text-slate-500 italic">
              Connect components above and click &quot;Simulate &amp; Verify Pipeline&quot; to test your Day {dayNumber} architecture.
            </span>
          ) : (
            simulationLog.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes("Passed")
                    ? "text-emerald-400 font-bold"
                    : log.includes("CRITICAL")
                    ? "text-red-400 font-bold"
                    : log.includes("Notice")
                    ? "text-amber-400"
                    : "text-slate-300"
                }
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

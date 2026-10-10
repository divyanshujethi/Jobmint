/**
 * RoleNest Interactive Gamification & Audio FX Engine
 * Pure browser-native Web Audio API & Canvas particle physics.
 * Zero external bundle bloat, 100% offline capable.
 */

export interface PlayerStats {
  xp: number;
  level: number;
  title: string;
  nextLevelXp: number;
  currentLevelBaseXp: number;
  progressPercent: number;
  streakDays: number;
  solvedChallengesCount: number;
}

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: "Level 1: Novice Cadet" },
  { level: 2, xp: 250, title: "Level 2: Terminal Crafter" },
  { level: 3, xp: 600, title: "Level 3: Algorithm Explorer" },
  { level: 4, xp: 1100, title: "Level 4: Full-Stack Builder" },
  { level: 5, xp: 1800, title: "Level 5: Systems Engineer" },
  { level: 6, xp: 2700, title: "Level 6: Security Specialist" },
  { level: 7, xp: 3800, title: "Level 7: Distributed Architect" },
  { level: 8, xp: 5200, title: "Level 8: Principal Vanguard" },
];

export function calculatePlayerStats(xp: number, streakDays: number = 1): PlayerStats {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || { level: currentLevel.level + 1, xp: currentLevel.xp + 1500, title: "Master Architect" };
    }
  }

  const span = nextLevel.xp - currentLevel.xp;
  const earnedInLevel = xp - currentLevel.xp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earnedInLevel / span) * 100)));

  return {
    xp,
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelXp: nextLevel.xp,
    currentLevelBaseXp: currentLevel.xp,
    progressPercent,
    streakDays,
    solvedChallengesCount: Math.floor(xp / 150),
  };
}

function getCrossDomainCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCrossDomainCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const isProd = typeof window !== "undefined" && window.location.hostname.endsWith("rolenest.in");
  const domainPart = isProd ? "; domain=.rolenest.in" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax${domainPart}`;
}

export function getStoredPlayerStats(): PlayerStats {
  if (typeof window === "undefined") {
    return calculatePlayerStats(0, 0);
  }
  try {
    // 1. Try cross-subdomain cookie first (.rolenest.in shared across study, problem, main)
    const cookieXp = getCrossDomainCookie("rolenest_game_xp");
    const cookieStreak = getCrossDomainCookie("rolenest_game_streak");

    // 2. Fallback to localStorage
    const localXp = localStorage.getItem("rolenest_game_xp");
    const localStreak = localStorage.getItem("rolenest_game_streak");

    const rawXp = parseInt(cookieXp || localXp || "0", 10);
    const rawStreak = parseInt(cookieStreak || localStreak || "0", 10);

    const safeXp = isNaN(rawXp) ? 0 : rawXp;
    const safeStreak = isNaN(rawStreak) ? 0 : rawStreak;

    return calculatePlayerStats(safeXp, safeStreak);
  } catch {
    return calculatePlayerStats(0, 0);
  }
}

export function addPlayerXp(amount: number): PlayerStats {
  if (typeof window === "undefined") return calculatePlayerStats(amount, 0);
  try {
    const current = getStoredPlayerStats();
    const newXp = current.xp + amount;
    
    // Save to both localStorage and cross-subdomain cookie
    localStorage.setItem("rolenest_game_xp", String(newXp));
    setCrossDomainCookie("rolenest_game_xp", String(newXp));
    
    // Check if level up occurred
    const prevStats = calculatePlayerStats(current.xp, current.streakDays);
    const nextStats = calculatePlayerStats(newXp, current.streakDays);
    if (nextStats.level > prevStats.level) {
      playLevelUpFanfare();
      triggerConfetti();
    } else {
      playSuccessChime();
    }
    return nextStats;
  } catch {
    return calculatePlayerStats(amount, 0);
  }
}

// -------------------------------------------------------------
// WEB AUDIO SYNTHESIZER (Retro 8-Bit Game Sound Effects)
// -------------------------------------------------------------

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * 8-Bit Coin Pickup / Correct Answer Chime
 */
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  } catch {}
}

/**
 * Level-Up Royal Fanfare Chime
 */
export function playLevelUpFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const chords = [
      { f: [440, 554.37, 659.25], t: 0.0, d: 0.15 },
      { f: [440, 554.37, 659.25], t: 0.16, d: 0.15 },
      { f: [440, 554.37, 659.25], t: 0.32, d: 0.15 },
      { f: [587.33, 739.99, 880.0], t: 0.50, d: 0.45 },
    ];

    chords.forEach((chord) => {
      chord.f.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + chord.t);

        gain.gain.setValueAtTime(0.0001, now + chord.t);
        gain.gain.exponentialRampToValueAtTime(0.12, now + chord.t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + chord.t + chord.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + chord.t);
        osc.stop(now + chord.t + chord.d);
      });
    });
  } catch {}
}

/**
 * Soft incorrect buzzer
 */
export function playWrongBuzzer() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {}
}

// -------------------------------------------------------------
// PURE CANVAS CONFETTI CANNON
// -------------------------------------------------------------

export function triggerConfetti() {
  if (typeof window === "undefined" || !document) return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
  const particles: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
  }> = [];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 - 50 + (Math.random() - 0.5) * 100,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.9) * 14,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
    });
  }

  const renderCtx = ctx;

  let frameCount = 0;
  function animate() {
    frameCount++;
    renderCtx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.vRot;

      renderCtx.save();
      renderCtx.translate(p.x, p.y);
      renderCtx.rotate((p.rotation * Math.PI) / 180);
      renderCtx.fillStyle = p.color;
      renderCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      renderCtx.restore();
    });

    if (frameCount < 120) {
      requestAnimationFrame(animate);
    } else {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  requestAnimationFrame(animate);
}

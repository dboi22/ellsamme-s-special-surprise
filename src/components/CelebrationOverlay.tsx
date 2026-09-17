import { useEffect, useRef, useState } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  tilt: number;
  tiltSpeed: number;
  shape: "rect" | "circle" | "heart" | "star";
  alpha: number;
  decay: number;
  gravity: number;
  drag: number;
}

interface FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
  exploded: boolean;
}

interface FireworkSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
  gravity: number;
  friction: number;
  shimmer: boolean;
  shimmerSpeed: number;
  shimmerPhase: number;
}

const CONFETTI_COLORS: readonly string[] = [
  "#FF6B9D", // Girly Hot Pink
  "#F472B6", // Soft Pink
  "#A855F7", // Lavender Purple
  "#C084FC", // Lilac
  "#FBBF24", // Golden Yellow
  "#F59E0B", // Amber Gold
  "#34D399", // Mint Emerald
  "#60A5FA", // Pastel Blue
  "#F43F5E", // Rose Red
  "#FFFFFF", // Sparkle White
];

const FIREWORK_PALETTES: readonly (readonly string[])[] = [
  ["#FF1493", "#FF69B4", "#FFB6C1", "#FFF0F5", "#FFD700"], // Pink & Gold
  ["#9333EA", "#C084FC", "#F472B6", "#FFFFFF", "#38BDF8"], // Cosmic Violet & Cyan
  ["#F59E0B", "#FBBF24", "#FDE68A", "#FFFFFF", "#FB923C"], // Golden Glitz
  ["#EC4899", "#F43F5E", "#FFA500", "#FF69B4", "#FFFFFF"], // Sunset Celebration
  ["#06B6D4", "#3B82F6", "#A855F7", "#EC4899", "#FDE047"], // Rainbow Royale
];

function getRandomItem<T>(items: readonly T[], fallback: T): T {
  const item = items[Math.floor(Math.random() * items.length)];
  return item !== undefined ? item : fallback;
}

export function CelebrationOverlay({
  enableFireworks = true,
  enableConfetti = true,
  durationMs = 5000,
}: {
  enableFireworks?: boolean;
  enableConfetti?: boolean;
  durationMs?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fadingOut, setFadingOut] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    const confettiList: ConfettiPiece[] = [];
    const rockets: FireworkRocket[] = [];
    const sparks: FireworkSpark[] = [];

    const startTime = performance.now();
    const spawnCutoff = Math.max(1000, durationMs - 1200);

    // Timers for fading and finish
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, Math.max(500, durationMs - 700));

    const finishTimer = setTimeout(() => {
      setIsFinished(true);
    }, durationMs);

    // Confetti Cannon Emitter from Bottom-Left and Bottom-Right
    const fireConfettiCannons = (count: number) => {
      if (!enableConfetti) return;

      const shapes: readonly ("rect" | "circle" | "heart" | "star")[] = [
        "rect",
        "rect",
        "circle",
        "heart",
        "star",
      ];

      for (let i = 0; i < count; i++) {
        const color = getRandomItem(CONFETTI_COLORS, "#F472B6");
        const shape = getRandomItem(shapes, "rect");

        // Left Cannon (Shoots Up-Right)
        const leftAngle = (Math.PI / 180) * (-60 + (Math.random() * 32 - 16));
        const leftSpeed = 16 + Math.random() * 18;
        confettiList.push({
          x: width * 0.04 + Math.random() * 30,
          y: height * 0.96,
          vx: Math.cos(leftAngle) * leftSpeed,
          vy: Math.sin(leftAngle) * leftSpeed,
          size: 7 + Math.random() * 8,
          color,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.25,
          wobble: Math.random() * 10,
          wobbleSpeed: 0.08 + Math.random() * 0.1,
          tilt: Math.random() * Math.PI,
          tiltSpeed: 0.05 + Math.random() * 0.08,
          shape,
          alpha: 1,
          decay: 0.0035 + Math.random() * 0.0045,
          gravity: 0.32 + Math.random() * 0.1,
          drag: 0.985,
        });

        // Right Cannon (Shoots Up-Left)
        const rightAngle = (Math.PI / 180) * (-120 + (Math.random() * 32 - 16));
        const rightSpeed = 16 + Math.random() * 18;
        confettiList.push({
          x: width * 0.96 - Math.random() * 30,
          y: height * 0.96,
          vx: Math.cos(rightAngle) * rightSpeed,
          vy: Math.sin(rightAngle) * rightSpeed,
          size: 7 + Math.random() * 8,
          color,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.25,
          wobble: Math.random() * 10,
          wobbleSpeed: 0.08 + Math.random() * 0.1,
          tilt: Math.random() * Math.PI,
          tiltSpeed: 0.05 + Math.random() * 0.08,
          shape,
          alpha: 1,
          decay: 0.0035 + Math.random() * 0.0045,
          gravity: 0.32 + Math.random() * 0.1,
          drag: 0.985,
        });
      }
    };

    // Fireworks Rocket Launcher
    const launchRocket = () => {
      if (!enableFireworks) return;
      const palette = getRandomItem(FIREWORK_PALETTES, FIREWORK_PALETTES[0]!);
      const headColor = getRandomItem(palette, "#FFFFFF");
      const startX = width * 0.12 + Math.random() * (width * 0.76);
      const targetY = height * 0.12 + Math.random() * (height * 0.35);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.25;
      const speed = 14 + Math.random() * 6;

      rockets.push({
        x: startX,
        y: height,
        targetY,
        vx: Math.cos(angle) * speed * 0.4,
        vy: Math.sin(angle) * speed,
        color: headColor,
        trail: [],
        exploded: false,
      });
    };

    // Fireworks Explosion Generator
    const explodeRocket = (x: number, y: number) => {
      const palette = getRandomItem(FIREWORK_PALETTES, FIREWORK_PALETTES[0]!);
      const sparkCount = 65 + Math.floor(Math.random() * 35);
      const isRing = Math.random() > 0.65;
      const baseSpeed = 4.5 + Math.random() * 4.5;

      for (let i = 0; i < sparkCount; i++) {
        let angle: number;
        let speed: number;

        if (isRing) {
          angle = (i / sparkCount) * Math.PI * 2;
          speed = baseSpeed * (0.85 + Math.random() * 0.3);
        } else {
          angle = Math.random() * Math.PI * 2;
          speed = Math.random() * baseSpeed + 1.2;
        }

        const color = getRandomItem(palette, "#FF69B4");

        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          size: 2.5 + Math.random() * 2.5,
          decay: 0.014 + Math.random() * 0.016,
          gravity: 0.12 + Math.random() * 0.06,
          friction: 0.965,
          shimmer: Math.random() > 0.4,
          shimmerSpeed: 0.2 + Math.random() * 0.3,
          shimmerPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Initial Grand Cannon Blast
    fireConfettiCannons(70);
    launchRocket();
    setTimeout(() => launchRocket(), 280);
    setTimeout(() => launchRocket(), 600);

    // Recurring Timers
    let confettiTimer = 0;
    let fireworkTimer = 0;

    const render = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= durationMs) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // --- 1. UPDATE & DRAW FIREWORKS ROCKETS ---
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        if (!r) continue;

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.18; // slight gravity

        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 8) r.trail.shift();

        // Draw rocket trail
        ctx.save();
        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          if (!pt) continue;
          pt.alpha *= 0.85;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.globalAlpha = pt.alpha * 0.7;
          ctx.fill();
        }
        ctx.restore();

        // Draw rocket head
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

        // Detonate condition
        if (r.y <= r.targetY || r.vy >= -1) {
          explodeRocket(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      // --- 2. UPDATE & DRAW FIREWORK SPARKS ---
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        if (!s) continue;

        s.x += s.vx;
        s.y += s.vy;
        s.vx *= s.friction;
        s.vy *= s.friction;
        s.vy += s.gravity;
        s.alpha -= s.decay;

        if (s.shimmer) {
          s.shimmerPhase += s.shimmerSpeed;
        }

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        const displayAlpha = s.shimmer
          ? Math.max(0, s.alpha * (0.6 + 0.4 * Math.sin(s.shimmerPhase)))
          : s.alpha;

        ctx.globalAlpha = displayAlpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- 3. UPDATE & DRAW CONFETTI ---
      for (let i = confettiList.length - 1; i >= 0; i--) {
        const c = confettiList[i];
        if (!c) continue;

        c.x += c.vx;
        c.y += c.vy;
        c.vx *= c.drag;
        c.vy *= c.drag;
        c.vy += c.gravity;
        c.rotation += c.rotationSpeed;
        c.wobble += c.wobbleSpeed;
        c.tilt += c.tiltSpeed;
        c.alpha -= c.decay;

        // Slight wind flutter
        c.x += Math.sin(c.wobble) * 0.8;

        if (c.alpha <= 0 || c.y > height + 40) {
          confettiList.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.globalAlpha = Math.max(0, c.alpha);
        ctx.fillStyle = c.color;

        const w = c.size * Math.cos(c.tilt);
        const h = c.size;

        if (c.shape === "rect") {
          ctx.fillRect(-w / 2, -h / 2, w, h * 1.5);
        } else if (c.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, Math.abs(w) / 2 + 1, 0, Math.PI * 2);
          ctx.fill();
        } else if (c.shape === "heart") {
          const s = Math.abs(w) * 0.7 + 3;
          ctx.beginPath();
          ctx.moveTo(0, s / 4);
          ctx.bezierCurveTo(0, 0, -s / 2, -s / 2, -s / 2, s / 4);
          ctx.bezierCurveTo(-s / 2, s * 0.7, 0, s * 0.9, 0, s * 1.2);
          ctx.bezierCurveTo(0, s * 0.9, s / 2, s * 0.7, s / 2, s / 4);
          ctx.bezierCurveTo(s / 2, -s / 2, 0, 0, 0, s / 4);
          ctx.fill();
        } else if (c.shape === "star") {
          const r = Math.abs(w) * 0.7 + 3;
          ctx.beginPath();
          for (let p = 0; p < 5; p++) {
            ctx.lineTo(
              Math.cos(((18 + p * 72) * Math.PI) / 180) * r,
              -Math.sin(((18 + p * 72) * Math.PI) / 180) * r
            );
            ctx.lineTo(
              Math.cos(((54 + p * 72) * Math.PI) / 180) * (r / 2),
              -Math.sin(((54 + p * 72) * Math.PI) / 180) * (r / 2)
            );
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      // --- 4. PERIODIC CANNON VOLLEYS & ROCKETS (ONLY BEFORE CUTOFF) ---
      if (elapsed < spawnCutoff) {
        confettiTimer++;
        if (confettiTimer % 35 === 0 && confettiList.length < 300) {
          fireConfettiCannons(12);
        }

        fireworkTimer++;
        if (fireworkTimer % 45 === 0 && rockets.length < 4) {
          launchRocket();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [enableFireworks, enableConfetti, durationMs]);

  if (isFinished) return null;

  return (
    <canvas
      ref={canvasRef}
      className="celebration-canvas-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 25,
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 0.7s ease-out",
      }}
    />
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  hue: number;
};

type Props = {
  className?: string;
  density?: number;
  linkDistance?: number;
  colorA?: string;
  colorB?: string;
};

export function ParticleField({
  className,
  density = 70,
  linkDistance = 140,
  colorA = "165,180,252",
  colorB = "192,132,252",
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      const area = width * height;
      const target = Math.min(
        140,
        Math.max(30, Math.round((area / 12000) * (density / 70))),
      );

      particles = new Array(target).fill(0).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18 * dpr,
        vy: (Math.random() - 0.5) * 0.18 * dpr,
        r: (Math.random() * 1.4 + 0.4) * dpr,
        a: Math.random() * 0.5 + 0.25,
        hue: Math.random(),
      }));
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    const linkDist = linkDistance * dpr;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < 120 * dpr && distM > 0) {
          const push = (120 * dpr - distM) / (120 * dpr);
          p.vx += (dxm / distM) * push * 0.05;
          p.vy += (dym / distM) * push * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy *= 0.985;

        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > canvas.width) {
          p.x = canvas.width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > canvas.height) {
          p.y = canvas.height;
          p.vy *= -1;
        }

        if (p.vx * p.vx + p.vy * p.vy < 0.0004) {
          p.vx += (Math.random() - 0.5) * 0.04 * dpr;
          p.vy += (Math.random() - 0.5) * 0.04 * dpr;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p = particles[i];
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.18;
            const color = (p.hue + q.hue) / 2 > 0.5 ? colorB : colorA;
            ctx.strokeStyle = `rgba(${color},${alpha})`;
            ctx.lineWidth = 0.6 * dpr;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const color = p.hue > 0.5 ? colorB : colorA;
        ctx.fillStyle = `rgba(${color},${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    if (prefersReducedMotion) {
      render();
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, linkDistance, colorA, colorB]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}

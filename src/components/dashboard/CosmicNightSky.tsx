"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  isBright?: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  trailLength: number;
  active: boolean;
}

export default function CosmicNightSky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Realistic stellar spectral colors:
    // O/B: Blue-White, A: Pure White, F/G: Warm White/Gold, K/M: Soft Amber
    const starColors = [
      "rgba(255, 255, 255,", // Pure White (A-type)
      "rgba(225, 238, 255,", // Blue-White (B-type)
      "rgba(255, 245, 220,", // Warm Solar White (G-type)
      "rgba(245, 230, 195,", // Cosmo Gold (#FFF3CF tint)
      "rgba(255, 225, 185,", // Soft Amber (K-type)
      "rgba(195, 220, 255,", // Deep Blue (O-type)
    ];

    // Generate stars
    const starCount = Math.floor((width * height) / 3200); // Responsive density
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const isBright = Math.random() < 0.04; // 4% are prominent luminous stars
      const colorPrefix = starColors[Math.floor(Math.random() * starColors.length)];
      const baseAlpha = isBright ? 0.75 + Math.random() * 0.25 : 0.2 + Math.random() * 0.6;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isBright ? 1.4 + Math.random() * 1.1 : 0.4 + Math.random() * 0.9,
        alpha: baseAlpha,
        baseAlpha,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
        color: colorPrefix,
        isBright,
      });
    }

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = Date.now();
    let nextShootingStarDelay = 3500 + Math.random() * 4000;

    const createShootingStar = () => {
      // Spawn from top or right corner angling downwards
      const angle = (Math.PI / 180) * (135 + (Math.random() * 30 - 15)); // ~135 degrees diagonal
      const startX = Math.random() * width * 1.2;
      const startY = Math.random() * (height * 0.4);

      shootingStars.push({
        x: startX,
        y: startY,
        length: 80 + Math.random() * 90,
        speed: 16 + Math.random() * 12,
        angle,
        alpha: 1,
        trailLength: 0.8,
        active: true,
      });
    };

    // Parallax mouse position
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 20;
      targetMouseY = (e.clientY / height - 0.5) * 20;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Main render loop
    const render = () => {
      // Smooth parallax lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle update
        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = Math.sin(star.twinklePhase);
        star.alpha = star.baseAlpha + twinkleFactor * 0.35;
        const clampedAlpha = Math.max(0.1, Math.min(1, star.alpha));

        const posX = star.x + currentMouseX * (star.radius * 0.3);
        const posY = star.y + currentMouseY * (star.radius * 0.3);

        // Bright stars have subtle glow and diffraction spikes
        if (star.isBright) {
          // Subtle outer corona
          const coronaGrad = ctx.createRadialGradient(
            posX, posY, 0,
            posX, posY, star.radius * 4.5
          );
          coronaGrad.addColorStop(0, `${star.color}${clampedAlpha * 0.5})`);
          coronaGrad.addColorStop(1, `${star.color}0)`);
          ctx.fillStyle = coronaGrad;
          ctx.beginPath();
          ctx.arc(posX, posY, star.radius * 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Delicate 4-point micro cross spike
          ctx.strokeStyle = `${star.color}${clampedAlpha * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(posX - star.radius * 3.5, posY);
          ctx.lineTo(posX + star.radius * 3.5, posY);
          ctx.moveTo(posX, posY - star.radius * 3.5);
          ctx.lineTo(posX, posY + star.radius * 3.5);
          ctx.stroke();
        }

        // Star core
        ctx.fillStyle = `${star.color}${clampedAlpha})`;
        ctx.beginPath();
        ctx.arc(posX, posY, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Check for new shooting star
      const now = Date.now();
      if (now - lastShootingStarTime > nextShootingStarDelay) {
        createShootingStar();
        lastShootingStarTime = now;
        nextShootingStarDelay = 4000 + Math.random() * 6000;
      }

      // Render Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const meteor = shootingStars[i];

        const cosA = Math.cos(meteor.angle);
        const sinA = Math.sin(meteor.angle);

        meteor.x += cosA * meteor.speed;
        meteor.y += sinA * meteor.speed;
        meteor.alpha -= 0.016;

        if (meteor.alpha <= 0 || meteor.x < -100 || meteor.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = meteor.x - cosA * meteor.length;
        const tailY = meteor.y - sinA * meteor.length;

        const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${meteor.alpha})`);
        grad.addColorStop(0.3, `rgba(245, 230, 195, ${meteor.alpha * 0.8})`);
        grad.addColorStop(0.7, `rgba(147, 197, 253, ${meteor.alpha * 0.4})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Glowing head of meteor
        ctx.fillStyle = `rgba(255, 255, 255, ${meteor.alpha})`;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#02040a]">
      {/* ==================== REALISTIC MILKY WAY & NEBULA DUST CLOUDS ==================== */}
      {/* Deep Space Base Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 120% 90% at 50% -10%, #060b1e 0%, #02040a 65%, #000104 100%)",
        }}
      />

      {/* Galactic Plane Milky Way Core Dust Lane (Diagonal ethereal haze) */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background: `
            radial-gradient(ellipse 65% 35% at 35% 25%, rgba(65, 45, 120, 0.28) 0%, transparent 70%),
            radial-gradient(ellipse 75% 45% at 75% 65%, rgba(20, 50, 95, 0.24) 0%, transparent 70%),
            radial-gradient(circle 450px at 50% 45%, rgba(90, 55, 130, 0.16) 0%, transparent 75%),
            radial-gradient(circle 350px at 20% 80%, rgba(15, 60, 90, 0.2) 0%, transparent 70%)
          `,
          filter: "blur(40px)",
        }}
      />

      {/* Ethereal Starlight Nebula Sheen */}
      <div 
        className="absolute inset-0 opacity-25 mix-blend-screen"
        style={{
          background: `
            conic-gradient(from 220deg at 60% 40%, 
              rgba(30, 58, 138, 0.18) 0deg, 
              rgba(88, 28, 135, 0.22) 70deg, 
              rgba(15, 23, 42, 0) 180deg, 
              rgba(49, 46, 129, 0.2) 280deg, 
              rgba(30, 58, 138, 0.18) 360deg
            )
          `,
          filter: "blur(60px)",
        }}
      />

      {/* Canvas for Realistic Stars, Twinkling, and Meteors */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Subtle Bottom Ambient Dark Ground Horizon Occlusion */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #000206 0%, rgba(1, 3, 10, 0.6) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}


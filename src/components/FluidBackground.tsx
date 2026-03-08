import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const FluidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  const colors = ['#ffc0cb', '#ffb6c1', '#fff0f5', '#ffe4e1', '#ff69b4'];

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(25, Math.floor((width * height) / 40000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 80 + 40,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 === 0) {
        ctx.fillStyle = '#ffe4e1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle, i) => {
          // Only process mouse interaction for every 3rd particle
          if (i % 3 === 0) {
            const dx = mouseRef.current.x - particle.x;
            const dy = mouseRef.current.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
              const force = (150 - dist) / 150;
              particle.vx -= (dx / dist) * force * 0.02;
              particle.vy -= (dy / dist) * force * 0.02;
            }
          }

          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Damping
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // Boundary wrap
          if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
          if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
          if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
          if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;

          // Draw gradient blob
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius
          );
          gradient.addColorStop(0, particle.color + '60');
          gradient.addColorStop(0.5, particle.color + '30');
          gradient.addColorStop(1, particle.color + '00');

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        });

        // Draw connections (limited)
        ctx.strokeStyle = '#ffc0cb15';
        ctx.lineWidth = 1;
        for (let i = 0; i < particlesRef.current.length; i += 2) {
          for (let j = i + 2; j < particlesRef.current.length; j += 2) {
            const dx = particlesRef.current[i].x - particlesRef.current[j].x;
            const dy = particlesRef.current[i].y - particlesRef.current[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
              ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(180deg, #ffe4e1 0%, #fff0f5 100%)' }}
    />
  );
};

export default FluidBackground;

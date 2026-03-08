import { useEffect, useRef, useCallback } from 'react';

interface Petal {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swaySpeed: number;
  swayAmount: number;
  size: number;
  color: string;
  opacity: number;
}

interface FallingPetalsProps {
  active: boolean;
}

const FallingPetals = ({ active }: FallingPetalsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animationRef = useRef<number | null>(null);
  const isActiveRef = useRef(active);

  const colors = ['#ffc0cb', '#ffb6c1', '#ff69b4', '#ff1493', '#ffe4e1'];

  const createPetal = useCallback((canvasWidth: number): Petal => ({
    x: Math.random() * canvasWidth,
    y: -30,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    fallSpeed: Math.random() * 1.5 + 0.5,
    swaySpeed: Math.random() * 0.02 + 0.01,
    swayAmount: Math.random() * 30 + 20,
    size: Math.random() * 15 + 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.4 + 0.3,
  }), []);

  useEffect(() => {
    isActiveRef.current = active;
    
    if (!active) {
      petalsRef.current = [];
    }
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      
      // Render at 30fps for performance
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isActiveRef.current) {
          // Add new petals occasionally
          if (Math.random() < 0.03 && petalsRef.current.length < 30) {
            petalsRef.current.push(createPetal(canvas.width));
          }
        }

        // Update and draw petals
        petalsRef.current = petalsRef.current.filter((petal) => {
          // Update position
          petal.y += petal.fallSpeed;
          petal.rotation += petal.rotationSpeed;
          petal.x += Math.sin(petal.y * petal.swaySpeed) * 0.5;

          // Draw petal
          ctx.save();
          ctx.translate(petal.x, petal.y);
          ctx.rotate((petal.rotation * Math.PI) / 180);
          ctx.globalAlpha = petal.opacity;
          
          // Draw heart-shaped petal
          ctx.fillStyle = petal.color;
          ctx.beginPath();
          const s = petal.size;
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
          ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
          ctx.fill();
          
          ctx.restore();

          // Keep petal if still on screen
          return petal.y < canvas.height + 30;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createPetal]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export default FallingPetals;

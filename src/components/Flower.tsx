import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FlowerProps {
  isGrowing: boolean;
}

const Flower = ({ isGrowing }: FlowerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stemRef = useRef<SVGPathElement>(null);
  const petalsGroupRef = useRef<SVGGElement>(null);
  const leavesGroupRef = useRef<SVGGElement>(null);
  const centerRef = useRef<SVGCircleElement>(null);
  const [growthStage, setGrowthStage] = useState(0);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!isGrowing) return;

    const ctx = gsap.context(() => {
      // Stage 1: Draw stem
      if (stemRef.current) {
        const length = stemRef.current.getTotalLength();
        gsap.set(stemRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        
        gsap.to(stemRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          onComplete: () => setGrowthStage(1),
        });
      }

      // Stage 2: Grow leaves
      if (leavesGroupRef.current) {
        const leaves = leavesGroupRef.current.querySelectorAll('.leaf');
        gsap.fromTo(leaves,
          { scale: 0, transformOrigin: 'center bottom' },
          {
            scale: 1,
            duration: 1,
            stagger: 0.3,
            ease: 'back.out(1.7)',
            delay: 1,
            onComplete: () => setGrowthStage(2),
          }
        );
      }

      // Stage 3: Bloom petals
      if (petalsGroupRef.current) {
        const petals = petalsGroupRef.current.querySelectorAll('.petal');
        gsap.fromTo(petals,
          { scale: 0, rotation: -45, transformOrigin: 'center bottom', opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.5,
            stagger: {
              each: 0.15,
              from: 'center',
            },
            ease: 'elastic.out(1, 0.5)',
            delay: 2,
            onComplete: () => setGrowthStage(3),
          }
        );
      }

      // Stage 4: Center appears
      if (centerRef.current) {
        gsap.fromTo(centerRef.current,
          { scale: 0, transformOrigin: 'center' },
          {
            scale: 1,
            duration: 0.8,
            ease: 'back.out(2)',
            delay: 3.5,
          }
        );
      }

      // Continuous sway animation
      gsap.to(containerRef.current, {
        rotation: 2,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'bottom center',
      });

      // Scroll-triggered milestones
      const milestone1 = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to('.flower-milestone[data-milestone="1"]', {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          });
        },
      });
      triggersRef.current.push(milestone1);

      const milestone2 = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 50%',
        onEnter: () => {
          gsap.to('.flower-milestone[data-milestone="2"]', {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          });
        },
      });
      triggersRef.current.push(milestone2);

      const milestone3 = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 20%',
        onEnter: () => {
          gsap.to('.flower-milestone[data-milestone="3"]', {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          });
        },
      });
      triggersRef.current.push(milestone3);
    }, containerRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, [isGrowing]);

  // Interactive petal hover
  const handlePetalHover = (e: React.MouseEvent<SVGPathElement>) => {
    const petal = e.currentTarget;
    gsap.to(petal, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handlePetalLeave = (e: React.MouseEvent<SVGPathElement>) => {
    const petal = e.currentTarget;
    gsap.to(petal, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg h-[600px] md:h-[800px]">
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Petal gradient */}
          <radialGradient id="petalGradient1" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#ff69b4" />
            <stop offset="50%" stopColor="#ffc0cb" />
            <stop offset="100%" stopColor="#ffb6c1" />
          </radialGradient>
          
          <radialGradient id="petalGradient2" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#ff1493" />
            <stop offset="50%" stopColor="#ff69b4" />
            <stop offset="100%" stopColor="#ffc0cb" />
          </radialGradient>

          {/* Leaf gradient */}
          <linearGradient id="leafGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#228b22" />
            <stop offset="100%" stopColor="#90ee90" />
          </linearGradient>

          {/* Center gradient */}
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#ff8c00" />
          </radialGradient>

          {/* Filter for soft glow */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stem */}
        <path
          ref={stemRef}
          d="M200,600 Q200,500 195,400 Q190,300 200,200"
          fill="none"
          stroke="url(#leafGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Leaves */}
        <g ref={leavesGroupRef}>
          {/* Left leaf */}
          <path
            className="leaf"
            d="M200,450 Q150,430 120,400 Q100,380 110,360 Q130,370 160,390 Q190,410 200,430"
            fill="url(#leafGradient)"
            stroke="#228b22"
            strokeWidth="1"
            opacity="0"
          />
          <path
            className="leaf"
            d="M130,385 Q140,375 150,380"
            fill="none"
            stroke="#90ee90"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Right leaf */}
          <path
            className="leaf"
            d="M200,380 Q250,360 280,330 Q300,310 290,290 Q270,300 240,320 Q210,340 200,360"
            fill="url(#leafGradient)"
            stroke="#228b22"
            strokeWidth="1"
            opacity="0"
          />
          <path
            className="leaf"
            d="M270,315 Q260,305 250,310"
            fill="none"
            stroke="#90ee90"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Small bud */}
          <ellipse
            className="leaf"
            cx="180"
            cy="320"
            rx="8"
            ry="12"
            fill="#90ee90"
            stroke="#228b22"
            strokeWidth="1"
            opacity="0"
          />
        </g>

        {/* Petals - arranged in a heart shape */}
        <g ref={petalsGroupRef} filter="url(#glow)">
          {/* Back layer petals */}
          <path
            className="petal"
            d="M200,200 Q160,140 140,100 Q130,70 150,60 Q170,55 190,90 Q200,120 200,150"
            fill="url(#petalGradient2)"
            onMouseEnter={handlePetalHover}
            onMouseLeave={handlePetalLeave}
            style={{ cursor: 'pointer' }}
          />
          <path
            className="petal"
            d="M200,200 Q240,140 260,100 Q270,70 250,60 Q230,55 210,90 Q200,120 200,150"
            fill="url(#petalGradient2)"
            onMouseEnter={handlePetalHover}
            onMouseLeave={handlePetalLeave}
            style={{ cursor: 'pointer' }}
          />

          {/* Middle layer petals */}
          <path
            className="petal"
            d="M200,200 Q150,160 120,130 Q100,110 110,90 Q125,75 150,95 Q180,120 195,160"
            fill="url(#petalGradient1)"
            onMouseEnter={handlePetalHover}
            onMouseLeave={handlePetalLeave}
            style={{ cursor: 'pointer' }}
          />
          <path
            className="petal"
            d="M200,200 Q250,160 280,130 Q300,110 290,90 Q275,75 250,95 Q220,120 205,160"
            fill="url(#petalGradient1)"
            onMouseEnter={handlePetalHover}
            onMouseLeave={handlePetalLeave}
            style={{ cursor: 'pointer' }}
          />

          {/* Front layer - heart center */}
          <path
            className="petal"
            d="M200,180 Q170,150 150,130 Q140,115 155,105 Q170,100 185,115 Q195,130 200,145"
            fill="#ffb6c1"
            stroke="#ff69b4"
            strokeWidth="1"
            onMouseEnter={handlePetalHover}
            onMouseLeave={handlePetalLeave}
            style={{ cursor: 'pointer' }}
          />
          <path
            className="petal"
            d="M200,180 Q230,150 250,130 Q260,115 245,105 Q230,100 215,115 Q205,130 200,145"
            fill="#ffb6c1"
            stroke="#ff69b4"
            strokeWidth="1"
            onMouseEnter={handlePetalHover}
            onMouseLeave={handlePetalLeave}
            style={{ cursor: 'pointer' }}
          />

          {/* Inner heart */}
          <path
            className="petal"
            d="M200,170 Q185,155 175,145 Q170,138 178,133 Q185,130 192,138 Q197,145 200,155"
            fill="#ffc0cb"
            stroke="#ff1493"
            strokeWidth="0.5"
            onMouseEnter={handlePetalHover}
            onMouseLeave={handlePetalLeave}
            style={{ cursor: 'pointer' }}
          />
          <path
            className="petal"
            d="M200,170 Q215,155 225,145 Q230,138 222,133 Q215,130 208,138 Q203,145 200,155"
            fill="#ffc0cb"
            stroke="#ff1493"
            strokeWidth="0.5"
            onMouseEnter={handlePetalHover}
            onMouseLeave={handlePetalLeave}
            style={{ cursor: 'pointer' }}
          />
        </g>

        {/* Flower center */}
        <circle
          ref={centerRef}
          cx="200"
          cy="155"
          r="15"
          fill="url(#centerGradient)"
          filter="url(#glow)"
        />
        
        {/* Center details */}
        <g opacity="0.6">
          <circle cx="195" cy="150" r="2" fill="#ff8c00" />
          <circle cx="205" cy="150" r="2" fill="#ff8c00" />
          <circle cx="200" cy="158" r="2" fill="#ff8c00" />
          <circle cx="192" cy="155" r="1.5" fill="#ff8c00" />
          <circle cx="208" cy="155" r="1.5" fill="#ff8c00" />
        </g>

        {/* Vein details on petals */}
        <g opacity="0.3" stroke="#ff1493" strokeWidth="0.5" fill="none">
          <path d="M200,150 Q180,120 160,100" />
          <path d="M200,150 Q220,120 240,100" />
          <path d="M195,160 Q170,140 145,125" />
          <path d="M205,160 Q230,140 255,125" />
        </g>
      </svg>

      {/* Growth indicator */}
      {growthStage > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[1, 2, 3].map((stage) => (
            <div
              key={stage}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                growthStage >= stage 
                  ? 'bg-pink-500 scale-110' 
                  : 'bg-pink-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Flower;

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Sparkles, Flower2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface MessageCardText {
  title: string;
  body: string;
  signature: string;
  subtitle: string;
}

interface MessageCardProps {
  text: MessageCardText;
}

const MessageCard = ({ text }: MessageCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = text.body;
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 70%',
        onEnter: () => {
          setIsVisible(true);
          
          // Card unfold animation
          gsap.fromTo(cardRef.current,
            { 
              rotateX: 45,
              opacity: 0,
              y: 100,
            },
            { 
              rotateX: 0,
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
            }
          );
        },
      });
    }, cardRef);

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
      ctx.revert();
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!isVisible) return;

    setTypedText('');
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [isVisible, fullText]);

  return (
    <div 
      ref={cardRef}
      className="relative w-full max-w-xl mx-4"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        opacity: 0,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-8 -left-8 text-pink-400 animate-float">
        <Heart className="w-8 h-8 fill-current" />
      </div>
      <div className="absolute -top-4 -right-12 text-pink-300 animate-float" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute -bottom-6 -left-6 text-pink-300 animate-float" style={{ animationDelay: '1s' }}>
        <Flower2 className="w-7 h-7" />
      </div>
      <div className="absolute -bottom-8 -right-8 text-pink-400 animate-float" style={{ animationDelay: '1.5s' }}>
        <Heart className="w-9 h-9 fill-current" />
      </div>

      {/* Main card */}
      <div 
        className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,240,245,0.95) 100%)',
          boxShadow: '0 25px 80px rgba(255, 105, 180, 0.25), 0 10px 30px rgba(255, 105, 180, 0.15)',
        }}
      >
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-pink-300 rounded-tl-2xl opacity-50" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-pink-300 rounded-tr-2xl opacity-50" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-pink-300 rounded-bl-2xl opacity-50" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-pink-300 rounded-br-2xl opacity-50" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-10 h-10 text-pink-500 animate-heartbeat" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-pink-600 mb-2">
            {text.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto" />
        </div>

        {/* Message content */}
        <div ref={contentRef} className="relative">
          <p className="font-body text-xl md:text-2xl text-pink-700 leading-relaxed text-center min-h-[150px]">
            {typedText}
            <span className="inline-block w-0.5 h-6 bg-pink-500 ml-1 animate-pulse" />
          </p>
        </div>

        {/* Signature */}
        <div className="mt-8 text-center">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mx-auto mb-4" />
          <p className="font-accent text-2xl text-pink-500">
            {text.signature}
          </p>
          <p className="font-body text-lg text-pink-400 mt-1">
            {text.subtitle}
          </p>
        </div>

        {/* Floating mini hearts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-200 opacity-40"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                width: `${12 + i * 3}px`,
                height: `${12 + i * 3}px`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Glow effect behind card */}
      <div 
        className="absolute inset-0 -z-10 blur-3xl opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(255,192,203,0.6) 0%, transparent 70%)',
          transform: 'scale(1.2)',
        }}
      />
    </div>
  );
};

export default MessageCard;

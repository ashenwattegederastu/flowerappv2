import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Sparkles, Flower2 } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import Flower from './components/Flower';
import FallingPetals from './components/FallingPetals';
import MessageCard from './components/MessageCard';

gsap.registerPlugin(ScrollTrigger);

const LANGUAGE_STORAGE_KEY = 'flowerappv2.language';

type Language = 'en' | 'zh';

const copy: Record<Language, {
  switchLabel: string;
  title: string;
  subtitle: string;
  plantSeed: string;
  milestone1Title: string;
  milestone1Subtitle: string;
  milestone2Title: string;
  milestone2Subtitle: string;
  milestone3Title: string;
  milestone3Subtitle: string;
  messageTitle: string;
  messageBody: string;
  messageSignature: string;
  messageSubtitle: string;
  footerQuestion: string;
  acceptButton: string;
  celebrationTitle: string;
  celebrationSubtitle: string;
}> = {
  en: {
    switchLabel: '中文',
    title: 'A Flower for You',
    subtitle: 'Watch it bloom, just for you...',
    plantSeed: 'Plant the Seed',
    milestone1Title: 'It starts deep...',
    milestone1Subtitle: 'Roots of love',
    milestone2Title: 'Reaching for the sun...',
    milestone2Subtitle: 'Growing stronger',
    milestone3Title: 'Unfolding beauty...',
    milestone3Subtitle: 'In full bloom',
    messageTitle: 'A Message for You',
    messageBody: 'Just like this flower, my love for you grows every day. Each petal represents a moment, a memory, a reason why you mean the world to me. You are the sunshine that helps me bloom.',
    messageSignature: 'Forever Yours',
    messageSubtitle: 'With all my love 💕',
    footerQuestion: 'Will you accept this bouquet?',
    acceptButton: 'Yes, I will!',
    celebrationTitle: 'You made my heart bloom!',
    celebrationSubtitle: 'Forever yours... 💕',
  },
  zh: {
    switchLabel: 'EN',
    title: '送你一朵花',
    subtitle: '看它只为你绽放...',
    plantSeed: '种下花种',
    milestone1Title: '从心底开始...',
    milestone1Subtitle: '爱的根系',
    milestone2Title: '向着阳光生长...',
    milestone2Subtitle: '愈发坚定',
    milestone3Title: '层层绽放...',
    milestone3Subtitle: '花开正盛',
    messageTitle: '写给你的话',
    messageBody: '就像这朵花一样，我对你的爱每天都在生长。每一片花瓣都代表着一个瞬间、一段回忆、一个你对我如此重要的理由。你是照亮我心田的阳光，让我也能盛放。',
    messageSignature: '永远属于你',
    messageSubtitle: '把我全部的爱都给你 💕',
    footerQuestion: '你愿意收下这束花吗？',
    acceptButton: '我愿意！',
    celebrationTitle: '你让我的心也开花了！',
    celebrationSubtitle: '永远爱你... 💕',
  },
};

function App() {
  const [flowerPlanted, setFlowerPlanted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage === 'zh' ? 'zh' : 'en';
  });
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const flowerSectionRef = useRef<HTMLDivElement>(null);
  const messageSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const t = copy[language];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  // Initialize hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation - character by character
      if (headingRef.current) {
        const text = headingRef.current.innerText;
        headingRef.current.innerHTML = text
          .split('')
          .map((char, i) => 
            char === ' ' 
              ? ' ' 
              : `<span class="inline-block opacity-0 translate-y-full" style="animation-delay: ${i * 0.05}s">${char}</span>`
          )
          .join('');
        
        gsap.to(headingRef.current.querySelectorAll('span'), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          delay: 0.3
        });
      }

      // Subtext fade in
      gsap.fromTo(subtextRef.current,
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 1, delay: 1, ease: 'power2.out' }
      );

      // CTA button elastic entrance
      gsap.fromTo(ctaRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 1.5, ease: 'elastic.out(1, 0.5)' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [language]);

  // Scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax on scroll
      const heroTrigger = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (heroRef.current) {
            gsap.set(heroRef.current, { y: self.progress * -30 + '%' });
          }
        }
      });
      triggersRef.current.push(heroTrigger);

      // Flower section pin
      const flowerTrigger = ScrollTrigger.create({
        trigger: flowerSectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
      });
      triggersRef.current.push(flowerTrigger);

      // Message section animation
      gsap.fromTo(messageSectionRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: messageSectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          }
        }
      );

      // Footer animation
      gsap.fromTo(footerRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  // Plant the seed - start the flower growth
  const plantSeed = useCallback(() => {
    setFlowerPlanted(true);
    
    // Smooth scroll to flower section
    flowerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle bouquet acceptance
  const acceptBouquet = useCallback(() => {
    setShowCelebration(true);
    
    // Create confetti explosion
    const colors = ['#ffc0cb', '#ff69b4', '#ff1493', '#ffb6c1', '#ffe4e1'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const petal = document.createElement('div');
        petal.className = 'falling-petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.top = '-20px';
        petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(petal);
        
        setTimeout(() => petal.remove(), 5000);
      }, i * 50);
    }
  }, []);

  return (
    <div className="relative">
      {/* Falling Petals Effect */}
      <FallingPetals active={flowerPlanted} />
      
      {/* Hero Section */}
      <section ref={heroRef} className="section-hero relative">
        <FluidBackground />

        <button
          onClick={() => setLanguage((prev) => (prev === 'en' ? 'zh' : 'en'))}
          className="absolute top-6 right-6 z-20 glass px-4 py-2 rounded-full font-body text-pink-600 hover:scale-105 transition-transform"
          aria-label="Switch language"
        >
          {t.switchLabel}
        </button>
        
        <div className="relative z-10 text-center px-4">
          <div className="mb-6 flex justify-center">
            <Sparkles className="w-12 h-12 text-pink-500 animate-pulse" />
          </div>
          
          <h1 
            ref={headingRef}
            className="font-display text-6xl md:text-8xl text-pink-600 mb-6 animate-pulse-glow"
          >
            {t.title}
          </h1>
          
          <p 
            ref={subtextRef}
            className="font-body text-2xl md:text-3xl text-pink-500 mb-12 opacity-0"
          >
            {t.subtitle}
          </p>
          
          <button
            ref={ctaRef}
            onClick={plantSeed}
            className="btn-romantic opacity-0 flex items-center gap-3 mx-auto"
          >
            <Flower2 className="w-6 h-6" />
            {t.plantSeed}
            <Heart className="w-5 h-5 animate-heartbeat" />
          </button>
        </div>
        
        {/* Floating hearts decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-300 opacity-30 animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                width: `${20 + i * 5}px`,
                height: `${20 + i * 5}px`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Flower Growth Section */}
      <section 
        ref={flowerSectionRef} 
        className="section-flower bg-gradient-to-b from-rose-100 to-pink-50"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Flower isGrowing={flowerPlanted} />
          
          {/* Growth milestones */}
          <div className="absolute left-8 md:left-20 top-1/4 text-left">
            <div className="glass p-4 mb-8 transform -translate-x-full opacity-0 flower-milestone" data-milestone="1">
              <p className="font-body text-xl text-pink-600">{t.milestone1Title}</p>
              <p className="font-accent text-sm text-pink-400">{t.milestone1Subtitle}</p>
            </div>
          </div>
          
          <div className="absolute left-8 md:left-20 top-1/2 text-left">
            <div className="glass p-4 mb-8 transform -translate-x-full opacity-0 flower-milestone" data-milestone="2">
              <p className="font-body text-xl text-pink-600">{t.milestone2Title}</p>
              <p className="font-accent text-sm text-pink-400">{t.milestone2Subtitle}</p>
            </div>
          </div>
          
          <div className="absolute left-8 md:left-20 top-3/4 text-left">
            <div className="glass p-4 transform -translate-x-full opacity-0 flower-milestone" data-milestone="3">
              <p className="font-body text-xl text-pink-600">{t.milestone3Title}</p>
              <p className="font-accent text-sm text-pink-400">{t.milestone3Subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section 
        ref={messageSectionRef} 
        className="section-message bg-gradient-to-b from-pink-50 to-rose-100"
      >
        <MessageCard
          text={{
            title: t.messageTitle,
            body: t.messageBody,
            signature: t.messageSignature,
            subtitle: t.messageSubtitle,
          }}
        />
      </section>

      {/* Footer Section */}
      <section 
        ref={footerRef} 
        className="section-footer bg-gradient-to-b from-rose-100 to-pink-200"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <Flower2
              key={i}
              className="absolute text-pink-600"
              style={{
                left: `${(i % 5) * 25}%`,
                top: `${Math.floor(i / 5) * 25}%`,
                width: '40px',
                height: '40px',
                transform: `rotate(${i * 15}deg)`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-6xl text-pink-600 mb-8">
            {t.footerQuestion}
          </h2>
          
          {!showCelebration ? (
            <button
              onClick={acceptBouquet}
              className="btn-romantic animate-heartbeat flex items-center gap-3 mx-auto"
            >
              <Heart className="w-6 h-6" />
              {t.acceptButton}
              <Flower2 className="w-6 h-6" />
            </button>
          ) : (
            <div className="glass p-8 rounded-3xl animate-float">
              <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-heartbeat" />
              <h3 className="font-display text-3xl text-pink-600 mb-2">
                {t.celebrationTitle}
              </h3>
              <p className="font-body text-xl text-pink-500">
                {t.celebrationSubtitle}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const LoadingScreen = ({ isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    // Trigger entrance animation shortly after mount for smooth transition
    const enterTimer = setTimeout(() => {
      setHasEntered(true);
    }, 50);

    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // 500ms exit animation
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out ${
        isAnimatingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Ambient glowing background behind loader for premium feel */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo container with entrance and exit animation */}
        <div 
          className={`transition-all duration-[600ms] ease-out transform ${
            !hasEntered 
              ? 'scale-[0.8] opacity-0 translate-y-4' 
              : isAnimatingOut 
                ? 'scale-90 opacity-0 -translate-y-4' 
                : 'scale-100 opacity-100 translate-y-0'
          }`}
        >
          <img 
            src={logo} 
            alt="Loading..." 
            className="h-16 md:h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          />
        </div>
        
        {/* Subtle active loading indicator */}
        <div 
          className={`absolute -bottom-16 transition-all duration-500 ${
            !hasEntered ? 'opacity-0' : isAnimatingOut ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ transitionDelay: !hasEntered ? '0ms' : '200ms' }} // Delay showing loader dots until logo appears
        >
          {/* Subtle Ring/Dots */}
          <div className="flex gap-2 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

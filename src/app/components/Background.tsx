import svgPaths from "./svg-pt2uc8jul8";
import imgNoise from "../../../public/noise.png";
import { useEffect, useState, useRef } from "react";

// Shared SVG filter components
const SvgFilter = {
  Blur: ({ id, stdDeviation = 162 }: { id: string; stdDeviation?: number }) => (
    <filter
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
      id={`filter_${id}`}
      x="0"
      y="0"
      width="100%"
      height="100%"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
      <feGaussianBlur result="effect1_foregroundBlur" stdDeviation={stdDeviation} />
    </filter>
  ),
};

// Blob shine component with entrance and subtle movement
const BlobShine = () => {
  const [entered, setEntered] = useState(false);
  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Trigger entrance animation after a small delay
    const enterTimer = setTimeout(() => {
      setEntered(true);
    }, 200);
    
    // Subtle floating animation
    const floatAnimation = () => {
      const time = Date.now() * 0.1;
      const x = Math.sin(time * 3) * 15; // Very subtle
      const y = Math.cos(time * 2) * 18;
      setFloatOffset({ x, y });
      requestAnimationFrame(floatAnimation);
    };
    
    const animationId = requestAnimationFrame(floatAnimation);
    
    return () => {
      clearTimeout(enterTimer);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      className="absolute h-[446px] left-[-100px] top-[-150px] w-[499px] opacity-80"
      style={{
        transform: entered 
          ? `translate(0px, 0px) translate(${floatOffset.x}px, ${floatOffset.y}px)`
          : 'translateY(150px)',
        opacity: entered ? 0.8 : 0,
        transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.2s ease-out'
      }}
    >
      <div className="rotate-180 h-full w-full">
        <div className="relative h-full w-full">
          <div className="absolute inset-[-72.65%_-64.93%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1147 1094"
            >
              <g filter={`url(#filter_blob-shine)`}>
                <path
                  clipRule="evenodd"
                  d={svgPaths.p3801f100}
                  fill="#E5F25A"
                  fillRule="evenodd"
                />
              </g>
              <defs>
                <SvgFilter.Blur id="blob-shine" />
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Arc component with entrance animation and subtle drift
const Arc = ({
  left,
  top,
  color,
  dataName,
  delay = 0,
  rotation = 0,
  verticalOffset = 100
}: {
  left: string;
  top: string;
  color: string;
  dataName: string;
  delay?: number;
  rotation?: number;
  verticalOffset?: number;
}) => {
  const [entered, setEntered] = useState(false);
  const [driftOffset, setDriftOffset] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setEntered(true);
    }, 300 + delay * 200);
    
    // Very subtle drift animation
    const driftAnimation = () => {
      const time = Date.now() * 0.001 + delay;
      const x = Math.sin(time * 2) * 3; // Very subtle movement
      const y = Math.cos(time * 5) * 4;
      setDriftOffset({ x, y });
      requestAnimationFrame(driftAnimation);
    };
    
    const animationId = requestAnimationFrame(driftAnimation);
    
    return () => {
      clearTimeout(enterTimer);
      cancelAnimationFrame(animationId);
    };
  }, [delay]);

  return (
    <div
      className="absolute h-[410px] mix-blend-overlay w-[840px]"
      style={{ 
        left, 
        top,
        transform: entered 
          ? `translate(0px, 0px) translate(${driftOffset.x}px, ${driftOffset.y}px) rotate(${rotation}deg)`
          : `translateY(${verticalOffset}px) rotate(${rotation}deg)`,
        opacity: entered ? 1 : 0,
        transition: `transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay * 0.2}s, opacity 1.5s ease-out ${delay * 0.2}s`
      }}
      data-name={dataName}
    >
      <div className="absolute inset-[-22.93%_-11.19%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1028 598"
        >
          <g filter={`url(#filter_arc-${dataName})`} style={{ mixBlendMode: "overlay" }}>
            <path d={svgPaths.p3f195300} fill={color} />
          </g>
          <defs>
            <SvgFilter.Blur id={`arc-${dataName}`} stdDeviation={47} />
          </defs>
        </svg>
      </div>
    </div>
  );
};

// Glow ellipse component with entrance and breathing
const GlowEllipse = ({
  id,
  left,
  top,
  width,
  height,
  rotation,
  cx,
  cy,
  rx,
  ry,
  opacity = 1,
  delay = 0,
}: {
  id: string;
  left: string;
  top: string;
  width: string;
  height: string;
  rotation: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity?: number;
  delay?: number;
}) => {
  const [entered, setEntered] = useState(false);
  const [pulse, setPulse] = useState(1);
  
  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setEntered(true);
    }, 400 + delay * 200);
    
    // Subtle breathing animation
    const breatheAnimation = () => {
      const time = Date.now() * 0.001 + delay;
      const scale = 0.98 + Math.sin(time * 0.5) * 0.02; // Very subtle pulse
      setPulse(scale);
      requestAnimationFrame(breatheAnimation);
    };
    
    const animationId = requestAnimationFrame(breatheAnimation);
    
    return () => {
      clearTimeout(enterTimer);
      cancelAnimationFrame(animationId);
    };
  }, [delay]);

  return (
    <div
      className="absolute flex items-center justify-center mix-blend-overlay"
      style={{
        left,
        top,
        width,
        height,
        opacity: entered ? opacity * pulse : 0,
        transform: entered 
          ? `rotate(${rotation}) scale(${pulse})`
          : `rotate(${rotation}) scale(0.9) translateY(80px)`,
        transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay * 0.2}s, opacity 1.2s ease-out ${delay * 0.2}s`,
      }}
      data-name={id}
    >
      <div className="relative" style={{ width, height }}>
        <div className="absolute inset-[-152.88%_-18.62%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1290 465"
          >
            <g
              filter={`url(#filter_${id})`}
              id={id}
              style={{ mixBlendMode: "overlay" }}
            >
              <ellipse cx={cx} cy={cy} fill="white" rx={rx} ry={ry} />
            </g>
            <defs>
              <SvgFilter.Blur id={id} stdDeviation={87.5} />
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Frame component
function Frame() {
  return (
    <div className="absolute h-[800px] left-[-200px] top-[-300px] w-[1300px]">
      <BlobShine />
      <Arc
        left="200px"
        top="600px"
        color="white"
        dataName="arc-white-left"
        delay={0.2}
        rotation={-5}
        verticalOffset={120}
      />
      <Arc
        left="40px"
        top="450px"
        color="#C5E7FF"
        dataName="arc-pink-top"
        delay={0.4}
        rotation={10}
        verticalOffset={150}
      />
      <Arc
        left="-150px"
        top="500px"
        color="#E5F25A"
        dataName="arc-yellow-bottom"
        delay={0.6}
        rotation={-15}
        verticalOffset={100}
      />

      <Arc
        left="200px"
        top="200px"
        color="white"
        dataName="arc-white-left"
        delay={0.2}
        rotation={-5}
        verticalOffset={120}
      />
      <Arc
        left="40px"
        top="850px"
        color="#C5E7FF"
        dataName="arc-pink-top"
        delay={0.4}
        rotation={10}
        verticalOffset={150}
      />
      <Arc
        left="-150px"
        top="300px"
        color="#E5F25A"
        dataName="arc-yellow-bottom"
        delay={0.6}
        rotation={-15}
        verticalOffset={100}
      />
    </div>
  );
}

// Main Background component
export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
  }>>([]);

  // Initialize particles on mount
  useEffect(() => {
    const particleCount = 15;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 120 - 10,
      top: Math.random() * 120 - 10,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.1 + 0.05,
    }));
    setParticles(newParticles);
    
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative size-full overflow-hidden" 
      data-name="Background"
    >
      {/* Add CSS animations for continuous subtle movement */}
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
          }
          25% { 
            transform: translateY(-2px) translateX(1px); 
          }
          50% { 
            transform: translateY(1px) translateX(-1px); 
          }
          75% { 
            transform: translateY(-1px) translateX(2px); 
          }
        }
        
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        
        @keyframes particleFloat {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: var(--particle-opacity);
          }
          80% {
            opacity: var(--particle-opacity);
          }
          100% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0;
          }
        }
        
        .animate-gentle-float {
          animation: gentleFloat 15s ease-in-out infinite;
        }
        
        .animate-gentle-pulse {
          animation: gentlePulse 8s ease-in-out infinite;
        }
        
        .animate-particle-float {
          animation: particleFloat var(--particle-duration) ease-in-out infinite;
          animation-delay: var(--particle-delay);
        }
      `}</style>

      {/* Main gradient overlay - enters from bottom */}
      <div
        className="absolute bg-gradient-to-br from-[#2d3436] from-[10%] via-[#2aa9cd55] to-[#2aa9cd] h-[140%] left-[-20%] mix-blend-overlay opacity-40 top-[-20%] w-[140%]"
        data-name="gradient-overlay"
        style={{
          transform: isLoaded ? 'translateY(0)' : 'translateY(100px)',
          opacity: isLoaded ? 0.4 : 0,
          transition: 'transform 2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.5s ease-out'
        }}
      />

      <Frame />

      {/* Noise texture - enters with fade */}
      <div
        className="absolute bg-repeat bg-[length:3072px_3072px] bg-top-left h-[120%] left-[-10%] mix-blend-soft-light opacity-[0.12] top-[-10%] w-[120%]"
        data-name="noise"
        style={{ 
          backgroundImage: `url('${imgNoise}')`,
          opacity: isLoaded ? 0.12 : 0,
          transition: 'opacity 1.8s ease-out 0.3s'
        }}
      />

      {/* Glow effects */}
      <GlowEllipse
        id="top-card-glow-1"
        left="-100px"
        top="-50px"
        width="945.65px"
        height="268.524px"
        rotation="9.534deg"
        cx={644.834}
        cy={232.235}
        rx={469.834}
        ry={57.2352}
        opacity={0.7}
        delay={0.1}
      />

      <GlowEllipse
        id="top-card-glow-2"
        left="calc(100% - 600px)"
        top="calc(100% - 200px)"
        width="742.122px"
        height="340.17px"
        rotation="348.16deg"
        cx={533.449}
        cy={273.639}
        rx={358.449}
        ry={98.6389}
        opacity={0.6}
        delay={0.3}
      />

      <GlowEllipse
        id="top-card-glow-3"
        left="calc(50% - 300px)"
        top="calc(100% - 100px)"
        width="942.122px"
        height="440.17px"
        rotation="15deg"
        cx={533.449}
        cy={273.639}
        rx={458.449}
        ry={128.639}
        opacity={0.15}
        delay={0.5}
      />

      {/* Floating particles - enter from bottom */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: isLoaded ? particle.opacity : 0,
              '--particle-opacity': particle.opacity,
              '--particle-duration': `${particle.duration}s`,
              '--particle-delay': `${particle.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Light streaks */}
      <div 
        className="absolute h-[1px] left-[-100px] top-[30%] w-[300px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateX(0)' : 'translateY(50px)',
          transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s, opacity 1.2s ease-out 0.4s'
        }}
      />
      <div 
        className="absolute h-[1px] left-[60%] top-[70%] w-[400px] bg-gradient-to-r from-transparent via-white/8 to-transparent"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateX(0)' : 'translateY(70px)',
          transition: 'transform 1.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s, opacity 1.4s ease-out 0.6s'
        }}
      />

      {/* Subtle vignette overlay */}
      <div 
        className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(14, 16, 17, 0.1) 40%, rgba(14, 16, 17, 0.3) 100%) pointer-events-none"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.5s ease-out 0.8s'
        }}
      />
    </div>
  );
}
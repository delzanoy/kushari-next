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

// Blob shine component with complex movement
const BlobShine = () => {
  const [entered, setEntered] = useState(false);
  const [transform, setTransform] = useState({ 
    translateX: 0, 
    translateY: 0,
    rotate: 0,
    scale: 1,
    skewX: 0,
    skewY: 0
  });
  
  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => {
      setEntered(true);
    }, 200);
    
    // Complex floating animation with multiple parameters
    const floatAnimation = () => {
      const time = Date.now() * 0.001;
      
      // Multi-frequency movement for organic feel
      const translateX = 
        Math.sin(time * 0.15) * 20 + 
        Math.cos(time * 0.25) * 12 +
        Math.sin(time * 0.05) * 5;
      
      const translateY = 
        Math.cos(time * 0.12) * 18 + 
        Math.sin(time * 0.18) * 10 +
        Math.cos(time * 0.03) * 6;
      
      // Gentle rotation
      const rotate = Math.sin(time * 0.08) * 3;
      
      // Subtle pulsing scale
      const scale = 1 + Math.sin(time * 0.1) * 0.04;
      
      // Very slight skew for organic distortion
      const skewX = Math.sin(time * 0.06) * 0.5;
      const skewY = Math.cos(time * 0.04) * 0.3;
      
      setTransform({ 
        translateX, 
        translateY, 
        rotate, 
        scale,
        skewX,
        skewY
      });
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
          ? `translate(${transform.translateX}px, ${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale}) skew(${transform.skewX}deg, ${transform.skewY}deg)`
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

// Arc component with complex movement patterns
const Arc = ({
  left,
  top,
  color,
  dataName,
  delay = 0,
  rotation = 0,
  verticalOffset = 100,
  movementPattern = "gentle"
}: {
  left: string;
  top: string;
  color: string;
  dataName: string;
  delay?: number;
  rotation?: number;
  verticalOffset?: number;
  movementPattern?: "gentle" | "circular" | "wave" | "pulse";
}) => {
  const [entered, setEntered] = useState(false);
  const [transform, setTransform] = useState({ 
    translateX: 0, 
    translateY: 0,
    rotate: 0,
    scale: 1
  });
  
  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setEntered(true);
    }, 300 + delay * 200);
    
    // Different movement patterns
    const driftAnimation = () => {
      const time = Date.now() * 0.001 + delay;
      
      let translateX = 0;
      let translateY = 0;
      let rotate = 0;
      let scale = 1;
      
      switch(movementPattern) {
        case "circular":
          // Circular movement
          translateX = Math.sin(time * 0.2) * 15;
          translateY = Math.cos(time * 0.2) * 12;
          rotate = Math.sin(time * 0.1) * 2;
          scale = 1 + Math.sin(time * 0.3) * 0.02;
          break;
          
        case "wave":
          // Wave-like movement
          translateX = Math.sin(time * 0.25) * 8;
          translateY = Math.sin(time * 0.15 + delay) * 18;
          rotate = Math.cos(time * 0.08) * 1.5;
          scale = 1 + Math.sin(time * 0.4) * 0.03;
          break;
          
        case "pulse":
          // Pulsating movement
          translateX = Math.sin(time * 0.12) * 10;
          translateY = Math.cos(time * 0.08) * 6;
          const pulse = 0.96 + Math.sin(time * 0.5) * 0.04;
          rotate = Math.sin(time * 0.06) * 3;
          scale = pulse;
          break;
          
        case "gentle":
        default:
          // Gentle, organic movement
          translateX = 
            Math.sin(time * 0.18) * 12 + 
            Math.cos(time * 0.1) * 6;
          translateY = 
            Math.cos(time * 0.15) * 10 + 
            Math.sin(time * 0.07) * 4;
          rotate = Math.sin(time * 0.05) * 1.5;
          scale = 1 + Math.sin(time * 0.2) * 0.01;
          break;
      }
      
      setTransform({ 
        translateX, 
        translateY, 
        rotate: rotation + rotate,
        scale
      });
      requestAnimationFrame(driftAnimation);
    };
    
    const animationId = requestAnimationFrame(driftAnimation);
    
    return () => {
      clearTimeout(enterTimer);
      cancelAnimationFrame(animationId);
    };
  }, [delay, rotation, movementPattern]);

  return (
    <div
      className="absolute h-[410px] mix-blend-overlay w-[840px]"
      style={{ 
        left, 
        top,
        transform: entered 
          ? `translate(${transform.translateX}px, ${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale})`
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

// Glow ellipse component with enhanced breathing and movement
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
  movementType = "breath"
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
  movementType?: "breath" | "float" | "oscillate";
}) => {
  const [entered, setEntered] = useState(false);
  const [transform, setTransform] = useState({ 
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0
  });
  
  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setEntered(true);
    }, 400 + delay * 200);
    
    const breatheAnimation = () => {
      const time = Date.now() * 0.001 + delay;
      
      let scale = 1;
      let rotate = 0;
      let translateX = 0;
      let translateY = 0;
      
      switch(movementType) {
        case "float":
          // Floating movement with slight rotation
          scale = 0.96 + Math.sin(time * 0.4) * 0.04;
          rotate = Math.sin(time * 0.15) * 2;
          translateX = Math.cos(time * 0.1) * 8;
          translateY = Math.sin(time * 0.08) * 6;
          break;
          
        case "oscillate":
          // Oscillating movement
          scale = 0.94 + Math.sin(time * 0.6) * 0.06;
          rotate = Math.sin(time * 0.2) * 5;
          translateX = Math.sin(time * 0.3) * 12;
          translateY = Math.cos(time * 0.25) * 8;
          break;
          
        case "breath":
        default:
          // Breathing movement
          scale = 0.95 + Math.sin(time * 0.8) * 0.05;
          rotate = Math.sin(time * 0.05) * 1;
          translateX = Math.sin(time * 0.12) * 4;
          translateY = Math.cos(time * 0.09) * 3;
          break;
      }
      
      setTransform({ 
        scale, 
        rotate: parseFloat(rotation) + rotate,
        translateX,
        translateY
      });
      requestAnimationFrame(breatheAnimation);
    };
    
    const animationId = requestAnimationFrame(breatheAnimation);
    
    return () => {
      clearTimeout(enterTimer);
      cancelAnimationFrame(animationId);
    };
  }, [delay, rotation, movementType]);

  return (
    <div
      className="absolute flex items-center justify-center mix-blend-overlay"
      style={{
        left,
        top,
        width,
        height,
        opacity: entered ? opacity * transform.scale : 0,
        transform: entered 
          ? `translate(${transform.translateX}px, ${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale})`
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

// Frame component with varied movement patterns
function Frame() {
  return (
    <div className="absolute h-[800px] left-[-200px] top-[-300px] w-[1300px]">
      <BlobShine />
      
      {/* First set of arcs with different movement patterns */}
      <Arc
        left="200px"
        top="600px"
        color="white"
        dataName="arc-white-left-gentle"
        delay={0.2}
        rotation={-5}
        verticalOffset={120}
        movementPattern="gentle"
      />
      <Arc
        left="40px"
        top="450px"
        color="#C5E7FF"
        dataName="arc-pink-top-circular"
        delay={0.4}
        rotation={10}
        verticalOffset={150}
        movementPattern="circular"
      />
      <Arc
        left="-150px"
        top="500px"
        color="#E5F25A"
        dataName="arc-yellow-bottom-wave"
        delay={0.6}
        rotation={-15}
        verticalOffset={100}
        movementPattern="wave"
      />

      {/* Second set of arcs with different patterns */}
      <Arc
        left="200px"
        top="200px"
        color="white"
        dataName="arc-white-right-pulse"
        delay={0.3}
        rotation={15}
        verticalOffset={120}
        movementPattern="pulse"
      />
      <Arc
        left="40px"
        top="850px"
        color="#C5E7FF"
        dataName="arc-pink-bottom-wave"
        delay={0.5}
        rotation={-20}
        verticalOffset={150}
        movementPattern="wave"
      />
      <Arc
        left="-150px"
        top="300px"
        color="#E5F25A"
        dataName="arc-yellow-top-circular"
        delay={0.7}
        rotation={25}
        verticalOffset={100}
        movementPattern="circular"
      />

      {/* Additional arcs for more density */}
      <Arc
        left="350px"
        top="700px"
        color="rgba(255,255,255,0.7)"
        dataName="arc-white-far-gentle"
        delay={0.8}
        rotation={-10}
        verticalOffset={130}
        movementPattern="gentle"
      />
      <Arc
        left="500px"
        top="350px"
        color="rgba(197, 231, 255, 0.6)"
        dataName="arc-pink-mid-pulse"
        delay={0.9}
        rotation={30}
        verticalOffset={140}
        movementPattern="pulse"
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
    movementX: number;
    movementY: number;
    particleType: "dot" | "line" | "ring";
  }>>([]);

  // Initialize particles on mount
  useEffect(() => {
    const particleCount = 25;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 120 - 10,
      top: Math.random() * 120 - 10,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.15 + 0.05,
      movementX: (Math.random() - 0.5) * 100,
      movementY: (Math.random() - 0.5) * 80,
      particleType: ["dot", "line", "ring"][Math.floor(Math.random() * 3)] as "dot" | "line" | "ring"
    }));
    setParticles(newParticles);
    
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Mouse interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced particle movement with mouse interaction
  const particleTransform = {
    transform: `translate(${mousePosition.x * 8}px, ${mousePosition.y * 6}px)`,
  };

  return (
    <div 
      ref={containerRef}
      className="relative size-full overflow-hidden" 
      data-name="Background"
    >
      {/* Add CSS animations for continuous subtle movement */}
      <style jsx>{`
        @keyframes complexFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0) rotate(0deg) scale(1); 
          }
          25% { 
            transform: translateY(-4px) translateX(2px) rotate(0.3deg) scale(1.01); 
          }
          50% { 
            transform: translateY(2px) translateX(-3px) rotate(-0.2deg) scale(0.99); 
          }
          75% { 
            transform: translateY(-2px) translateX(3px) rotate(0.1deg) scale(1.02); 
          }
        }
        
        @keyframes particleOrbit {
          0% {
            transform: rotate(0deg) translateX(20px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(20px) rotate(-360deg);
          }
        }
        
        @keyframes particleDrift {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(15px, -10px);
          }
          50% {
            transform: translate(-10px, 8px);
          }
          75% {
            transform: translate(5px, 12px);
          }
        }
        
        @keyframes particleSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .animate-complex-float {
          animation: complexFloat 25s ease-in-out infinite;
        }
        
        .animate-particle-orbit {
          animation: particleOrbit 40s linear infinite;
        }
        
        .animate-particle-drift {
          animation: particleDrift 30s ease-in-out infinite;
        }
        
        .animate-particle-spin {
          animation: particleSpin 60s linear infinite;
        }
      `}</style>

      {/* Main gradient overlay - subtle movement */}
      <div
        className="absolute bg-gradient-to-br from-[#2d3436] from-[10%] via-[#2aa9cd55] to-[#2aa9cd] h-[140%] left-[-20%] mix-blend-overlay opacity-40 top-[-20%] w-[140%] animate-complex-float"
        data-name="gradient-overlay"
        style={{
          ...particleTransform,
          opacity: isLoaded ? 0.4 : 0,
          transition: 'opacity 1.5s ease-out'
        }}
      />

      <Frame />

      {/* Noise texture with subtle movement */}
      <div
        className="absolute bg-repeat bg-[length:3072px_3072px] bg-top-left h-[120%] left-[-10%] mix-blend-soft-light opacity-[0.12] top-[-10%] w-[120%]"
        data-name="noise"
        style={{ 
          backgroundImage: `url('${imgNoise}')`,
          ...particleTransform,
          opacity: isLoaded ? 0.12 : 0,
          transition: 'opacity 1.8s ease-out 0.3s'
        }}
      />

      {/* Glow effects with varied movement */}
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
        movementType="breath"
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
        movementType="float"
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
        movementType="oscillate"
      />

      {/* Additional glow for more depth */}
      <GlowEllipse
        id="top-card-glow-4"
        left="calc(20% - 100px)"
        top="calc(30% - 50px)"
        width="600.65px"
        height="200.524px"
        rotation="45deg"
        cx={444.834}
        cy={132.235}
        rx={369.834}
        ry={37.2352}
        opacity={0.3}
        delay={0.7}
        movementType="float"
      />

      {/* Enhanced particles with varied types and movement */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute ${
              particle.particleType === 'dot' ? 'rounded-full' : 
              particle.particleType === 'line' ? 'rounded-sm h-[1px]' : 
              'rounded-full border border-white/10'
            } bg-white`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.particleType === 'line' ? `${particle.size * 4}px` : `${particle.size}px`,
              height: particle.particleType === 'line' ? '1px' : `${particle.size}px`,
              opacity: isLoaded ? particle.opacity : 0,
              animation: 
                particle.particleType === 'ring' ? 'particleOrbit infinite linear' :
                particle.particleType === 'line' ? 'particleDrift infinite ease-in-out' :
                'particleSpin infinite linear',
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              transform: isLoaded ? 'none' : `translateX(${particle.movementX}px) translateY(${particle.movementY}px)`,
              transition: `transform 1.2s ease-out ${particle.delay * 0.2}s, opacity 0.8s ease-out ${particle.delay * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Interactive light streaks */}
      <div 
        className="absolute h-[1px] left-[-100px] top-[30%] w-[300px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? `translateX(${mousePosition.x * 15}px) translateY(${mousePosition.y * 8}px)` : 'translateY(50px)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.2s ease-out 0.4s'
        }}
      />
      <div 
        className="absolute h-[1px] left-[60%] top-[70%] w-[400px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? `translateX(${mousePosition.x * -12}px) translateY(${mousePosition.y * 10}px)` : 'translateY(70px)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, opacity 1.4s ease-out 0.6s'
        }}
      />

      {/* Subtle vignette overlay with movement */}
      <div 
        className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(14, 16, 17, 0.1) 40%, rgba(14, 16, 17, 0.3) 100%) pointer-events-none"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? `translate(${mousePosition.x * 3}px, ${mousePosition.y * 2}px)` : 'translateY(0)',
          transition: 'transform 0.3s ease-out, opacity 1.5s ease-out 0.8s'
        }}
      />
    </div>
  );
}
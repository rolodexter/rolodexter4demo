'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import gsap from 'gsap';

interface Feature {
  id: string;
  x: number;
  y: number;
  text: string;
  description: string;
}

export const FeatureTour = () => {
  const {
    isTouring,
    currentFeature,
    features,
    tourProgress,
    startTour,
    nextFeature,
    hoveredFeature,
    setHoveredFeature,
    setGlitchIntensity
  } = useUIStore();

  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeConnections, setActiveConnections] = useState<[number, number][]>([]);
  const [dataParticles, setDataParticles] = useState<{ id: string, x: number, y: number, pathId: string }[]>([]);
  const [glitchFeature, setGlitchFeature] = useState<string | null>(null);
  
  // Start tour on mount
  useEffect(() => {
    startTour();
    
    // Random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchIntensity(Math.random());
        setTimeout(() => setGlitchIntensity(0), 200);
        
        // Random feature glitch effect
        const randomFeatureIdx = Math.floor(Math.random() * features.length);
        setGlitchFeature(features[randomFeatureIdx].id);
        setTimeout(() => setGlitchFeature(null), 300);
      }
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, [startTour, setGlitchIntensity, features]);

  // Handle feature transitions
  useEffect(() => {
    if (isTouring) {
      const timer = setTimeout(() => {
        nextFeature();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTouring, currentFeature, nextFeature]);
  
  // Generate neural connections with data particles for active feature
  useEffect(() => {
    if (currentFeature >= 0 && featureRefs.current.length > 0) {
      // Clear previous connections
      setActiveConnections([]);
      setDataParticles([]);
      
      // Create 1-3 random connections
      const connections: [number, number][] = [];
      const numConnections = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numConnections; i++) {
        let targetIndex = Math.floor(Math.random() * features.length);
        
        // Avoid connecting to self
        while (targetIndex === currentFeature) {
          targetIndex = Math.floor(Math.random() * features.length);
        }
        
        connections.push([currentFeature, targetIndex]);
      }
      
      // Animate connections appearing
      setTimeout(() => {
        setActiveConnections(connections);
        
        // Create data particles that flow along connections
        setTimeout(() => {
          connections.forEach(([source, target], idx) => {
            const pathId = `path-${source}-${target}`;
            
            // Create 3 particles per connection
            for (let i = 0; i < 3; i++) {
              const particleId = `particle-${source}-${target}-${i}-${Date.now()}`;
              setDataParticles(prev => [
                ...prev, 
                { id: particleId, x: 0, y: 0, pathId }
              ]);
              
              // Animate particle along path with GSAP
              setTimeout(() => {
                const pathElement = document.getElementById(pathId);
                if (pathElement) {
                  const pathLength = pathElement.getTotalLength();
                  
                  gsap.fromTo(
                    `#${particleId}`,
                    { 
                      startOffset: "0%",
                      opacity: 0
                    },
                    {
                      startOffset: "100%",
                      opacity: [0, 1, 0],
                      duration: 1.5 + Math.random(),
                      ease: "power1.inOut",
                      onComplete: () => {
                        // Remove particle after animation
                        setDataParticles(prev => prev.filter(p => p.id !== particleId));
                      }
                    }
                  );
                }
              }, 300 + i * 200);
            }
          });
        }, 300);
      }, 500);
    }
  }, [currentFeature, features]);
  
  // Handle hover connections and effects
  useEffect(() => {
    if (hoveredFeature) {
      // Trigger slight glitch effect
      setGlitchIntensity(0.2);
      setTimeout(() => setGlitchIntensity(0), 150);
    }
  }, [hoveredFeature, setGlitchIntensity]);

  // Generate SVG path between two features
  const generatePath = (source: number, target: number) => {
    const sourceEl = featureRefs.current[source];
    const targetEl = featureRefs.current[target];
    
    if (!sourceEl || !targetEl) return "";
    
    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    
    const sourceX = sourceRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top + sourceRect.height / 2;
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;
    
    // Control points for bezier curve
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const controlX1 = sourceX + dx * 0.25 + (Math.random() - 0.5) * 50;
    const controlY1 = sourceY + dy * 0.1 + (Math.random() - 0.5) * 30;
    const controlX2 = sourceX + dx * 0.75 + (Math.random() - 0.5) * 50;
    const controlY2 = sourceY + dy * 0.9 + (Math.random() - 0.5) * 30;
    
    return `M${sourceX},${sourceY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${targetX},${targetY}`;
  };

  // Calculate position for neural connections between panels
  const getConnectionStyle = (sourceIndex: number, targetIndex: number) => {
    const sourceEl = featureRefs.current[sourceIndex];
    const targetEl = featureRefs.current[targetIndex];
    
    if (!sourceEl || !targetEl) return {};
    
    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    
    const sourceX = sourceRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top + sourceRect.height / 2;
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;
    
    const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
    const distance = Math.sqrt(
      Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)
    );
    
    return {
      left: sourceX,
      top: sourceY,
      width: distance,
      transform: `rotate(${angle}deg)`,
    };
  };
  
  // Glitch transformation variants for hover effects
  const glitchVariants = {
    normal: { 
      clipPath: "inset(0% 0% 0% 0%)",
      x: 0, 
      y: 0,
    },
    glitch: {
      clipPath: [
        "inset(15% 0% 60% 0%)",
        "inset(40% 0% 40% 0%)",
        "inset(5% 0% 70% 0%)",
        "inset(0% 0% 0% 0%)",
      ],
      x: [1, -1, 0],
      y: [1, -1, 0],
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Progress Bar */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <div className="w-32 h-1 bg-foreground/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[rgb(var(--accent-electric))]"
            initial={{ width: 0 }}
            animate={{ width: `${tourProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="font-mono text-xs text-foreground/40">
          STEP {currentFeature + 1}/{features.length}
        </span>
      </div>

      {/* Feature Boxes */}
      <div className="grid grid-cols-2 gap-8 p-8">
        {features.map((feature: Feature, index: number) => (
          <motion.div
            key={feature.id}
            ref={el => featureRefs.current[index] = el}
            className={`
              cyberpunk-panel p-6
              ${hoveredFeature === feature.id ? 'electric-glow' : ''}
              ${currentFeature === index ? 'neon-glow' : ''}
            `}
            onHoverStart={() => setHoveredFeature(feature.id)}
            onHoverEnd={() => setHoveredFeature(null)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            variants={glitchVariants}
            animate={glitchFeature === feature.id ? "glitch" : "normal"}
          >
            <div className="relative z-10 overflow-hidden">
              <motion.h3 
                className="text-lg font-mono mb-2 glitch-text"
                animate={{ 
                  textShadow: hoveredFeature === feature.id || currentFeature === index
                    ? "0 0 8px rgba(0, 255, 255, 0.7), 0 0 12px rgba(0, 123, 255, 0.7)" 
                    : "none"
                }}
              >
                {feature.text}
                
                {/* Glitch overlay effect */}
                {(hoveredFeature === feature.id || currentFeature === index) && (
                  <motion.span 
                    className="absolute inset-0 text-[rgb(var(--accent-neon))] opacity-30 select-none pointer-events-none"
                    style={{ clipPath: "inset(10% 0% 70% 0%)" }}
                    animate={{ 
                      x: [0, -2, 2, 0],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  >
                    {feature.text}
                  </motion.span>
                )}
              </motion.h3>
              
              <p className="text-sm text-foreground/60">
                {feature.description}
              </p>
              
              {/* Feature data visualization */}
              <div className="mt-4 h-2 bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[rgb(var(--accent-neon))] bg-opacity-30"
                  animate={{ width: ['0%', '100%', '40%', '80%', '60%'] }}
                  transition={{ 
                    duration: 4, 
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </div>
              
              {/* Data nodes for the active feature */}
              {currentFeature === index && (
                <div className="mt-2 flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={`node-${index}-${i}`}
                      className="w-1 h-1 rounded-full bg-[rgb(var(--accent-electric))]"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* Feature activation button - only for active feature */}
              {currentFeature === index && (
                <motion.button
                  className="mt-4 px-3 py-1 bg-white border border-[rgb(var(--accent-electric))] text-xs font-mono text-[rgb(var(--accent-electric))] hover-lift"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 10px rgba(0, 123, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ACTIVATE.MODULE
                </motion.button>
              )}
            </div>

            {/* Circuit Grid */}
            <div className="circuit-grid" />

            {/* Scanner Effect when active */}
            {currentFeature === index && (
              <div className="absolute inset-0 scanner-effect" />
            )}
            
            {/* Glitch scanline effect on hover */}
            {(hoveredFeature === feature.id || currentFeature === index) && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(transparent, rgba(0, 255, 255, 0.05) 50%, transparent 50%, rgba(0, 123, 255, 0.05) 100%)",
                  backgroundSize: "100% 4px",
                  zIndex: 1
                }}
                animate={{
                  backgroundPosition: ["0px 0px", "0px 100px"]
                }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Neural Connections SVG Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg ref={svgRef} width="100%" height="100%" className="absolute inset-0">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 123, 255, 0.6)" />
              <stop offset="50%" stopColor="rgba(0, 255, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(0, 123, 255, 0.6)" />
            </linearGradient>
            
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="100%" stopColor="rgba(0, 255, 255, 0.8)" />
            </linearGradient>
          </defs>
          
          {/* Active Neural Connections */}
          <AnimatePresence>
            {activeConnections.map(([source, target], i) => {
              const pathId = `path-${source}-${target}`;
              return (
                <g key={pathId}>
                  <motion.path
                    id={pathId}
                    d={generatePath(source, target)}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    stroke="url(#connectionGradient)"
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#neonGlow)"
                  />
                  
                  {/* Data particles traveling along paths */}
                  {dataParticles
                    .filter(p => p.pathId === pathId)
                    .map(particle => (
                    <motion.circle
                      key={particle.id}
                      id={particle.id}
                      r={3}
                      fill="url(#particleGradient)"
                      filter="url(#neonGlow)"
                    >
                      <animateMotion
                        dur="1.5s"
                        repeatCount="1"
                        path={generatePath(source, target)}
                      />
                    </motion.circle>
                  ))}
                </g>
              );
            })}
          </AnimatePresence>
          
          {/* Hover Connections */}
          <AnimatePresence>
            {hoveredFeature && features.map((feature: Feature, i) => {
              if (feature.id === hoveredFeature) return null;
              const sourceIndex = features.findIndex((f: Feature) => f.id === hoveredFeature);
              if (sourceIndex < 0) return null;
              
              const pathId = `hover-path-${hoveredFeature}-${feature.id}`;
              
              return (
                <motion.path
                  key={pathId}
                  d={generatePath(sourceIndex, i)}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  stroke="rgba(0, 255, 255, 0.4)"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </AnimatePresence>
        </svg>
      </div>

      {/* Status Text */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <div className="w-1 h-1 rounded-full bg-[rgb(var(--accent-electric))] pulse-glow" />
        <span className="status-text">
          {isTouring ? 'SCANNING.FEATURES' : 'SCAN.COMPLETE'}
        </span>
      </div>
      
      {/* Glitch overlay effect */}
      <AnimatePresence>
        {(glitchFeature !== null || currentFeature >= 0) && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-10 mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0" style={{ 
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 900 900' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
              backgroundPosition: "center",
              backgroundSize: "cover", 
              opacity: 0.2
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
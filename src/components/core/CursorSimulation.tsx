'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

interface CursorTooltip {
  id: number;
  text: string;
  position: { x: number; y: number };
  featureId: string;
}

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  opacity: number;
}

export const CursorSimulation = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cursorX = useMotionValue(100);
  const cursorY = useMotionValue(100);
  const [cursorPosition, setCursorPosition] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [tooltip, setTooltip] = useState<CursorTooltip | null>(null);
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [tourStep, setTourStep] = useState(0);
  const [hoverGlitch, setHoverGlitch] = useState(false);
  
  // Get feature information from store
  const { 
    features, 
    currentFeature, 
    startTour, 
    nextFeature, 
    setHoveredFeature, 
    setGlitchIntensity 
  } = useUIStore();
  
  // Initialize cursor trails with dynamic size
  useEffect(() => {
    const trailLength = 20;
    const initialPoints = Array(trailLength).fill(0).map((_, i) => ({
      x: 100,
      y: 100,
      id: i,
      opacity: 1 - (i / trailLength)
    }));
    setTrailPoints(initialPoints);
  }, []);

  // Create Neural connection transition between features
  const createNeuralConnection = (startX: number, startY: number, endX: number, endY: number) => {
    if (!svgRef.current) return;
    
    // Create connection path
    const connection = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const id = `neural-${Date.now()}`;
    connection.setAttribute("id", id);
    connection.setAttribute("stroke", "rgba(0, 255, 255, 0.6)");
    connection.setAttribute("stroke-width", "1.5");
    connection.setAttribute("fill", "none");
    connection.setAttribute("stroke-linecap", "round");
    connection.setAttribute("filter", "url(#glow-filter)");
    
    // Path control points
    const dx = endX - startX;
    const dy = endY - startY;
    const ctrlX1 = startX + dx * 0.25 + (Math.random() - 0.5) * 100;
    const ctrlY1 = startY + dy * 0.1 + (Math.random() - 0.5) * 50;
    const ctrlX2 = startX + dx * 0.75 + (Math.random() - 0.5) * 100;
    const ctrlY2 = startY + dy * 0.9 + (Math.random() - 0.5) * 50;
    
    // Bezier curve path
    connection.setAttribute("d", `M${startX},${startY} C${ctrlX1},${ctrlY1} ${ctrlX2},${ctrlY2} ${endX},${endY}`);
    connection.setAttribute("stroke-dasharray", "0 " + (dx * 2));
    connection.setAttribute("opacity", "0");
    
    svgRef.current.appendChild(connection);
    
    // Animate path with GSAP
    gsap.to(`#${id}`, { strokeDasharray: `${dx * 2} 0`, opacity: 1, duration: 0.5 });
    
    // Add data particles flowing through the path
    for (let i = 0; i < 3; i++) {
      const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const particleId = `particle-${Date.now()}-${i}`;
      particle.setAttribute("id", particleId);
      particle.setAttribute("r", "2");
      particle.setAttribute("fill", "white");
      particle.setAttribute("filter", "url(#particle-glow)");
      particle.setAttribute("opacity", "0");
      
      svgRef.current.appendChild(particle);
      
      // Animate particle along path
      gsap.to(`#${particleId}`, { 
        opacity: 1, 
        delay: 0.1 + i * 0.2,
        duration: 0.2
      });
      
      gsap.to(`#${particleId}`, {
        motionPath: {
          path: `#${id}`,
          align: `#${id}`,
          alignOrigin: [0.5, 0.5]
        },
        duration: 1 + Math.random(),
        delay: 0.1 + i * 0.2,
        ease: "power1.inOut",
        onComplete: () => {
          // Remove particle after animation
          if (svgRef.current && particle.parentNode === svgRef.current) {
            svgRef.current.removeChild(particle);
          }
        }
      });
    }
    
    // Remove path after delay
    setTimeout(() => {
      if (svgRef.current && connection.parentNode === svgRef.current) {
        gsap.to(`#${id}`, { 
          opacity: 0, 
          duration: 0.3,
          onComplete: () => {
            if (svgRef.current && connection.parentNode === svgRef.current) {
              svgRef.current.removeChild(connection);
            }
          }
        });
      }
    }, 2000);
  };

  // Autonomous cursor movement using GSAP
  useEffect(() => {
    if (!cursorRef.current) return;
    
    let visitedFeatures = new Set<number>();
    let currentTourStep = 0;
    
    // Main animation sequence
    const animateCursor = () => {
      // Select next feature to visit (with randomization)
      let nextFeatureIndex: number;
      
      if (visitedFeatures.size >= features.length) {
        // Reset for a new tour if all features were visited
        visitedFeatures = new Set<number>();
        currentTourStep = 0;
      }
      
      // Get unvisited features first, then allow revisiting
      const unvisitedFeatures = features
        .map((_, idx: number) => idx)
        .filter((idx: number) => !visitedFeatures.has(idx));
      
      if (unvisitedFeatures.length > 0) {
        // Prefer unvisited features, but randomize which one
        const randomIndex = Math.floor(Math.random() * unvisitedFeatures.length);
        nextFeatureIndex = unvisitedFeatures[randomIndex];
      } else {
        // All features visited, pick a random one for variety
        nextFeatureIndex = Math.floor(Math.random() * features.length);
      }
      
      // Mark as visited and increment tour step
      visitedFeatures.add(nextFeatureIndex);
      currentTourStep = (currentTourStep + 1) % (features.length + 1);
      setTourStep(currentTourStep);
      
      // Get feature position
      const feature = features[nextFeatureIndex];
      const featureX = feature.x; 
      const featureY = feature.y;
      
      // Current cursor position
      const currentX = parseFloat(cursorRef.current.style.left) || cursorPosition.x;
      const currentY = parseFloat(cursorRef.current.style.top) || cursorPosition.y;
      
      // Setup timeline for feature visit
      const timeline = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            animateCursor();
          }, 1000 + Math.random() * 1000); // Random delay between features
        }
      });
      
      // Create neural connection to next feature
      createNeuralConnection(currentX, currentY, featureX, featureY);
      
      // Apply slight glitch effect before movement
      setGlitchIntensity(0.3);
      setTimeout(() => setGlitchIntensity(0), 200);
      
      // Initial movement to position with slight variability
      timeline.to(cursorRef.current, {
        left: featureX + (Math.random() - 0.5) * 50,
        top: featureY + (Math.random() - 0.5) * 50,
        duration: 0.7 + Math.random() * 0.5,
        ease: "power2.inOut",
        onUpdate: updateCursorPosition
      });
      
      // Move directly to the feature
      timeline.to(cursorRef.current, {
        left: featureX,
        top: featureY,
        duration: 0.4,
        ease: "power2.inOut",
        onUpdate: updateCursorPosition,
        onComplete: () => {
          // Show tooltip
          setTooltip({
            id: nextFeatureIndex,
            text: feature.description,
            position: { 
              x: featureX + 20, 
              y: featureY - 10 
            },
            featureId: feature.id
          });
          
          // Change store's current feature
          nextFeature();
          
          // Simulate hover effect
          setHoveredFeature(feature.id);
          
          // Trigger hover glitch
          setHoverGlitch(true);
          setTimeout(() => setHoverGlitch(false), 300);
          
          // Simulate click
          setTimeout(() => {
            setIsClicking(true);
            setGlitchIntensity(0.5);
            setTimeout(() => {
              setIsClicking(false);
              setGlitchIntensity(0);
            }, 200);
          }, 500);
          
          // Hide tooltip and hover effect after delay
          setTimeout(() => {
            setTooltip(null);
            setHoveredFeature(null);
          }, 2500);
        }
      });
      
      // Small movements around the feature to simulate interest
      timeline.to(cursorRef.current, {
        left: featureX + (Math.random() - 0.5) * 20,
        top: featureY + (Math.random() - 0.5) * 20,
        duration: 1,
        ease: "power1.inOut",
        onUpdate: updateCursorPosition
      });
      
      // Move slightly away before going to next feature
      timeline.to(cursorRef.current, {
        left: featureX + (Math.random() - 0.5) * 40,
        top: featureY + (Math.random() - 0.5) * 40,
        duration: 0.5,
        ease: "power1.inOut",
        onUpdate: updateCursorPosition
      });
    };
    
    // Update cursor position function with improved smoothing
    const updateCursorPosition = () => {
      if (cursorRef.current) {
        const rect = cursorRef.current.getBoundingClientRect();
        const newPosition = { 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2 
        };
        
        setCursorPosition(newPosition);
        cursorX.set(newPosition.x);
        cursorY.set(newPosition.y);
        
        // Update trail points with proper easing
        setTrailPoints(prev => {
          const updated = [...prev];
          // Shift all points down
          for (let i = updated.length - 1; i > 0; i--) {
            updated[i] = { 
              ...updated[i - 1], 
              id: updated[i].id,
              // Gradually decrease opacity for trail fade effect
              opacity: updated[i].opacity * 0.95 
            };
          }
          // Add current position to front
          updated[0] = { 
            x: newPosition.x, 
            y: newPosition.y, 
            id: updated[0].id,
            opacity: 1
          };
          return updated;
        });
      }
    };
    
    // Update SVG path for trail with smoother curves
    const updateTrail = () => {
      if (!pathRef.current || trailPoints.length < 2) return;
      
      // Create a smooth curve through points
      let pathData = `M ${trailPoints[0].x},${trailPoints[0].y}`;
      
      // Use quadratic curves for smoother trail
      for (let i = 1; i < trailPoints.length - 1; i++) {
        const xc = (trailPoints[i].x + trailPoints[i + 1].x) / 2;
        const yc = (trailPoints[i].y + trailPoints[i + 1].y) / 2;
        pathData += ` Q ${trailPoints[i].x},${trailPoints[i].y} ${xc},${yc}`;
      }
      
      pathRef.current.setAttribute('d', pathData);
    };
    
    // Call trail update when points change
    const trailInterval = setInterval(updateTrail, 16);
    
    // Start tour after delay
    const startTimeout = setTimeout(() => {
      startTour();
      animateCursor();
    }, 1000);
    
    return () => {
      clearTimeout(startTimeout);
      clearInterval(trailInterval);
    };
  }, [features, startTour, nextFeature, setHoveredFeature, cursorPosition, setGlitchIntensity]);

  return (
    <>
      {/* Progress indicator */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded shadow-md border border-[rgba(var(--accent-electric),0.3)]">
          <span className="tech-text text-xs">
            FEATURE TOUR <span className="text-[rgb(var(--accent-electric))]">{tourStep}/{features.length}</span>
          </span>
        </div>
      </div>
      
      {/* Cursor */}
      <motion.div 
        ref={cursorRef}
        className={`fixed z-50 pointer-events-none ${isClicking ? 'cursor-clicking' : 'cursor-moving'}`}
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          width: '24px',
          height: '24px',
        }}
      >
        {/* Cursor glow effect */}
        <motion.div 
          className="absolute -inset-4 rounded-full bg-[rgba(var(--accent-neon),0.08)]"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ 
            scale: hoverGlitch ? [0.8, 1.2, 0.9] : 1,
            opacity: hoverGlitch ? [0.6, 1, 0.6] : 0.6 
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Outer glow */}
        <motion.div 
          className="absolute -inset-2 rounded-full bg-[rgba(var(--accent-neon),0.15)]" 
          animate={{ 
            scale: isClicking ? [1, 1.3, 1] : 1
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Main cursor circle */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[rgba(var(--accent-neon),0.7)]"
          animate={{
            scale: isClicking ? 0.8 : 1
          }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Inner highlight */}
        <div className="absolute inset-1 rounded-full bg-white opacity-50" />
        
        {/* Cursor glitch effect */}
        {hoverGlitch && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
      
      {/* Cursor trail with SVG effects */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <svg ref={svgRef} width="100%" height="100%">
          {/* Gradient and filter definitions */}
          <defs>
            <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 220, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(0, 220, 255, 0)" />
            </linearGradient>
            
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Main cursor trail */}
          <path
            ref={pathRef}
            stroke="url(#trailGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow-filter)"
          />
          
          {/* Trailing dots for visual effect */}
          {trailPoints.map((point, i) => (
            i % 3 === 0 && i > 0 && (
              <circle
                key={`dot-${point.id}`}
                cx={point.x}
                cy={point.y}
                r={2 * (1 - i / trailPoints.length)}
                fill="rgba(0, 220, 255, 0.5)"
                opacity={point.opacity * 0.6}
              />
            )
          ))}
        </svg>
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            key={tooltip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 pointer-events-none tooltip-callout"
            style={{ 
              left: tooltip.position.x, 
              top: tooltip.position.y,
              maxWidth: "250px"
            }}
          >
            <div className="bg-[rgba(0,0,0,0.8)] backdrop-blur-sm text-white p-3 rounded-lg border border-[rgb(var(--accent-electric))] font-mono text-sm shadow-lg">
              <div className="flex items-center mb-1 space-x-1">
                <div className="w-1 h-1 bg-[rgb(var(--accent-neon))] rounded-full pulse-glow" />
                <span className="text-xs text-[rgb(var(--accent-neon))]">FEATURE.ID_{tooltip.featureId}</span>
              </div>
              <p className="text-white/90">{tooltip.text}</p>
              
              {/* Data stream animation */}
              <div className="mt-3 h-px w-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-transparent via-[rgb(var(--accent-neon))] to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Feature highlight flash - appears momentarily when clicking */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 pointer-events-none z-30 bg-[rgb(var(--accent-neon))]"
          />
        )}
      </AnimatePresence>
      
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 scanline-effect opacity-10"></div>
      </div>
    </>
  );
};
'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { useUIStore } from '@/store/uiStore';

interface CircuitNode {
  x: number;
  y: number;
  size: number;
  pulseSpeed: number;
  pulseDelay: number;
  id: string;
}

interface CircuitLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  animated: boolean;
  duration: number;
  delay: number;
}

export const CircuitBackground = () => {
  const { glitchIntensity } = useUIStore();
  const [nodes, setNodes] = useState<CircuitNode[]>([]);
  const [lines, setLines] = useState<CircuitLine[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Initialize circuit patterns
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Update dimensions on mount
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Generate circuit nodes
    const generateNodes = () => {
      const newNodes: CircuitNode[] = [];
      const nodeDensity = 150; // Number of nodes
      
      for (let i = 0; i < nodeDensity; i++) {
        newNodes.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * 2 + 1,
          pulseSpeed: 1 + Math.random() * 3,
          pulseDelay: Math.random() * 5,
          id: `node-${i}`
        });
      }
      
      setNodes(newNodes);
    };
    
    // Generate circuit connections
    const generateLines = () => {
      const newLines: CircuitLine[] = [];
      const numLines = 120;
      
      for (let i = 0; i < numLines; i++) {
        const startX = Math.random() * dimensions.width;
        const startY = Math.random() * dimensions.height;
        const angle = Math.random() * Math.PI * 2;
        const length = 50 + Math.random() * 150;
        
        newLines.push({
          x1: startX,
          y1: startY,
          x2: startX + Math.cos(angle) * length,
          y2: startY + Math.sin(angle) * length,
          id: `line-${i}`,
          animated: Math.random() > 0.5,
          duration: 2 + Math.random() * 8,
          delay: Math.random() * 5
        });
      }
      
      setLines(newLines);
    };
    
    generateNodes();
    generateLines();
    
    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Occasional regeneration of some elements
    const regenerationInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // Regenerate a few random lines
        setLines(prev => {
          const newLines = [...prev];
          for (let i = 0; i < 5; i++) {
            const index = Math.floor(Math.random() * newLines.length);
            const startX = Math.random() * dimensions.width;
            const startY = Math.random() * dimensions.height;
            const angle = Math.random() * Math.PI * 2;
            const length = 50 + Math.random() * 150;
            
            newLines[index] = {
              x1: startX,
              y1: startY,
              x2: startX + Math.cos(angle) * length,
              y2: startY + Math.sin(angle) * length,
              id: `line-${Date.now()}-${i}`,
              animated: Math.random() > 0.5,
              duration: 2 + Math.random() * 8,
              delay: Math.random() * 5
            };
          }
          return newLines;
        });
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(regenerationInterval);
    };
  }, [dimensions.height, dimensions.width]);
  
  // Apply mouse influence to nearby lines
  useEffect(() => {
    if (mousePosition.x === 0 && mousePosition.y === 0) return;
    
    setLines(prev => {
      return prev.map(line => {
        // Check if line is close to mouse
        const lineCenterX = (line.x1 + line.x2) / 2;
        const lineCenterY = (line.y1 + line.y2) / 2;
        
        const distance = Math.sqrt(
          Math.pow(lineCenterX - mousePosition.x, 2) + 
          Math.pow(lineCenterY - mousePosition.y, 2)
        );
        
        // If line is close to mouse, adjust it slightly
        if (distance < 200) {
          const influence = (200 - distance) / 200 * 0.2;
          const angle = Math.atan2(mousePosition.y - lineCenterY, mousePosition.x - lineCenterX);
          
          return {
            ...line,
            x2: line.x2 + Math.cos(angle) * influence * 20,
            y2: line.y2 + Math.sin(angle) * influence * 20
          };
        }
        
        return line;
      });
    });
  }, [mousePosition]);
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[rgb(var(--background))]" />
      
      {/* Circuit grid pattern */}
      <div className="absolute inset-0 circuit-grid opacity-70" />
      
      {/* Circuit SVG elements */}
      <svg 
        ref={svgRef}
        width="100%"
        height="100%"
        className="absolute inset-0"
      >
        {/* Gradient definitions - pure monochrome */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
          </linearGradient>
          
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.6)" />
          </linearGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Circuit lines */}
        {lines.map(line => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#lineGradient)"
            strokeWidth={Math.random() > 0.7 ? 1.5 : 1}
            strokeOpacity={0.5 + Math.random() * 0.3}
            strokeDasharray={Math.random() > 0.7 ? "4 2" : ""}
            className={line.animated ? "animate-pulse" : ""}
            style={{
              animationDuration: `${line.duration}s`,
              animationDelay: `${line.delay}s`,
              filter: Math.random() > 0.8 ? "url(#glow)" : ""
            }}
          />
        ))}
        
        {/* Circuit nodes */}
        {nodes.map(node => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill="url(#nodeGradient)"
            className="animate-pulse"
            style={{
              animationDuration: `${node.pulseSpeed}s`,
              animationDelay: `${node.pulseDelay}s`,
              filter: "url(#glow)"
            }}
          />
        ))}
        
        {/* Random glitch effect when glitchIntensity > 0 */}
        {glitchIntensity > 0 && Array.from({ length: 5 }).map((_, i) => {
          const x = Math.random() * dimensions.width;
          const y = Math.random() * dimensions.height;
          const width = 20 + Math.random() * 100;
          const height = 2 + Math.random() * 10;
          
          return (
            <rect
              key={`glitch-${i}-${Date.now()}`}
              x={x}
              y={y}
              width={width}
              height={height}
              fill="rgba(255, 255, 255, 0.3)"
              style={{ 
                opacity: glitchIntensity * 0.7,
                filter: "url(#glow)"
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Keep the fallback for SSR
export const CircuitBackgroundFallback = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[rgb(var(--background))]" />
      <div className="absolute inset-0 circuit-grid opacity-70" />
    </div>
  );
};
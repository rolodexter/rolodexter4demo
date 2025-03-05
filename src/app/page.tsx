'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { FeatureTour } from '@/components/core/FeatureTour';
import { CursorSimulation } from '@/components/core/CursorSimulation';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import CircuitBackground component with dynamic import
// The ssr: false option ensures it only loads on the client side
const CircuitBackground = dynamic(
  () => import('@/components/three/CircuitBackground').then(mod => mod.CircuitBackground),
  { ssr: false }
);

// Create a simple fallback component for the circuit background
const CircuitBackgroundFallback = () => (
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-black" />
    <div className="absolute inset-0 circuit-grid opacity-70" />
  </div>
);

export default function Home() {
  const { setGlitchIntensity } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const [clientSideLoaded, setClientSideLoaded] = useState(false);

  // Mark when client-side code is running
  useEffect(() => {
    setClientSideLoaded(true);
  }, []);

  // Cyberpunk-style boot sequence
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  // Occasional glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchIntensity(Math.random());
        setTimeout(() => setGlitchIntensity(0), 200);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, [setGlitchIntensity]);

  // Neural network animated background connections
  const NeuralConnections = () => {
    const [connections, setConnections] = useState<JSX.Element[]>([]);
    const connectionIdCounterRef = useRef(0);

    useEffect(() => {
      // Generate random connections in the background
      const generateConnections = () => {
        if (!headerRef.current) return;
        
        const headerRect = headerRef.current.getBoundingClientRect();
        const newConnections: JSX.Element[] = [];
        
        // Create 10 random connections
        for (let i = 0; i < 10; i++) {
          const startX = Math.random() * window.innerWidth;
          const startY = Math.random() * headerRect.bottom;
          const angle = Math.random() * Math.PI * 2;
          const length = 50 + Math.random() * 150;
          const endX = startX + Math.cos(angle) * length;
          const endY = startY + Math.sin(angle) * length;
          const duration = 3 + Math.random() * 5;
          const delay = Math.random() * 2;
          const opacity = 0.1 + Math.random() * 0.2;
          
          // Generate a truly unique key using a counter reference
          const uniqueId = `neural-${connectionIdCounterRef.current++}`;
          
          newConnections.push(
            <motion.div
              key={uniqueId}
              className="absolute pointer-events-none"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration, 
                delay,
                ease: "easeInOut"
              }}
              style={{
                left: startX,
                top: startY,
                width: length,
                height: '1px',
                background: `linear-gradient(90deg, rgba(var(--accent-neon), ${opacity}), rgba(var(--accent-neon), 0))`,
                transformOrigin: 'left',
                transform: `rotate(${angle * (180 / Math.PI)}deg)`
              }}
            />
          );
        }
        
        // Use a function updater to ensure we have the latest state
        setConnections(prev => {
          const combined = [...newConnections, ...prev].slice(0, 20);
          // Make sure no duplicates exist in the combined array
          return combined.filter((conn, index, self) => 
            index === self.findIndex((c) => c.key === conn.key)
          );
        });
      };
      
      // Generate new connections every couple of seconds
      const connectionInterval = setInterval(generateConnections, 2000);
      generateConnections(); // Initial connections
      
      return () => clearInterval(connectionInterval);
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence>
          {connections}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Boot sequence overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[rgb(var(--background))] flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="font-mono text-2xl text-[rgb(var(--accent-electric))]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              INITIALIZING ROLODEXTER.CORE
            </motion.div>
            <motion.div
              className="mt-4 w-64 h-1 bg-foreground/10 rounded-full overflow-hidden"
              initial={{ width: '10%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <motion.div
                className="h-full bg-[rgb(var(--accent-electric))]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.3, duration: 1 }}
              />
            </motion.div>
            <motion.div
              className="mt-2 font-mono text-xs text-foreground/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              LOADING UI COMPONENTS...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative min-h-screen bg-[rgb(var(--background))] data-noise">
        {/* Circuit Background */}
        <div className="fixed inset-0 pointer-events-none">
          {clientSideLoaded ? (
            <Suspense fallback={<CircuitBackgroundFallback />}>
              <CircuitBackground />
            </Suspense>
          ) : (
            <CircuitBackgroundFallback />
          )}
        </div>

        {/* Neural network connections */}
        <NeuralConnections />

        {/* CRT Scan effect overlay */}
        <div className="crt-overlay"></div>
        
        {/* Cursor Simulation */}
        <CursorSimulation />
        
        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <header ref={headerRef} className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <div className="relative">
                <h1 className="font-mono text-4xl mb-4 glitch-text">
                  ROLODEXTER<span className="text-[rgb(var(--accent-neon))]">.CORE</span>
                </h1>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent-electric))] to-transparent"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative w-32 h-6 bg-foreground/5 rounded overflow-hidden">
                  <div className="data-stream w-full h-1 absolute top-1/2 -translate-y-1/2 rounded-full">
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-end">
                      <span className="font-mono text-xs text-foreground/40 mr-2">SYSTEM ACTIVE</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={`pulse-${i}`}
                      className="w-1 h-4 bg-[rgb(var(--accent-electric))] bg-opacity-50 rounded-full"
                      animate={{
                        scaleY: [0.5, 1, 0.5],
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <p className="text-foreground/60 max-w-2xl">
                Next-generation network visualization and blockchain monitoring system.
                Explore the features below to understand the capabilities of this advanced platform.
              </p>
              
              {/* Animated data stream under text */}
              <div className="mt-3 h-px w-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-transparent via-[rgb(var(--accent-electric))] to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </div>
            </div>
          </header>

          {/* Feature Tour */}
          <div className="h-[600px] w-full">
            <FeatureTour />
          </div>

          {/* System Status */}
          <footer className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-foreground/5 z-20">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full bg-[rgb(var(--accent-electric))] pulse-glow" />
                  <span className="status-text">SYSTEM.ONLINE</span>
                </div>
                <div className="w-px h-4 bg-foreground/10" />
                <span className="status-text">VER.4.0.1</span>
                <div className="w-px h-4 bg-foreground/10" />
                <div className="relative overflow-hidden rounded-full w-20 h-1 bg-foreground/5">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[rgb(var(--accent-neon))] bg-opacity-60"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{
                      duration: 8,
                      ease: "linear",
                      repeat: Infinity
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="status-text">NETWORK.STATUS:</span>
                <span className="text-[rgb(var(--accent-neon))] font-mono text-xs">OPTIMAL</span>
                <motion.span
                  className="inline-block ml-1 w-1 h-1 bg-[rgb(var(--accent-neon))] rounded-full pulse-glow"
                  animate={{
                    opacity: [1, 0.3, 1],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}

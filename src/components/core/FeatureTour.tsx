'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Start tour on mount
  useEffect(() => {
    startTour();
    // Random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchIntensity(Math.random());
        setTimeout(() => setGlitchIntensity(0), 200);
      }
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, [startTour, setGlitchIntensity]);

  // Handle feature transitions
  useEffect(() => {
    if (isTouring) {
      const timer = setTimeout(() => {
        nextFeature();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTouring, currentFeature, nextFeature]);

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
          {Math.round(tourProgress)}%
        </span>
      </div>

      {/* Feature Boxes */}
      <div className="grid grid-cols-2 gap-8 p-8">
        {features.map((feature: Feature, index: number) => (
          <motion.div
            key={feature.id}
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
          >
            <div className="relative z-10">
              <h3 className="text-lg font-mono mb-2 glitch-text">
                {feature.text}
              </h3>
              <p className="text-sm text-foreground/60">
                {feature.description}
              </p>
            </div>

            {/* Circuit Grid */}
            <div className="circuit-grid" />

            {/* Scanner Effect when active */}
            {currentFeature === index && (
              <div className="absolute inset-0 scanner-effect" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Neural Connections */}
      <AnimatePresence>
        {hoveredFeature && features.map((feature: Feature) => {
          if (feature.id === hoveredFeature) return null;
          const sourceFeature = features.find((f: Feature) => f.id === hoveredFeature);
          if (!sourceFeature) return null;

          return (
            <motion.div
              key={`${hoveredFeature}-${feature.id}`}
              className="neural-connection"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                height: '2px',
                transformOrigin: 'left',
                left: sourceFeature.x,
                top: sourceFeature.y,
                width: Math.hypot(
                  feature.x - sourceFeature.x,
                  feature.y - sourceFeature.y
                ),
                transform: `rotate(${Math.atan2(
                  feature.y - sourceFeature.y,
                  feature.x - sourceFeature.x
                )}rad)`
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Status Text */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <div className="w-1 h-1 rounded-full bg-[rgb(var(--accent-electric))] pulse-glow" />
        <span className="status-text">
          {isTouring ? 'SCANNING.FEATURES' : 'SCAN.COMPLETE'}
        </span>
      </div>
    </div>
  );
}; 
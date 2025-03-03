'use client';

import Link from 'next/link';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Home() {
  const cursorControls = useAnimation();
  const tooltipControls = useAnimation();
  const [currentFeature, setCurrentFeature] = useState<number>(0);
  const [tourStarted, setTourStarted] = useState(false);
  const [tourStep, setTourStep] = useState<number>(1);

  // Define feature positions and descriptions
  const features = [
    {
      position: { x: '25%', y: '35%' },
      text: 'network_graph',
      description: 'real-time visualization of network connections',
      link: '/network'
    },
    {
      position: { x: '75%', y: '35%' },
      text: 'blockchain_layer',
      description: 'live blockchain transaction monitoring',
      link: '/blockchain'
    },
    {
      position: { x: '25%', y: '75%' },
      text: 'user_presence',
      description: 'track active users and their status',
      link: '/users'
    },
    {
      position: { x: '75%', y: '75%' },
      text: 'cursor_simulation',
      description: 'multi-user interaction visualization',
      link: '/cursors'
    }
  ];

  // Shuffle array helper
  const shuffleArray = (array: typeof features) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start the feature tour
  useEffect(() => {
    const startTour = async () => {
      setTourStarted(true);
      
      // Initial appearance
      await cursorControls.start({
        x: '50%',
        y: '50%',
        opacity: 1,
        transition: { duration: 0.2 }
      });

      while (true) {
        const shuffledFeatures = shuffleArray(features);
        
        for (let i = 0; i < shuffledFeatures.length; i++) {
          setCurrentFeature(i);
          setTourStep(i + 1);
          
          // Move to feature
          await cursorControls.start({
            x: shuffledFeatures[i].position.x,
            y: shuffledFeatures[i].position.y,
            scale: 1.2,
            transition: {
              type: "spring",
              duration: 0.5,
              bounce: 0.2
            }
          });

          // Show tooltip
          await tooltipControls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.2 }
          });

          // Brief pause
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Hide tooltip
          await tooltipControls.start({
            opacity: 0,
            y: 5,
            transition: { duration: 0.2 }
          });

          // Reset cursor
          await cursorControls.start({
            scale: 1,
            transition: { duration: 0.2 }
          });
        }

        // Return to center
        await cursorControls.start({
          x: '50%',
          y: '50%',
          transition: { duration: 0.5 }
        });

        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    startTour();
  }, []);

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-mono text-foreground mb-4">
          Test Page
        </h1>
        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <p className="text-foreground">
            If you can see this styled properly, Tailwind is working!
          </p>
        </div>
      </div>
    </main>
  );
}

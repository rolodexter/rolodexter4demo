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
    <main className="min-h-screen bg-white text-black p-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto relative"
      >
        <header className="text-center mb-24">
          <h1 className="text-7xl font-light tracking-tight mb-6">
            rolodexter4
          </h1>
          <p className="text-xl font-mono opacity-60 tracking-wide">
            [ver.4.0.0]
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link}>
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}
                animate={currentFeature === index ? {
                  scale: [1, 1.03, 1],
                  transition: { duration: 0.3 }
                } : {}}
                className={`bg-white p-8 border-2 border-black transition-all
                          ${currentFeature === index ? 
                            'border-opacity-100 shadow-lg' : 
                            'border-opacity-20'
                          } hover:border-opacity-100`}
              >
                <div className="text-center">
                  <h2 className="text-2xl font-light tracking-wide mb-3">
                    [{feature.text}]
                  </h2>
                  <p className="font-mono text-sm opacity-60">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Animated cursor with tooltip */}
        <motion.div
          initial={{ x: '50%', y: '50%', scale: 1, opacity: 0 }}
          animate={cursorControls}
          className="fixed pointer-events-none z-50"
        >
          <div className="relative">
            {/* Cursor icon */}
            <div className="absolute -left-2 -top-2 w-4 h-4 border-2 border-black" />
            
            {/* Tooltip */}
            <AnimatePresence>
              {tourStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={tooltipControls}
                  className="absolute left-8 top-0 whitespace-nowrap bg-black text-white 
                            font-mono text-sm px-3 py-2 shadow-lg"
                >
                  [{features[currentFeature].text}] {'>'} {features[currentFeature].description}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="fixed top-6 right-8 font-mono text-sm tracking-wide">
          <span className="opacity-40">tour_progress {'>'}</span>
          <span className="ml-2 opacity-80">{tourStep}/4</span>
          <span className="ml-2 opacity-40">{'>'} random_sequence</span>
        </div>

        {/* Status bar */}
        <div className="fixed bottom-0 left-0 w-full py-4 px-8 font-mono text-sm 
                      opacity-60 text-center border-t border-black/20">
          system.status {'>'} tour_active {'>'} autonomous_navigation
        </div>

        {/* Global styles */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </motion.div>
    </main>
  );
}

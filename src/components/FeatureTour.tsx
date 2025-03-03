'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FeatureTour() {
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

  // Start the feature tour
  useEffect(() => {
    console.log('Starting tour effect');
    const startTour = async () => {
      console.log('Tour started');
      setTourStarted(true);
      
      // Initial appearance
      await cursorControls.start({
        x: '50%',
        y: '50%',
        opacity: 1,
        transition: { duration: 0.2 }
      });

      while (true) {
        for (let i = 0; i < features.length; i++) {
          console.log(`Moving to feature ${i}: ${features[i].text}`);
          setCurrentFeature(i);
          setTourStep(i + 1);
          
          // Move to feature
          await cursorControls.start({
            x: features[i].position.x,
            y: features[i].position.y,
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

          await new Promise(resolve => setTimeout(resolve, 2000));

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

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    startTour();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-foreground/10 p-2">
        <div className="container mx-auto">
          <div className="tech-text text-sm text-accent">
            ●[system.status: active] {'>'} tour_active {'>'} step_{tourStep}/4
          </div>
        </div>
      </div>

      {/* Neural Network Connection Lines */}
      <div className="fixed inset-0 pointer-events-none">
        {features.map((feature, index) => (
          <div key={`connection-${index}`} className="connection-line">
            <div className="absolute w-1 h-1 rounded-full bg-accent/30 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Feature Boxes */}
      <div className="relative container mx-auto min-h-screen pt-16">
        {features.map((feature, index) => (
          <Link href={feature.link} key={feature.text}>
            <motion.div
              className="feature-box absolute w-64 p-4 cursor-pointer"
              style={{
                left: feature.position.x,
                top: feature.position.y,
                transform: 'translate(-50%, -50%)',
                opacity: currentFeature === index ? 1 : 0.4,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="tech-text text-accent mb-2">
                [{feature.text}]
              </h3>
              <p className="text-foreground/80 text-sm">
                {feature.description}
              </p>
            </motion.div>
          </Link>
        ))}

        {/* Animated Cursor */}
        <motion.div
          className="absolute w-6 h-6 pointer-events-none z-50"
          style={{
            left: 0,
            top: 0,
            x: '50%',
            y: '50%',
          }}
          animate={cursorControls}
          initial={{ opacity: 0 }}
        >
          <div className="w-full h-full rounded-full border-2 border-accent animate-pulse" />
        </motion.div>

        {/* Tooltip */}
        <motion.div
          className="tech-tooltip absolute px-4 py-2 pointer-events-none z-50"
          style={{
            left: '50%',
            top: '60%',
            x: '-50%',
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={tooltipControls}
        >
          {features[currentFeature]?.text} {'>'} {features[currentFeature]?.description}
        </motion.div>
      </div>
    </div>
  );
} 
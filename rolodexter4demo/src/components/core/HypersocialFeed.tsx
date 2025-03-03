/**
 * HypersocialFeed Component
 * 
 * A high-performance, visually intense feed component that simulates billions of users
 * interacting in real-time. This component implements several key technical features:
 * 
 * 1. Infinite Data Stream Generation
 *    - Uses a high-frequency interval (100ms) to generate new posts
 *    - Implements a sliding window (last 100 posts) to prevent memory issues
 *    - Simulates realistic user interactions with randomized metrics
 * 
 * 2. Performance Optimizations
 *    - Uses AnimatePresence for efficient DOM updates
 *    - Implements GSAP ScrollTrigger for optimized scroll animations
 *    - Maintains a fixed number of posts to prevent performance degradation
 * 
 * 3. Visual Effects
 *    - Implements scanline and noise effects for cyberpunk aesthetic
 *    - Uses Framer Motion for smooth post transitions
 *    - Generates glitch effects on text and avatars
 * 
 * 4. Technical Decisions
 *    - Chose GSAP for complex animations due to its performance and control
 *    - Selected Framer Motion for component-level animations for its React integration
 *    - Implemented custom glitch text generation for unique visual effects
 * 
 * @component
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins for enhanced animation capabilities
gsap.registerPlugin(ScrollTrigger);

/**
 * Post Interface
 * 
 * Defines the structure of a social post with:
 * - Unique identifier for React key prop
 * - Content with glitch effects
 * - Timestamp for relative time display
 * - Author information with shifting identity
 * - Interaction metrics for social proof
 */
interface Post {
  id: string;
  content: string;
  timestamp: number;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  interactions: {
    likes: number;
    comments: number;
    shares: number;
  };
}

/**
 * HypersocialFeed Component
 * 
 * Implements a high-frequency social feed with the following features:
 * - Real-time post generation
 * - Optimized rendering with AnimatePresence
 * - GSAP-powered scroll animations
 * - Glitch effects and cyberpunk aesthetics
 */
export const HypersocialFeed: React.FC = () => {
  // Refs for GSAP animations and performance optimization
  const feedRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  /**
   * Infinite Data Stream Generator
   * 
   * Technical Implementation:
   * - Generates 10 new posts every 100ms
   * - Uses sliding window to maintain performance
   * - Implements cleanup on unmount
   */
  useEffect(() => {
    const generatePosts = () => {
      // Generate posts at high frequency
      const newPosts = Array.from({ length: 10 }, (_, i) => ({
        id: `post-${Date.now()}-${i}`,
        content: generateGlitchText(),
        timestamp: Date.now(),
        author: {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          name: generateGlitchText(20),
          avatar: generateGlitchAvatar(),
        },
        interactions: {
          likes: Math.floor(Math.random() * 10000),
          comments: Math.floor(Math.random() * 1000),
          shares: Math.floor(Math.random() * 500),
        },
      }));
      setPosts(prev => [...prev, ...newPosts].slice(-100)); // Keep last 100 posts
    };

    const interval = setInterval(generatePosts, 100); // Generate posts every 100ms
    setIsLoading(false);

    return () => clearInterval(interval);
  }, []);

  /**
   * GSAP Animation Setup
   * 
   * Technical Implementation:
   * - Uses ScrollTrigger for scroll-based animations
   * - Implements staggered animations for posts
   * - Handles cleanup with context revert
   */
  useEffect(() => {
    if (!feedRef.current) return;

    const ctx = gsap.context(() => {
      // Animate posts as they enter
      gsap.from('.post', {
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: feedRef.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      });
    }, feedRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={feedRef}
      className="relative w-full h-full overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Visual Effects Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanline" />
        <div className="noise" />
      </div>
      
      {/* Posts Container */}
      <div className="relative z-10 space-y-4 p-4">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="post bg-white/5 border border-white/10 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Author Section */}
              <div className="flex items-center space-x-2 mb-2">
                <motion.div
                  className="w-8 h-8 bg-white/10"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-white font-mono">{post.author.name}</span>
                <span className="text-white/50 text-sm">{formatTimestamp(post.timestamp)}</span>
              </div>
              
              {/* Post Content */}
              <p className="text-white font-mono mb-2">{post.content}</p>
              
              {/* Interaction Metrics */}
              <div className="flex space-x-4 text-white/70 text-sm">
                <span>{post.interactions.likes} likes</span>
                <span>{post.interactions.comments} comments</span>
                <span>{post.interactions.shares} shares</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * Utility Functions
 */

/**
 * Generates glitch text with random characters
 * Technical Implementation:
 * - Uses a predefined character set for cyberpunk aesthetic
 * - Generates random length strings for variety
 * - Optimized for performance with Array.from
 */
const generateGlitchText = (length: number = 50): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/**
 * Generates glitchy ASCII art avatars
 * Technical Implementation:
 * - Uses SVG for scalable vector graphics
 * - Implements Unicode block characters for ASCII art
 * - Optimizes with data URI format
 */
const generateGlitchAvatar = (): string => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="white"/>
      <text x="50%" y="50%" font-family="monospace" font-size="24" fill="black" text-anchor="middle" dominant-baseline="middle">
        ${String.fromCharCode(0x2580 + Math.floor(Math.random() * 8))}
      </text>
    </svg>
  `)}`;
};

/**
 * Formats timestamps into relative time
 * Technical Implementation:
 * - Uses millisecond-based calculations for precision
 * - Implements progressive time display (now, seconds, minutes, time)
 * - Optimized for performance with early returns
 */
const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  if (diff < 1000) return 'now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  return new Date(timestamp).toLocaleTimeString();
}; 
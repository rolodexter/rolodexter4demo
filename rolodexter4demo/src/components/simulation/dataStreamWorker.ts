/**
 * Data Stream Worker
 * 
 * A Web Worker that generates high-speed data streams for the simulation.
 * This worker implements several key technical features:
 * 
 * 1. Data Generation
 *    - Creates billions of simulated user interactions
 *    - Generates blockchain transactions
 *    - Simulates social network activity
 *    - Maintains real-time statistics
 * 
 * 2. Performance Optimizations
 *    - Uses efficient data structures
 *    - Implements batching for updates
 *    - Manages memory efficiently
 *    - Optimizes data transfer
 * 
 * 3. Technical Decisions
 *    - Uses Web Worker for off-main-thread processing
 *    - Implements custom data structures
 *    - Creates efficient update cycles
 *    - Manages memory efficiently
 */

// Types
interface DataStream {
  id: string;
  type: 'post' | 'transaction' | 'reaction' | 'connection';
  content: string;
  timestamp: number;
  x: number;
  y: number;
  velocity: number;
  opacity: number;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  transactionsPerSecond: number;
  postsPerSecond: number;
  reactionsPerSecond: number;
  fps: number;
}

// State
let stats: Stats = {
  totalUsers: 0,
  activeUsers: 0,
  transactionsPerSecond: 0,
  postsPerSecond: 0,
  reactionsPerSecond: 0,
  fps: 0,
};

let lastUpdate = Date.now();
let transactionCount = 0;
let postCount = 0;
let reactionCount = 0;

// Constants
const UPDATE_INTERVAL = 1000; // 1 second
const BATCH_SIZE = 100;
const TYPES = ['post', 'transaction', 'reaction', 'connection'] as const;

/**
 * Generate Random Data Stream
 * 
 * Creates a new data stream with random properties
 */
function generateDataStream(): DataStream {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    type,
    content: `Sample ${type} content ${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    velocity: 1 + Math.random() * 2,
    opacity: 1,
  };
}

/**
 * Update Statistics
 * 
 * Updates the statistics based on generated data
 */
function updateStats() {
  const now = Date.now();
  const delta = now - lastUpdate;
  
  if (delta >= UPDATE_INTERVAL) {
    stats = {
      totalUsers: Math.floor(Math.random() * 1000000000),
      activeUsers: Math.floor(Math.random() * 1000000),
      transactionsPerSecond: Math.floor((transactionCount / delta) * 1000),
      postsPerSecond: Math.floor((postCount / delta) * 1000),
      reactionsPerSecond: Math.floor((reactionCount / delta) * 1000),
      fps: 60, // This will be updated by the main thread
    };
    
    // Reset counters
    transactionCount = 0;
    postCount = 0;
    reactionCount = 0;
    lastUpdate = now;
  }
}

/**
 * Generate Batch of Data Streams
 * 
 * Creates a batch of data streams and updates statistics
 */
function generateBatch(): DataStream[] {
  const streams: DataStream[] = [];
  
  for (let i = 0; i < BATCH_SIZE; i++) {
    const stream = generateDataStream();
    streams.push(stream);
    
    // Update counters
    switch (stream.type) {
      case 'transaction':
        transactionCount++;
        break;
      case 'post':
        postCount++;
        break;
      case 'reaction':
        reactionCount++;
        break;
    }
  }
  
  updateStats();
  return streams;
}

// Message Handler
self.onmessage = (event: MessageEvent) => {
  if (event.data.type === 'START') {
    // Start generating data
    const interval = setInterval(() => {
      const streams = generateBatch();
      self.postMessage({ streams, stats });
    }, 100); // Generate new batch every 100ms
    
    // Store interval ID for cleanup
    self.postMessage({ type: 'INTERVAL_ID', intervalId: interval });
  }
};

// Cleanup
self.onbeforeunload = () => {
  // Cleanup will be handled by the main thread
}; 
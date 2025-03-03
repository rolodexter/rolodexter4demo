'use client';

import React, { useEffect, useState } from 'react';
import BlockchainLayer from '@/components/core/BlockchainLayer';
import { motion } from 'framer-motion';

// Generate a random hash
const generateHash = () => {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate random transaction data
const generateTransaction = () => ({
  id: `tx-${Math.random().toString(36).substr(2, 9)}`,
  from: `0x${Math.random().toString(36).substr(2, 40)}`,
  to: `0x${Math.random().toString(36).substr(2, 40)}`,
  amount: Math.random() * 10,
  timestamp: Date.now(),
  status: ['pending', 'confirmed', 'failed'][Math.floor(Math.random() * 3)] as 'pending' | 'confirmed' | 'failed'
});

// Generate random block data
const generateBlock = (previousHash: string) => {
  const transactions = Array.from(
    { length: Math.floor(Math.random() * 5) + 1 },
    generateTransaction
  );

  return {
    id: `block-${Math.random().toString(36).substr(2, 9)}`,
    transactions,
    timestamp: Date.now(),
    hash: generateHash(),
    previousHash
  };
};

// Generate initial blockchain data
const generateBlockchain = (length: number) => {
  const blockchain = [];
  let previousHash = generateHash();

  for (let i = 0; i < length; i++) {
    const block = generateBlock(previousHash);
    blockchain.push(block);
    previousHash = block.hash;
  }

  return blockchain;
};

export default function BlockchainPage() {
  const [blocks, setBlocks] = useState(() => generateBlockchain(5));
  const [selectedBlock, setSelectedBlock] = useState<any>(null);

  // Add new blocks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks(currentBlocks => {
        const newBlock = generateBlock(currentBlocks[currentBlocks.length - 1].hash);
        return [...currentBlocks, newBlock];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Blockchain Visualization</h1>
          <p className="text-center mb-8 text-gray-600">
            Real-time visualization of blockchain blocks and transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <BlockchainLayer
            width={1000}
            height={400}
            blocks={blocks}
            onBlockClick={setSelectedBlock}
          />
        </motion.div>

        {selectedBlock && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Block Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-gray-600">Hash</h3>
                <p className="font-mono text-sm">{selectedBlock.hash}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-600">Previous Hash</h3>
                <p className="font-mono text-sm">{selectedBlock.previousHash}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-600">Timestamp</h3>
                <p>{new Date(selectedBlock.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-600">Transactions</h3>
                <p>{selectedBlock.transactions.length}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-gray-600 mb-2">Transaction List</h3>
              <div className="space-y-2">
                {selectedBlock.transactions.map((tx: any) => (
                  <div
                    key={tx.id}
                    className="bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-bold">From:</span>{' '}
                        <span className="font-mono">{tx.from.slice(0, 10)}...</span>
                      </div>
                      <div>
                        <span className="font-bold">To:</span>{' '}
                        <span className="font-mono">{tx.to.slice(0, 10)}...</span>
                      </div>
                      <div>
                        <span className="font-bold">Amount:</span>{' '}
                        {tx.amount.toFixed(4)}
                      </div>
                      <div>
                        <span className="font-bold">Status:</span>{' '}
                        <span className={`
                          ${tx.status === 'confirmed' ? 'text-green-600' :
                            tx.status === 'pending' ? 'text-yellow-600' :
                            'text-red-600'}
                        `}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
} 
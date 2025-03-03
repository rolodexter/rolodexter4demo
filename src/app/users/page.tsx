'use client';

import React, { useEffect, useState } from 'react';
import UserPresence from '@/components/core/UserPresence';
import { motion } from 'framer-motion';

// Sample user data generator
const generateUser = (id: number) => {
  const names = [
    'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince',
    'Edward Stark', 'Fiona Apple', 'George Lucas', 'Hannah Montana'
  ];
  const activities = [
    'Viewing dashboard', 'Analyzing data', 'In a meeting',
    'Writing code', 'Reviewing PRs', 'Taking a break'
  ];
  const statuses: ('online' | 'away' | 'offline')[] = ['online', 'away', 'offline'];

  return {
    id: `user-${id}`,
    name: names[id % names.length],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    status: statuses[Math.floor(Math.random() * 3)],
    lastActive: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
    currentActivity: Math.random() > 0.3 ? activities[Math.floor(Math.random() * activities.length)] : undefined
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState(() =>
    Array.from({ length: 8 }, (_, i) => generateUser(i))
  );
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Update user statuses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(currentUsers =>
        currentUsers.map(user => ({
          ...user,
          status: Math.random() > 0.7 ? 'away' : user.status,
          lastActive: Math.random() > 0.8 ? new Date() : user.lastActive,
          currentActivity: Math.random() > 0.7
            ? ['Viewing dashboard', 'Analyzing data', 'In a meeting'][Math.floor(Math.random() * 3)]
            : user.currentActivity
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">User Activity Monitor</h1>
          <p className="text-gray-600">
            Track real-time user presence and activity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <UserPresence
              users={users}
              onUserClick={setSelectedUser}
              className="h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {selectedUser ? (
              <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h2 className="text-2xl font-bold mb-6">User Details</h2>
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                    <p className="text-gray-600">ID: {selectedUser.id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-600">Status</h4>
                    <p className={`
                      ${selectedUser.status === 'online' ? 'text-green-600' :
                        selectedUser.status === 'away' ? 'text-yellow-600' :
                        'text-gray-600'}
                    `}>
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-600">Last Active</h4>
                    <p>{selectedUser.lastActive.toLocaleString()}</p>
                  </div>

                  {selectedUser.currentActivity && (
                    <div>
                      <h4 className="font-semibold text-gray-600">Current Activity</h4>
                      <p>{selectedUser.currentActivity}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-600">Activity History</h4>
                    <div className="mt-2 space-y-2">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 p-2 rounded"
                        >
                          <p className="text-sm">
                            {['Viewed dashboard', 'Analyzed data', 'Attended meeting'][i]}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(Date.now() - (i + 1) * 3600000).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">Select a user to view details</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
} 
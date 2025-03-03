'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastActive: Date;
  currentActivity?: string;
}

interface UserPresenceProps {
  users?: User[];
  onUserClick?: (user: User) => void;
  className?: string;
}

const UserPresence: React.FC<UserPresenceProps> = ({
  users = [],
  onUserClick,
  className = ''
}) => {
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);

  // Sort users by status and last active time
  useEffect(() => {
    const sorted = [...users].sort((a, b) => {
      // First sort by status
      const statusOrder = { online: 0, away: 1, offline: 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Then sort by last active time
      return b.lastActive.getTime() - a.lastActive.getTime();
    });

    setSortedUsers(sorted);
  }, [users]);

  // Format time difference
  const getTimeAgo = (date: Date) => {
    const diff = new Date().getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  // Status indicator styles
  const getStatusStyle = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Active Users</h2>
      <div className="space-y-2">
        <AnimatePresence>
          {sortedUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onUserClick?.(user)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusStyle(
                    user.status
                  )}`}
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(user.lastActive)}
                  </span>
                </div>
                {user.currentActivity && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-600"
                  >
                    {user.currentActivity}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {sortedUsers.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-4"
        >
          No active users
        </motion.p>
      )}
    </div>
  );
};

export default UserPresence; 
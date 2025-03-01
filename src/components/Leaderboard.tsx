
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LeaderboardEntry } from '@/types/game';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentPlayerId: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentPlayerId }) => {
  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      
      <div className="space-y-3 flex-1 overflow-y-auto pb-4 no-scrollbar">
        {entries.map((entry, index) => {
          const isCurrentPlayer = entry.id === currentPlayerId;
          
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`p-3 ${isCurrentPlayer ? 'border-yoga border-2' : ''} flex items-center`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${index < 3 ? 'bg-yoga text-white' : 'bg-muted'}`}>
                  {entry.rank}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{entry.name} {isCurrentPlayer && '(You)'}</h3>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Level {entry.level}</span>
                    <span className="text-sm font-medium">{entry.energy.toLocaleString()} Energy</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;

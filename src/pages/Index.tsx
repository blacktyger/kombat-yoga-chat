
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import YogaClicker from '@/components/YogaClicker';
import Leaderboard from '@/components/Leaderboard';
import Settings from '@/components/Settings';
import { useGameState } from '@/hooks/useGameState';
import { getTelegramWebApp } from '@/utils/telegramWebApp';

const Index = () => {
  const {
    player,
    leaderboard,
    handleClick,
    buyYogaPose,
    buyUpgrade,
    resetGame,
    isInitialized
  } = useGameState();
  
  const [activeTab, setActiveTab] = useState('game');
  const [isLoading, setIsLoading] = useState(true);
  const telegram = getTelegramWebApp();

  useEffect(() => {
    // Initialize Telegram WebApp
    telegram.ready();
    
    // Simulate loading for a more polished feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">Kombat Yoga</h1>
          <p className="text-muted-foreground mb-8">Find your inner peace... and power</p>
          
          <div className="relative w-24 h-24 mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60" 
              alt="Yoga" 
              className="w-full h-full object-cover rounded-full opacity-60"
            />
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-orange-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      <main className="flex-1 flex flex-col">
        <Tabs defaultValue="game" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="game" className="flex-1 flex flex-col p-0 m-0">
            <YogaClicker
              energy={player.energy}
              totalEnergy={player.totalEnergy}
              level={player.level}
              experience={player.experience}
              yogaPoses={player.yogaPoses}
              upgrades={player.upgrades}
              onBuyPose={buyYogaPose}
              onBuyUpgrade={buyUpgrade}
              onClick={handleClick}
            />
          </TabsContent>
          
          <TabsContent value="leaderboard" className="flex-1 flex flex-col p-0 m-0">
            <Leaderboard entries={leaderboard} currentPlayerId={player.id} />
          </TabsContent>
          
          <TabsContent value="settings" className="flex-1 flex flex-col p-0 m-0">
            <Settings onReset={resetGame} />
          </TabsContent>
          
          <TabsList className="grid grid-cols-3 rounded-none border-t dark-glass backdrop-blur-sm">
            <TabsTrigger value="game" className="rounded-none pb-2 pt-2 data-[state=active]:bg-orange-500/20">
              <div className="flex flex-col items-center">
                <span className="text-lg">🧘</span>
                <span className="text-xs mt-1">Play</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="rounded-none pb-2 pt-2 data-[state=active]:bg-orange-500/20">
              <div className="flex flex-col items-center">
                <span className="text-lg">🏆</span>
                <span className="text-xs mt-1">Ranking</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none pb-2 pt-2 data-[state=active]:bg-orange-500/20">
              <div className="flex flex-col items-center">
                <span className="text-lg">⚙️</span>
                <span className="text-xs mt-1">Settings</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>
    </motion.div>
  );
};

export default Index;

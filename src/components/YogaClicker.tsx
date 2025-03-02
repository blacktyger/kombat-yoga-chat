
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { YogaPose, Upgrade } from '@/types/game';
import { Progress } from '@/components/ui/progress';
import { getTelegramWebApp } from '@/utils/telegramWebApp';

interface YogaClickerProps {
  energy: number;
  totalEnergy: number;
  level: number;
  experience: number;
  yogaPoses: YogaPose[];
  upgrades: Upgrade[];
  onBuyPose: (poseId: number) => void;
  onBuyUpgrade: (upgradeId: number) => void;
  onClick: () => void;
}

const YogaClicker: React.FC<YogaClickerProps> = ({
  energy,
  totalEnergy,
  level,
  experience,
  yogaPoses,
  upgrades,
  onBuyPose,
  onBuyUpgrade,
  onClick
}) => {
  const [isClicking, setIsClicking] = useState(false);
  const [energyParticles, setEnergyParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [particleId, setParticleId] = useState(0);
  const [activeTab, setActiveTab] = useState('play');
  const [showPoseInfo, setShowPoseInfo] = useState<number | null>(null);
  const [showUpgradeInfo, setShowUpgradeInfo] = useState<number | null>(null);
  
  const telegram = getTelegramWebApp();
  
  // Handle click animation
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClicking(true);
    onClick();
    
    // Add energy particle at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setEnergyParticles(prev => [...prev, { id: particleId, x, y }]);
    setParticleId(prev => prev + 1);
    
    // Reset clicking state after animation
    setTimeout(() => {
      setIsClicking(false);
    }, 150);
    
    // Remove particle after animation
    setTimeout(() => {
      setEnergyParticles(prev => prev.filter(p => p.id !== particleId));
    }, 1000);
  };
  
  // Get the active pose
  const activePose = yogaPoses.find(pose => pose.unlocked) || yogaPoses[0];
  
  // Calculate progress to next level
  const requiredExp = level * 100;
  const expProgress = (experience / requiredExp) * 100;

  // Get placeholder image based on pose name
  const getPoseImage = (pose: YogaPose) => {
    switch(pose.name.toLowerCase()) {
      case 'mountain pose':
        return 'https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e?w=800&auto=format&fit=crop&q=60';
      case 'downward dog':
        return 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&auto=format&fit=crop&q=60';
      case 'warrior i':
        return 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&auto=format&fit=crop&q=60';
      case 'tree pose':
        return 'https://images.unsplash.com/photo-1556816723-1ce827b9cfca?w=800&auto=format&fit=crop&q=60';
      case 'crow pose':
        return 'https://images.unsplash.com/photo-1611094607507-8c8173e5cf40?w=800&auto=format&fit=crop&q=60';
      default:
        return 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60';
    }
  };
  
  return (
    <div className="h-screen w-full flex flex-col p-4 overflow-hidden">
      {/* Player stats */}
      <div className="w-full dark-glass rounded-2xl p-4 mb-4 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Level {level}</h3>
            <h2 className="text-2xl font-bold sunset-text">{energy.toLocaleString()} Energy</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Energy</p>
            <p className="font-medium">{totalEnergy.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Experience</span>
            <span>{experience}/{requiredExp}</span>
          </div>
          <Progress value={expProgress} className="h-2" />
        </div>
      </div>
      
      {/* Main game area */}
      <Tabs defaultValue="play" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4 dark-glass">
          <TabsTrigger value="play" className="text-md data-[state=active]:bg-orange-500/20">Play</TabsTrigger>
          <TabsTrigger value="poses" className="text-md data-[state=active]:bg-orange-500/20">Poses</TabsTrigger>
          <TabsTrigger value="upgrades" className="text-md data-[state=active]:bg-orange-500/20">Upgrades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="play" className="flex-1 flex flex-col">
          <div 
            className="flex-1 flex items-center justify-center relative"
            onClick={handleClick}
          >
            <motion.div
              className="p-2 rounded-full cursor-pointer relative overflow-hidden w-64 h-64 flex items-center justify-center"
              animate={isClicking ? { scale: 0.95 } : { scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full" />
              <img 
                src={getPoseImage(activePose)}
                alt={activePose.name}
                className="w-full h-full object-cover rounded-full shadow-inner border-4 border-orange-500/50"
              />
              <motion.div
                className="absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-b from-transparent to-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-xl font-bold text-white drop-shadow-md">{activePose.name}</span>
              </motion.div>
            </motion.div>
            
            {/* Energy particles */}
            <AnimatePresence>
              {energyParticles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute text-lg font-bold text-orange-400"
                  initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1 }}
                  animate={{ y: particle.y - 80, opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  +{activePose.energyPerClick || 1}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <motion.div 
            className="text-center mt-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-muted-foreground">Tap to gain energy</p>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="poses" className="space-y-4 flex-1 overflow-y-auto pb-4 no-scrollbar">
          <h2 className="text-xl font-bold sunset-text">Yoga Poses</h2>
          <p className="text-muted-foreground">Unlock new poses to increase your energy gain per click</p>
          
          <div className="grid grid-cols-1 gap-4">
            {yogaPoses.map(pose => (
              <Card key={pose.id} className={`p-4 ${pose.unlocked ? 'border-orange-500/50 border-2' : 'dark-glass'} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-orange-500/5 z-0" />
                <div 
                  className="absolute top-2 right-2 text-muted-foreground cursor-pointer z-10"
                  onClick={() => setShowPoseInfo(showPoseInfo === pose.id ? null : pose.id)}
                >
                  ⓘ
                </div>
                <div className="flex justify-between items-center z-10 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-orange-500/30">
                      <img 
                        src={getPoseImage(pose)} 
                        alt={pose.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{pose.name}</h3>
                      {showPoseInfo === pose.id && (
                        <p className="text-sm text-muted-foreground mt-1">{pose.description}</p>
                      )}
                      <p className="text-sm">+{pose.energyPerClick} energy per click</p>
                    </div>
                  </div>
                  <div>
                    {pose.unlocked ? (
                      <Button variant="outline" disabled className="btn-effect">
                        Active
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => onBuyPose(pose.id)} 
                        disabled={energy < pose.price}
                        className="btn-effect bg-orange-500/80 hover:bg-orange-500"
                      >
                        {pose.price} Energy
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upgrades" className="space-y-4 flex-1 overflow-y-auto pb-4 no-scrollbar">
          <h2 className="text-xl font-bold sunset-text">Upgrades</h2>
          <p className="text-muted-foreground">Purchase upgrades to boost your energy production</p>
          
          <div className="grid grid-cols-1 gap-4">
            {upgrades.map(upgrade => {
              // Get appropriate upgrade image
              const upgradeImage = (() => {
                if (upgrade.name.includes('Mat')) {
                  return 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=800&auto=format&fit=crop&q=60';
                } else if (upgrade.name.includes('Cushion')) {
                  return 'https://images.unsplash.com/photo-1595578069152-55496318ee58?w=800&auto=format&fit=crop&q=60';
                } else if (upgrade.name.includes('Blocks')) {
                  return 'https://images.unsplash.com/photo-1558017487-06bf9f82613a?w=800&auto=format&fit=crop&q=60';
                } else if (upgrade.name.includes('Garden')) {
                  return 'https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?w=800&auto=format&fit=crop&q=60';
                } else {
                  return 'https://images.unsplash.com/photo-1611647832580-377268dffb38?w=800&auto=format&fit=crop&q=60';
                }
              })();
              
              return (
                <Card key={upgrade.id} className={`p-4 ${upgrade.purchased ? 'border-amber-400/50 border-2' : 'dark-glass'} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-500/5 z-0" />
                  <div 
                    className="absolute top-2 right-2 text-muted-foreground cursor-pointer z-10"
                    onClick={() => setShowUpgradeInfo(showUpgradeInfo === upgrade.id ? null : upgrade.id)}
                  >
                    ⓘ
                  </div>
                  <div className="flex justify-between items-center z-10 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-amber-500/30">
                        <img 
                          src={upgradeImage}
                          alt={upgrade.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">{upgrade.name}</h3>
                        {showUpgradeInfo === upgrade.id && (
                          <p className="text-sm text-muted-foreground mt-1">{upgrade.description}</p>
                        )}
                        <p className="text-sm">
                          {upgrade.effect.type === 'multiplier' && `${upgrade.effect.value}x multiplier`}
                          {upgrade.effect.type === 'autoClick' && `+${upgrade.effect.value} energy/sec`}
                        </p>
                      </div>
                    </div>
                    <div>
                      {upgrade.purchased ? (
                        <Button variant="outline" disabled className="btn-effect">
                          Purchased
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => onBuyUpgrade(upgrade.id)} 
                          disabled={energy < upgrade.price}
                          className="btn-effect"
                          variant="secondary"
                        >
                          {upgrade.price} Energy
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YogaClicker;

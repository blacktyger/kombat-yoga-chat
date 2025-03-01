
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
  
  return (
    <div className="h-screen w-full flex flex-col p-4 overflow-hidden bg-background">
      {/* Player stats */}
      <div className="w-full glass rounded-2xl p-4 mb-4 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Level {level}</h3>
            <h2 className="text-2xl font-bold">{energy.toLocaleString()} Energy</h2>
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
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="play" className="text-md">Play</TabsTrigger>
          <TabsTrigger value="poses" className="text-md">Poses</TabsTrigger>
          <TabsTrigger value="upgrades" className="text-md">Upgrades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="play" className="flex-1 flex flex-col">
          <div 
            className="flex-1 flex items-center justify-center relative"
            onClick={handleClick}
          >
            <motion.div
              className={`p-20 rounded-full bg-yoga-light border-4 ${isClicking ? 'border-yoga-dark' : 'border-yoga'} cursor-pointer relative overflow-hidden`}
              animate={isClicking ? { scale: 0.95 } : { scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div
                className="text-2xl font-bold absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {activePose?.name || 'Mountain Pose'}
              </motion.div>
            </motion.div>
            
            {/* Energy particles */}
            <AnimatePresence>
              {energyParticles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute text-lg font-bold text-yoga-dark"
                  initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1 }}
                  animate={{ y: particle.y - 80, opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  +{activePose?.energyPerClick || 1}
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
          <h2 className="text-xl font-bold">Yoga Poses</h2>
          <p className="text-muted-foreground">Unlock new poses to increase your energy gain per click</p>
          
          <div className="grid grid-cols-1 gap-4">
            {yogaPoses.map(pose => (
              <Card key={pose.id} className={`p-4 ${pose.unlocked ? 'border-yoga border-2' : ''} relative`}>
                <div 
                  className="absolute top-2 right-2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowPoseInfo(showPoseInfo === pose.id ? null : pose.id)}
                >
                  ⓘ
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{pose.name}</h3>
                    {showPoseInfo === pose.id && (
                      <p className="text-sm text-muted-foreground mt-1">{pose.description}</p>
                    )}
                    <p className="text-sm">+{pose.energyPerClick} energy per click</p>
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
                        className="btn-effect"
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
          <h2 className="text-xl font-bold">Upgrades</h2>
          <p className="text-muted-foreground">Purchase upgrades to boost your energy production</p>
          
          <div className="grid grid-cols-1 gap-4">
            {upgrades.map(upgrade => (
              <Card key={upgrade.id} className={`p-4 ${upgrade.purchased ? 'border-energy border-2' : ''} relative`}>
                <div 
                  className="absolute top-2 right-2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowUpgradeInfo(showUpgradeInfo === upgrade.id ? null : upgrade.id)}
                >
                  ⓘ
                </div>
                <div className="flex justify-between items-center">
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
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YogaClicker;

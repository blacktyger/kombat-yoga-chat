
import { useState, useEffect, useCallback } from 'react';
import { Player, YogaPose, Upgrade, GameState, LeaderboardEntry } from '../types/game';
import { mockPlayer, mockLeaderboard } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';

export const useGameState = (): GameState & {
  handleClick: () => void;
  buyYogaPose: (poseId: number) => void;
  buyUpgrade: (upgradeId: number) => void;
  resetGame: () => void;
} => {
  const [player, setPlayer] = useState<Player>(mockPlayer);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(Date.now());

  // Handle auto-clicking from upgrades
  useEffect(() => {
    if (!isInitialized) return;
    
    const autoClickInterval = setInterval(() => {
      if (player.autoClickPower > 0) {
        setPlayer(prevPlayer => ({
          ...prevPlayer,
          energy: prevPlayer.energy + prevPlayer.autoClickPower,
          totalEnergy: prevPlayer.totalEnergy + prevPlayer.autoClickPower,
          experience: prevPlayer.experience + prevPlayer.autoClickPower
        }));
      }
    }, 1000);
    
    return () => clearInterval(autoClickInterval);
  }, [player.autoClickPower, isInitialized]);

  // Level up logic
  useEffect(() => {
    if (!isInitialized) return;
    
    const requiredExp = player.level * 100;
    if (player.experience >= requiredExp) {
      setPlayer(prevPlayer => ({
        ...prevPlayer,
        level: prevPlayer.level + 1,
        experience: prevPlayer.experience - requiredExp
      }));
      
      toast({
        title: "Level Up!",
        description: `You've reached level ${player.level + 1}!`,
        duration: 3000
      });
    }
  }, [player.experience, player.level, isInitialized]);

  // Update leaderboard
  useEffect(() => {
    if (!isInitialized) return;
    
    const newLeaderboard = [...leaderboard];
    const playerEntry = newLeaderboard.find(entry => entry.id === player.id);
    
    if (playerEntry) {
      playerEntry.energy = player.energy;
      playerEntry.level = player.level;
      
      // Sort leaderboard by energy
      newLeaderboard.sort((a, b) => b.energy - a.energy);
      
      // Update ranks
      newLeaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });
      
      setLeaderboard(newLeaderboard);
    }
  }, [player.energy, player.level, isInitialized]);

  // Initialize the game
  useEffect(() => {
    // This would normally fetch data from backend
    // For now, we'll just use the mock data
    setIsInitialized(true);
  }, []);

  // Click handler
  const handleClick = useCallback(() => {
    if (!isInitialized) return;
    
    // Find the current active pose
    const activePose = player.yogaPoses.find(pose => pose.unlocked);
    if (!activePose) return;
    
    // Calculate energy gain
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    const clickMultiplier = timeDiff < 200 ? 1.1 : 1; // Small bonus for rapid clicking
    
    const energyGain = Math.round(activePose.energyPerClick * player.clickPower * clickMultiplier);
    
    setLastClickTime(now);
    
    setPlayer(prevPlayer => ({
      ...prevPlayer,
      energy: prevPlayer.energy + energyGain,
      totalEnergy: prevPlayer.totalEnergy + energyGain,
      experience: prevPlayer.experience + energyGain
    }));
  }, [player.yogaPoses, player.clickPower, lastClickTime, isInitialized]);

  // Buy a yoga pose
  const buyYogaPose = useCallback((poseId: number) => {
    if (!isInitialized) return;
    
    const poseIndex = player.yogaPoses.findIndex(pose => pose.id === poseId);
    if (poseIndex === -1) return;
    
    const pose = player.yogaPoses[poseIndex];
    
    // Check if already unlocked or not enough energy
    if (pose.unlocked || player.energy < pose.price) {
      if (pose.unlocked) {
        toast({
          title: "Already Unlocked",
          description: `You've already unlocked ${pose.name}!`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Not Enough Energy",
          description: `You need ${pose.price - player.energy} more energy to unlock ${pose.name}!`,
          variant: "destructive"
        });
      }
      return;
    }
    
    // Update player's yogaPoses and energy
    setPlayer(prevPlayer => {
      const updatedPoses = [...prevPlayer.yogaPoses];
      
      // Set all poses to unlocked: false
      updatedPoses.forEach(p => p.unlocked = false);
      
      // Unlock the purchased pose
      updatedPoses[poseIndex].unlocked = true;
      
      return {
        ...prevPlayer,
        energy: prevPlayer.energy - pose.price,
        yogaPoses: updatedPoses
      };
    });
    
    toast({
      title: "Pose Unlocked!",
      description: `You've unlocked ${pose.name}!`,
    });
  }, [player.yogaPoses, player.energy, isInitialized]);

  // Buy an upgrade
  const buyUpgrade = useCallback((upgradeId: number) => {
    if (!isInitialized) return;
    
    const upgradeIndex = player.upgrades.findIndex(upgrade => upgrade.id === upgradeId);
    if (upgradeIndex === -1) return;
    
    const upgrade = player.upgrades[upgradeIndex];
    
    // Check if already purchased or not enough energy
    if (upgrade.purchased || player.energy < upgrade.price) {
      if (upgrade.purchased) {
        toast({
          title: "Already Purchased",
          description: `You've already purchased ${upgrade.name}!`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Not Enough Energy",
          description: `You need ${upgrade.price - player.energy} more energy to purchase ${upgrade.name}!`,
          variant: "destructive"
        });
      }
      return;
    }
    
    // Update player based on upgrade type
    setPlayer(prevPlayer => {
      const updatedUpgrades = [...prevPlayer.upgrades];
      updatedUpgrades[upgradeIndex].purchased = true;
      
      let newClickPower = prevPlayer.clickPower;
      let newAutoClickPower = prevPlayer.autoClickPower;
      
      if (upgrade.effect.type === 'multiplier') {
        newClickPower *= upgrade.effect.value;
      } else if (upgrade.effect.type === 'autoClick') {
        newAutoClickPower += upgrade.effect.value;
      }
      
      return {
        ...prevPlayer,
        energy: prevPlayer.energy - upgrade.price,
        clickPower: newClickPower,
        autoClickPower: newAutoClickPower,
        upgrades: updatedUpgrades
      };
    });
    
    toast({
      title: "Upgrade Purchased!",
      description: `You've purchased ${upgrade.name}!`,
    });
  }, [player.upgrades, player.energy, isInitialized]);

  // Reset game
  const resetGame = useCallback(() => {
    setPlayer(mockPlayer);
    setLeaderboard(mockLeaderboard);
    
    toast({
      title: "Game Reset",
      description: "Your progress has been reset.",
    });
  }, []);

  return {
    player,
    leaderboard,
    isInitialized,
    handleClick,
    buyYogaPose,
    buyUpgrade,
    resetGame
  };
};

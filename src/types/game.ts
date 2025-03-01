
// Game types for Kombat Yoga

export interface YogaPose {
  id: number;
  name: string;
  description: string;
  energyPerClick: number;
  price: number;
  level: number;
  image: string;  // This will now hold the actual image URL
  unlocked: boolean;
}

export interface Upgrade {
  id: number;
  name: string;
  description: string;
  effect: {
    type: 'multiplier' | 'autoClick' | 'passive';
    value: number;
  };
  price: number;
  purchased: boolean;
  requiredEnergy: number;
}

export interface Player {
  id: number;
  name: string;
  energy: number;
  totalEnergy: number;
  clickPower: number;
  autoClickPower: number;
  level: number;
  experience: number;
  yogaPoses: YogaPose[];
  upgrades: Upgrade[];
  joinedAt: Date;
  lastActive: Date;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  energy: number;
  level: number;
  rank: number;
}

export interface GameState {
  player: Player;
  leaderboard: LeaderboardEntry[];
  isInitialized: boolean;
}

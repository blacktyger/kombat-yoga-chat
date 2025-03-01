
import { YogaPose, Upgrade, Player, LeaderboardEntry } from '../types/game';

// Mock yoga poses
export const mockYogaPoses: YogaPose[] = [
  {
    id: 1,
    name: 'Mountain Pose',
    description: 'The foundation of all standing poses, mountain pose teaches the basics of alignment and posture.',
    energyPerClick: 1,
    price: 0,
    level: 1,
    image: 'mountain-pose.svg',
    unlocked: true
  },
  {
    id: 2,
    name: 'Downward Dog',
    description: 'An active stretch that strengthens and restores your body.',
    energyPerClick: 2,
    price: 50,
    level: 2,
    image: 'downward-dog.svg',
    unlocked: false
  },
  {
    id: 3,
    name: 'Warrior I',
    description: 'A powerful standing pose that builds strength and confidence.',
    energyPerClick: 5,
    price: 200,
    level: 3,
    image: 'warrior-pose.svg',
    unlocked: false
  },
  {
    id: 4,
    name: 'Tree Pose',
    description: 'Improves balance, focus, and mental clarity while strengthening your legs.',
    energyPerClick: 10,
    price: 500,
    level: 4,
    image: 'tree-pose.svg',
    unlocked: false
  },
  {
    id: 5,
    name: 'Crow Pose',
    description: 'An arm balance that builds core strength and improves focus.',
    energyPerClick: 25,
    price: 1000,
    level: 5,
    image: 'crow-pose.svg',
    unlocked: false
  }
];

// Mock upgrades
export const mockUpgrades: Upgrade[] = [
  {
    id: 1,
    name: 'Yoga Mat',
    description: 'A basic yoga mat increases your click power by 2x.',
    effect: {
      type: 'multiplier',
      value: 2
    },
    price: 100,
    purchased: false,
    requiredEnergy: 50
  },
  {
    id: 2,
    name: 'Meditation Cushion',
    description: 'Generates 1 energy per second passively.',
    effect: {
      type: 'autoClick',
      value: 1
    },
    price: 250,
    purchased: false,
    requiredEnergy: 200
  },
  {
    id: 3,
    name: 'Yoga Blocks',
    description: 'Support for advanced poses. Increases click power by 3x.',
    effect: {
      type: 'multiplier',
      value: 3
    },
    price: 500,
    purchased: false,
    requiredEnergy: 400
  },
  {
    id: 4,
    name: 'Zen Garden',
    description: 'A peaceful sanctuary that generates 5 energy per second.',
    effect: {
      type: 'autoClick',
      value: 5
    },
    price: 1000,
    purchased: false,
    requiredEnergy: 800
  },
  {
    id: 5,
    name: 'Enlightenment',
    description: 'Achieve spiritual enlightenment. All energy gains are multiplied by 10x.',
    effect: {
      type: 'multiplier',
      value: 10
    },
    price: 5000,
    purchased: false,
    requiredEnergy: 4000
  }
];

// Mock player data
export const mockPlayer: Player = {
  id: 1,
  name: 'Yogini',
  energy: 0,
  totalEnergy: 0,
  clickPower: 1,
  autoClickPower: 0,
  level: 1,
  experience: 0,
  yogaPoses: mockYogaPoses,
  upgrades: mockUpgrades,
  joinedAt: new Date(),
  lastActive: new Date()
};

// Mock leaderboard data
export const mockLeaderboard: LeaderboardEntry[] = [
  { id: 2, name: 'ZenMaster', energy: 9876, level: 10, rank: 1 },
  { id: 3, name: 'NamastePro', energy: 8765, level: 9, rank: 2 },
  { id: 4, name: 'OmShanti', energy: 7654, level: 8, rank: 3 },
  { id: 5, name: 'YogaGuru', energy: 6543, level: 7, rank: 4 },
  { id: 6, name: 'FlexibleFriend', energy: 5432, level: 6, rank: 5 },
  { id: 7, name: 'PeacefulWarrior', energy: 4321, level: 5, rank: 6 },
  { id: 8, name: 'BreatheMaster', energy: 3210, level: 4, rank: 7 },
  { id: 9, name: 'BalanceQueen', energy: 2109, level: 3, rank: 8 },
  { id: 10, name: 'MindfulMover', energy: 1098, level: 2, rank: 9 },
  { id: 1, name: 'Yogini', energy: 0, level: 1, rank: 10 }
];

'use strict';

const PHYSICS = {
  restSpeed: 0.05,
  wallBounce: 0.8,
  horizonRatio: 0.25,
  groundMargin: 10,
  launchScale: 0.12,
  grabRadiusScale: 1.4,
};

const TRAIL = {
  minSpeed: 0.8,
  spawnChance: 0.4,
  fadeRate: 0.03,
};

const VECTOR_DISPLAY = {
  minSpeed: 0.2,
  velocityScale: 12,
  aimScale: 2,
};

// Positions are fractions of the viewport so the layout scales with the screen.
const ROCK_LAYOUT = [
  { x: 0.2, y: 0.6, radius: 22, mass: 2 },
  { x: 0.4, y: 0.55, radius: 26, mass: 3.5 },
  { x: 0.35, y: 0.75, radius: 18, mass: 1.5 },
  { x: 0.6, y: 0.65, radius: 24, mass: 3.0 },
  { x: 0.75, y: 0.5, radius: 22, mass: 2.5 },
];

const SUN_LAYOUT = { x: 0.75, y: 0.32, radius: 80 };

const PALETTE = {
  velocity: '#38bdf8',
  aim: '#4ade80',
  slingBand: '#f59e0b',
  label: '#f8fafc',
  rockOutline: '#cbd5e1',
  rockShadow: 'rgba(0,0,0,0.3)',
  rockGradient: ['#94a3b8', '#475569', '#1e293b'],
  sunGradient: ['#fef08a', '#fde047', 'rgba(251, 146, 60, 0)'],
  groundGradient: ['#1e1b4b', '#311042', '#0f172a'],
  trailRgb: '251, 146, 60',
};

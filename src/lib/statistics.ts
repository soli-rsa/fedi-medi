export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}

const STATS_KEY = 'wordleStats';

export const getInitialStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array(6).fill(0),
});

export const loadStats = (): GameStats => {
  const stats = localStorage.getItem(STATS_KEY);
  return stats ? JSON.parse(stats) : getInitialStats();
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const updateStats = (won: boolean, attempts: number) => {
  const stats = loadStats();
  stats.gamesPlayed++;
  
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.guessDistribution[attempts - 1]++;
  } else {
    stats.currentStreak = 0;
  }
  
  saveStats(stats);
  return stats;
};
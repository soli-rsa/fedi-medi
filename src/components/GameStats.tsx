interface GameStatsProps {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
}

const GameStats = ({ gamesPlayed, gamesWon, currentStreak, maxStreak }: GameStatsProps) => {
  return (
    <div className="text-xs sm:text-sm text-muted-foreground grid grid-cols-2 gap-2">
      <p>Games Played: {gamesPlayed}</p>
      <p>Win Rate: {gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0}%</p>
      <p>Current Streak: {currentStreak}</p>
      <p>Max Streak: {maxStreak}</p>
    </div>
  );
};

export default GameStats;
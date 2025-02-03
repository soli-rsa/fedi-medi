import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import GameHeader from "@/components/GameHeader";
import GameClue from "@/components/GameClue";
import GameInstructions from "@/components/GameInstructions";
import GameStats from "@/components/GameStats";
import { useWordleGame } from "@/hooks/useWordleGame";

const Index = () => {
  const {
    gameMode,
    gameState,
    keyStates,
    stats,
    clue,
    handleModeChange,
    handleKey,
    startNewGame
  } = useWordleGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-4 px-2 sm:py-8">
      <div className="w-full max-w-lg mx-auto">
        <GameHeader
          gameMode={gameMode}
          onModeChange={handleModeChange}
          onNewGame={startNewGame}
        />
        
        <GameClue clue={clue} />

        <GameInstructions gameMode={gameMode} />

        <div className="flex flex-col items-center gap-4">
          <GameStats
            gamesPlayed={stats.gamesPlayed}
            gamesWon={stats.gamesWon}
            currentStreak={stats.currentStreak}
            maxStreak={stats.maxStreak}
          />
          
          <GameBoard
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            answer={answer}
          />
        </div>
      </div>
      
      <div className="w-full mt-4">
        <Keyboard
          onKey={handleKey}
          keyStates={keyStates}
        />
      </div>
    </div>
  );
};

export default Index;
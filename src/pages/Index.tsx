import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import { getRandomWord, isValidWord, evaluateGuess } from "@/lib/words";
import { GameState, KeyState } from "@/lib/types";
import { loadStats, updateStats } from "@/lib/statistics";
import { getWordDefinition } from "@/lib/medical-terms";

const Index = () => {
  const { toast } = useToast();
  const [answer, setAnswer] = useState(() => getRandomWord());
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
  });
  const [keyStates, setKeyStates] = useState<KeyState[]>([]);
  const [stats, setStats] = useState(loadStats());
  const [clue, setClue] = useState("");

  useEffect(() => {
    const definition = getWordDefinition(answer);
    setClue(definition || "");
    console.log("Current word:", answer, "Definition:", definition);
  }, [answer]);

  const addLetter = (letter: string) => {
    if (gameState.currentGuess.length < 5 && gameState.gameStatus === 'playing') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + letter,
      }));
    }
  };

  const removeLetter = () => {
    setGameState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }));
  };

  const submitGuess = () => {
    if (gameState.currentGuess.length !== 5) {
      toast({
        title: "Not enough letters",
        description: "Please enter a 5-letter word",
      });
      return;
    }

    if (!isValidWord(gameState.currentGuess)) {
      toast({
        title: "Invalid word",
        description: "Please enter a valid medical term",
        variant: "destructive",
      });
      return;
    }

    const newGuesses = [...gameState.guesses, gameState.currentGuess.toUpperCase()];
    const won = gameState.currentGuess.toUpperCase() === answer;
    const lost = newGuesses.length === 6;

    setGameState(prev => ({
      guesses: newGuesses,
      currentGuess: '',
      gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
    }));

    if (won) {
      const newStats = updateStats(true, newGuesses.length);
      setStats(newStats);
      toast({
        title: "Congratulations!",
        description: `You found the medical term in ${newGuesses.length} tries!`,
      });
    } else if (lost) {
      const newStats = updateStats(false, 6);
      setStats(newStats);
      toast({
        title: "Game Over",
        description: `The medical term was ${answer}`,
        variant: "destructive",
      });
    }

    const evaluation = evaluateGuess(gameState.currentGuess, answer);
    const newKeyStates = [...keyStates];
    gameState.currentGuess.toUpperCase().split('').forEach((letter, i) => {
      const existingKeyState = newKeyStates.find(k => k.key === letter);
      if (!existingKeyState || evaluation[i] === 'correct') {
        newKeyStates.push({ key: letter, state: evaluation[i] });
      }
    });
    setKeyStates(newKeyStates);
  };

  const handleKey = (key: string) => {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === '⌫') {
      removeLetter();
    } else if (/^[A-Z]$/.test(key)) {
      addLetter(key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('⌫');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-4 px-2 sm:py-8">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Medical Wordle</h1>
        
        <div className="bg-card rounded-lg p-4 mb-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Clue:</h2>
          <p className="text-muted-foreground text-sm sm:text-base">{clue}</p>
        </div>

        <div className="max-w-md text-center mb-4 px-2 sm:px-4">
          <p className="text-sm sm:text-base text-muted-foreground mb-2">
            Guess the medical term in 6 tries. Each guess must be a valid 5-letter medical word.
          </p>
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <p>🟩 Green tile means the letter is correct and in the right spot</p>
            <p>🟨 Yellow tile means the letter is in the word but in the wrong spot</p>
            <p>⬜️ Gray tile means the letter is not in the word</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-xs sm:text-sm text-muted-foreground grid grid-cols-2 gap-2">
            <p>Games Played: {stats.gamesPlayed}</p>
            <p>Win Rate: {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%</p>
            <p>Current Streak: {stats.currentStreak}</p>
            <p>Max Streak: {stats.maxStreak}</p>
          </div>
          
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
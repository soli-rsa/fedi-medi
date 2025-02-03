import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import GameHeader from "@/components/GameHeader";
import GameClue from "@/components/GameClue";
import GameInstructions from "@/components/GameInstructions";
import GameStats from "@/components/GameStats";
import { getRandomWord, isValidWord, evaluateGuess } from "@/lib/words";
import { GameState, KeyState, WordCategory } from "@/lib/types";
import { loadStats, updateStats } from "@/lib/statistics";
import { getWordDefinition } from "@/lib/medical-terms";

const Index = () => {
  const { toast } = useToast();
  const [gameMode, setGameMode] = useState<WordCategory>('medical');
  const [answer, setAnswer] = useState(() => getRandomWord(gameMode));
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
  });
  const [keyStates, setKeyStates] = useState<KeyState[]>([]);
  const [stats, setStats] = useState(loadStats());
  const [clue, setClue] = useState("");

  const startNewGame = () => {
    const newWord = getRandomWord(gameMode);
    setAnswer(newWord);
    setGameState({
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
    });
    setKeyStates([]);
    const definition = getWordDefinition(newWord);
    setClue(definition || "");
    console.log("New game started with word:", newWord, "Definition:", definition);
  };

  useEffect(() => {
    const definition = getWordDefinition(answer);
    setClue(definition || "");
    console.log("Current word:", answer, "Definition:", definition);
  }, [answer]);

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'general' : 'medical';
    setGameMode(newMode);
    toast({
      title: `Switched to ${newMode} mode`,
      description: `Now playing with ${newMode} terms`,
    });
    startNewGame();
  };

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

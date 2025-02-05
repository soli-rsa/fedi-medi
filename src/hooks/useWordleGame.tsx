import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { wordService } from "@/lib/words";
import { GameState, KeyState, WordCategory, WordEntry } from "@/lib/types";
import { loadStats, updateStats } from "@/lib/statistics";

export const useWordleGame = () => {
  const { toast } = useToast();
  const [gameMode, setGameMode] = useState<WordCategory>('medical');
  const [currentWord, setCurrentWord] = useState<WordEntry>(() => {
    const word = wordService.getRandomWord(gameMode);
    console.log("Initial word selected:", word.word, "Mode:", gameMode);
    return word;
  });
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
  });
  const [keyStates, setKeyStates] = useState<KeyState[]>([]);
  const [stats, setStats] = useState(loadStats());

  const resetGameState = () => {
    setGameState({
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
    });
    setKeyStates([]);
    console.log("Game state reset completed");
  };

  const startNewGame = () => {
    const newWord = wordService.getRandomWord(gameMode);
    console.log("Starting new game with word:", newWord.word, "Mode:", gameMode);
    setCurrentWord(newWord);
    resetGameState();
  };

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'general' : 'medical';
    console.log("Mode changing from", gameMode, "to", newMode);
    setGameMode(newMode);
    
    // Reset game state before changing mode
    resetGameState();
    
    // Get new word for the new mode
    const newWord = wordService.getRandomWord(newMode);
    setCurrentWord(newWord);
    
    toast({
      title: `Switched to ${newMode} mode`,
      description: `Now playing with ${newMode} terms`,
    });
    
    console.log("Mode change completed. New word:", newWord.word);
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

    if (!wordService.isValidWord(gameState.currentGuess)) {
      toast({
        title: "Invalid word",
        description: "Please enter a valid medical term",
        variant: "destructive",
      });
      return;
    }

    const newGuesses = [...gameState.guesses, gameState.currentGuess.toUpperCase()];
    const won = gameState.currentGuess.toUpperCase() === currentWord.word;
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
        description: `You found the word in ${newGuesses.length} tries!`,
      });
      // Get a new word immediately after winning
      const newWord = wordService.getRandomWord(gameMode);
      console.log("New word selected after win:", newWord.word);
      setCurrentWord(newWord);
    } else if (lost) {
      const newStats = updateStats(false, 6);
      setStats(newStats);
      toast({
        title: "Game Over",
        description: `The word was ${currentWord.word}`,
        variant: "destructive",
      });
    }

    const evaluation = wordService.evaluateGuess(gameState.currentGuess, currentWord.word);
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

  return {
    gameMode,
    answer: currentWord.word,
    gameState,
    keyStates,
    stats,
    clue: currentWord.definition,
    handleModeChange,
    handleKey,
    startNewGame
  };
};
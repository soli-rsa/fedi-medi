import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import { getRandomWord, isValidWord, evaluateGuess } from "@/lib/words";
import { GameState, KeyState } from "@/lib/types";

const Index = () => {
  const { toast } = useToast();
  const [answer, setAnswer] = useState(() => getRandomWord());
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
  });
  const [keyStates, setKeyStates] = useState<KeyState[]>([]);

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
        description: "Please enter a valid word",
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
      toast({
        title: "Congratulations!",
        description: `You found the word in ${newGuesses.length} tries!`,
      });
    } else if (lost) {
      toast({
        title: "Game Over",
        description: `The word was ${answer}`,
        variant: "destructive",
      });
    }

    // Update key states
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
    <div className="min-h-screen flex flex-col items-center justify-between py-8">
      <h1 className="text-4xl font-bold mb-8">Wordle Clone</h1>
      
      <GameBoard
        guesses={gameState.guesses}
        currentGuess={gameState.currentGuess}
        answer={answer}
      />
      
      <Keyboard
        onKey={handleKey}
        keyStates={keyStates}
      />
    </div>
  );
};

export default Index;
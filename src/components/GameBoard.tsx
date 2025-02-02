import { TileState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  answer: string;
}

const GameBoard = ({ guesses, currentGuess, answer }: GameBoardProps) => {
  const empties = Array(6 - guesses.length - 1).fill('');
  
  const getTileColor = (letter: string, index: number, guess: string): TileState => {
    if (guess === '') return 'empty';
    if (letter === answer[index]) return 'correct';
    if (answer.includes(letter)) return 'present';
    return 'absent';
  };

  return (
    <div className="grid grid-rows-6 gap-1 mx-auto max-w-sm p-4">
      {guesses.map((guess, i) => (
        <div key={i} className="grid grid-cols-5 gap-1">
          {guess.split('').map((letter, j) => (
            <div
              key={j}
              className={cn(
                "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold rounded flip",
                {
                  'bg-green-500 border-green-600': getTileColor(letter, j, guess) === 'correct',
                  'bg-yellow-500 border-yellow-600': getTileColor(letter, j, guess) === 'present',
                  'bg-muted border-muted-foreground': getTileColor(letter, j, guess) === 'absent',
                }
              )}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
      
      {/* Current guess */}
      {guesses.length < 6 && (
        <div className="grid grid-cols-5 gap-1">
          {Array(5).fill('').map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold rounded",
                "border-muted-foreground",
                { "border-primary": currentGuess[i] }
              )}
            >
              {currentGuess[i] || ''}
            </div>
          ))}
        </div>
      )}
      
      {/* Empty rows */}
      {empties.map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-1">
          {Array(5).fill('').map((_, j) => (
            <div
              key={j}
              className="w-14 h-14 border-2 border-muted flex items-center justify-center rounded"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
import { WordCategory } from "@/lib/types";

interface GameInstructionsProps {
  gameMode: WordCategory;
}

const GameInstructions = ({ gameMode }: GameInstructionsProps) => {
  return (
    <div className="max-w-md text-center mb-4 px-2 sm:px-4">
      <p className="text-sm sm:text-base text-muted-foreground mb-2">
        Guess the {gameMode} term in 6 tries. Each guess must be a valid 5-letter word.
      </p>
      <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
        <p>🟩 Green tile means the letter is correct and in the right spot</p>
        <p>🟨 Yellow tile means the letter is in the word but in the wrong spot</p>
        <p>⬜️ Gray tile means the letter is not in the word</p>
      </div>
    </div>
  );
};

export default GameInstructions;
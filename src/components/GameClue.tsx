import { useEffect, useState } from "react";

interface GameClueProps {
  clue: string;
}

const GameClue = ({ clue }: GameClueProps) => {
  const [displayClue, setDisplayClue] = useState(clue);

  useEffect(() => {
    setDisplayClue(clue);
  }, [clue]);

  return (
    <div className="bg-card rounded-lg p-4 mb-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Clue:</h2>
      <p className="text-muted-foreground text-sm sm:text-base">{displayClue}</p>
    </div>
  );
};

export default GameClue;
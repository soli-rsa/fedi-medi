import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { WordCategory } from "@/lib/types";

interface GameHeaderProps {
  gameMode: WordCategory;
  onModeChange: (checked: boolean) => void;
  onNewGame: () => void;
}

const GameHeader = ({ gameMode, onModeChange, onNewGame }: GameHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl sm:text-4xl font-bold">Medical Wordle</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="game-mode"
            checked={gameMode === 'general'}
            onCheckedChange={onModeChange}
          />
          <Label htmlFor="game-mode">
            {gameMode === 'medical' ? 'Medical Mode' : 'General Mode'}
          </Label>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onNewGame}
          className="h-8 w-8"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GameHeader;
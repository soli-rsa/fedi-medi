import { KeyState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface KeyboardProps {
  onKey: (key: string) => void;
  keyStates: KeyState[];
}

const Keyboard = ({ onKey, keyStates }: KeyboardProps) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  const getKeyState = (key: string) => {
    return keyStates.find(k => k.key === key)?.state || 'tbd';
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 my-1">
          {row.map((key) => {
            const state = getKeyState(key);
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={cn(
                  "px-2 py-4 rounded font-bold text-sm min-w-[2rem]",
                  "transition-colors duration-200",
                  {
                    'bg-green-500 hover:bg-green-600': state === 'correct',
                    'bg-yellow-500 hover:bg-yellow-600': state === 'present',
                    'bg-muted hover:bg-muted/80': state === 'absent',
                    'bg-accent hover:bg-accent/80': state === 'tbd',
                    'px-4': key.length > 1
                  }
                )}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
export type TileState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

export type GameState = {
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
};

export type KeyState = {
  key: string;
  state: TileState;
};
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

export type WordCategory = 'medical' | 'general';

export interface Word {
  word: string;
  definition: string;
  category: WordCategory;
}

export type WordDifficulty = 'easy' | 'moderate' | 'hard';
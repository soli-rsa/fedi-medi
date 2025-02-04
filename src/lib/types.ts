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

export type WordCategory = 'medical' | 'general' | 'mixed';

export interface WordEntry {
  word: string;
  category: WordCategory;
  definition: string;
}

export interface DictionaryResponse {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
    }[];
  }[];
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
}
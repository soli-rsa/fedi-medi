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

export type WordDifficulty = 'easy' | 'moderate' | 'hard';

export interface Word {
  word: string;
  definition: string;
  category: WordCategory;
}

export interface WordEntry extends Word {}

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
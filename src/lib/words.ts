import { TileState } from './types';

const WORD_LIST = [
  'REACT', 'REDUX', 'HOOKS', 'STATE', 'PROPS',
  'QUERY', 'FETCH', 'ASYNC', 'AWAIT', 'CLASS',
  'CONST', 'ARRAY', 'STACK', 'QUEUE', 'GRAPH'
];

export const getRandomWord = () => {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
};

export const isValidWord = (word: string) => {
  return WORD_LIST.includes(word.toUpperCase());
};

export const evaluateGuess = (guess: string, answer: string): TileState[] => {
  const result: TileState[] = Array(5).fill('absent');
  const answerChars = answer.split('');
  const guessChars = guess.toUpperCase().split('');

  // First pass: mark correct letters
  guessChars.forEach((char, i) => {
    if (char === answerChars[i]) {
      result[i] = 'correct';
      answerChars[i] = '#';
      guessChars[i] = '#';
    }
  });

  // Second pass: mark present letters
  guessChars.forEach((char, i) => {
    if (char !== '#') {
      const answerIndex = answerChars.indexOf(char);
      if (answerIndex !== -1) {
        result[i] = 'present';
        answerChars[answerIndex] = '#';
      }
    }
  });

  return result;
};
import { TileState } from "./types";
import { getRandomWord as getMedicalWord, isValidWord as isMedicalWord } from "./medical-terms";

export const getRandomWord = (): string => {
  return getMedicalWord();
};

export const isValidWord = (word: string): boolean => {
  return isMedicalWord(word);
};

export const evaluateGuess = (guess: string, answer: string): TileState[] => {
  const evaluation: TileState[] = Array(5).fill('absent');
  const answerLetters = answer.split('');
  const guessLetters = guess.toUpperCase().split('');

  // First pass: mark correct letters
  guessLetters.forEach((letter, i) => {
    if (letter === answerLetters[i]) {
      evaluation[i] = 'correct';
      answerLetters[i] = '#'; // Mark as used
    }
  });

  // Second pass: mark present letters
  guessLetters.forEach((letter, i) => {
    if (evaluation[i] !== 'correct') {
      const index = answerLetters.indexOf(letter);
      if (index !== -1) {
        evaluation[i] = 'present';
        answerLetters[index] = '#'; // Mark as used
      }
    }
  });

  return evaluation;
};
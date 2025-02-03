import { TileState, WordCategory } from "./types";
import { getRandomWord as getMedicalWord, isValidWord as isMedicalWord } from "./medical-terms";
import { generalWords } from "./general-words";

export const getRandomWord = (category: WordCategory = 'medical'): string => {
  if (category === 'medical') {
    return getMedicalWord();
  }
  // Get a random word from the general words list
  const randomIndex = Math.floor(Math.random() * generalWords.length);
  return generalWords[randomIndex].word;
};

export const isValidWord = (word: string, category: WordCategory = 'medical'): boolean => {
  if (category === 'medical') {
    return isMedicalWord(word);
  }
  return generalWords.some(w => w.word === word.toUpperCase());
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

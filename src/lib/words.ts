import { WordEntry, DictionaryResponse, WordCategory, TileState } from './types';
import { medicalTerms } from './medical-terms';
import { generalWords } from './general-words';

const MEDICAL_KEYWORDS = [
  'disease', 'treatment', 'organ', 'cell', 'medical', 'health',
  'body', 'patient', 'doctor', 'hospital', 'clinic', 'medicine',
  'symptom', 'diagnosis', 'therapy', 'surgery'
];

export class WordService {
  private static instance: WordService;
  private usedWords: Set<string> = new Set();
  private cache: Map<string, WordEntry> = new Map();
  
  private constructor() {}
  
  static getInstance(): WordService {
    if (!WordService.instance) {
      WordService.instance = new WordService();
    }
    return WordService.instance;
  }

  private isMedicalWord(definition: string): boolean {
    const lowerDef = definition.toLowerCase();
    return MEDICAL_KEYWORDS.some(keyword => lowerDef.includes(keyword));
  }

  getRandomWord(category: WordCategory = 'medical'): WordEntry {
    let wordPool: WordEntry[] = [];
    
    switch (category) {
      case 'medical':
        wordPool = medicalTerms.map(term => ({
          word: term.word,
          category: 'medical' as const,
          definition: term.definition
        }));
        break;
      case 'general':
        wordPool = generalWords;
        break;
      default:
        wordPool = [...medicalTerms.map(term => ({
          word: term.word,
          category: 'medical' as const,
          definition: term.definition
        })), ...generalWords];
    }

    // Filter out used words
    const availableWords = wordPool.filter(
      entry => !this.usedWords.has(entry.word)
    );

    if (availableWords.length === 0) {
      this.usedWords.clear();
      return this.getRandomWord(category);
    }

    const selectedWord = availableWords[
      Math.floor(Math.random() * availableWords.length)
    ];
    
    this.usedWords.add(selectedWord.word);
    console.log('Selected word:', selectedWord.word, 'Category:', selectedWord.category, 'Definition:', selectedWord.definition);
    return selectedWord;
  }

  evaluateGuess(guess: string, answer: string): TileState[] {
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
  }

  isValidWord(word: string): boolean {
    const upperWord = word.toUpperCase();
    return [...medicalTerms, ...generalWords].some(term => term.word === upperWord);
  }
}

export const wordService = WordService.getInstance();

// Keep these for backward compatibility
export const getRandomWord = (category: WordCategory = 'medical'): string => {
  return wordService.getRandomWord(category).word;
};

export const isValidWord = (word: string): boolean => {
  return wordService.isValidWord(word);
};

export const evaluateGuess = (guess: string, answer: string): TileState[] => {
  return wordService.evaluateGuess(guess, answer);
};

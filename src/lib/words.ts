import { WordEntry, DictionaryResponse, WordCategory } from './types';
import { medicalTerms } from './medical-terms';

export class WordService {
  private static instance: WordService;
  private usedWords: Set<string> = new Set();
  
  private constructor() {}
  
  static getInstance(): WordService {
    if (!WordService.instance) {
      WordService.instance = new WordService();
    }
    return WordService.instance;
  }

  async fetchWordDefinition(word: string): Promise<WordEntry | null> {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      
      if (!response.ok) return null;
      
      const data: DictionaryResponse[] = await response.json();
      return {
        word: word.toUpperCase(),
        category: 'general',
        definition: data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition available'
      };
    } catch (error) {
      console.error('Error fetching word definition:', error);
      return null;
    }
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
        // For now, use medical terms as fallback
        wordPool = medicalTerms.map(term => ({
          word: term.word,
          category: 'medical' as const,
          definition: term.definition
        }));
        break;
      case 'mixed':
        wordPool = medicalTerms.map(term => ({
          word: term.word,
          category: 'medical' as const,
          definition: term.definition
        }));
        break;
    }

    // Filter out used words
    const availableWords = wordPool.filter(
      entry => !this.usedWords.has(entry.word)
    );

    if (availableWords.length === 0) {
      this.usedWords.clear(); // Reset used words if all words have been used
      return this.getRandomWord(category);
    }

    const selectedWord = availableWords[
      Math.floor(Math.random() * availableWords.length)
    ];
    
    this.usedWords.add(selectedWord.word);
    console.log('Selected word:', selectedWord.word, 'Definition:', selectedWord.definition);
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
    return medicalTerms.some(term => term.word === word.toUpperCase());
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

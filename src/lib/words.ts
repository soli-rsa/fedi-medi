import { WordEntry, DictionaryResponse, WordCategory, TileState } from './types';
import { medicalTerms } from './medical-terms';

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

  async fetchWordDefinition(word: string): Promise<WordEntry | null> {
    try {
      // Check cache first
      const cached = this.cache.get(word);
      if (cached) {
        console.log('Retrieved from cache:', word);
        return cached;
      }

      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      
      if (!response.ok) return null;
      
      const data: DictionaryResponse[] = await response.json();
      const definition = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition available';
      
      const category = this.isMedicalWord(definition) ? 'medical' : 'general';
      const wordEntry: WordEntry = {
        word: word.toUpperCase(),
        category,
        definition
      };

      // Cache the result
      this.cache.set(word, wordEntry);
      console.log('Added to cache:', word, 'Category:', category);
      
      return wordEntry;
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
      this.usedWords.clear();
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
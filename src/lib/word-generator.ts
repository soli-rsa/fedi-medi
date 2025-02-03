import { Word, WordCategory, WordDifficulty } from "./types";
import { medicalTerms } from "./medical-terms";
import { generalWords } from "./general-words";

class WordGenerator {
  private usedWords: Set<string>;
  private medicalWords: Word[];
  private generalWords: Word[];

  constructor() {
    this.usedWords = new Set();
    this.medicalWords = medicalTerms.map(term => ({
      word: term.word,
      definition: term.definition,
      category: 'medical' as WordCategory
    }));
    this.generalWords = generalWords;
  }

  generateWord(category: WordCategory | 'mixed' = 'medical', difficulty: WordDifficulty = 'moderate'): Word {
    let sourceList = category === 'medical' ? this.medicalWords :
                    category === 'general' ? this.generalWords :
                    [...this.medicalWords, ...this.generalWords];

    // Filter by difficulty if needed
    sourceList = this.filterByDifficulty(sourceList, difficulty);

    // Get unused words
    const availableWords = sourceList.filter(word => !this.usedWords.has(word.word));

    // If all words have been used, reset the used words set
    if (availableWords.length === 0) {
      this.usedWords.clear();
      return this.generateWord(category, difficulty);
    }

    // Select a random word
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];

    // Mark as used
    this.usedWords.add(selectedWord.word);

    return selectedWord;
  }

  private filterByDifficulty(words: Word[], difficulty: WordDifficulty): Word[] {
    // Simple difficulty implementation based on word length and common letters
    const commonLetters = new Set(['E', 'A', 'R', 'I', 'O', 'T', 'N', 'S', 'L']);
    
    return words.filter(word => {
      const commonLetterCount = word.word.split('').filter(letter => commonLetters.has(letter)).length;
      const difficultyScore = (commonLetterCount / word.word.length) * 100;
      
      switch(difficulty) {
        case 'easy':
          return difficultyScore > 60;
        case 'moderate':
          return difficultyScore >= 40 && difficultyScore <= 60;
        case 'hard':
          return difficultyScore < 40;
        default:
          return true;
      }
    });
  }

  isValidWord(word: string): boolean {
    const upperWord = word.toUpperCase();
    return [...this.medicalWords, ...this.generalWords].some(w => w.word === upperWord);
  }

  getWordDefinition(word: string): string | undefined {
    const upperWord = word.toUpperCase();
    const foundWord = [...this.medicalWords, ...this.generalWords].find(w => w.word === upperWord);
    return foundWord?.definition;
  }
}

// Create a singleton instance
const wordGenerator = new WordGenerator();

export const getRandomWord = (): string => {
  const word = wordGenerator.generateWord();
  return word.word;
};

export const isValidWord = (word: string): boolean => {
  return wordGenerator.isValidWord(word);
};

export const getWordDefinition = (word: string): string | undefined => {
  return wordGenerator.getWordDefinition(word);
};
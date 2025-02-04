import { Word, WordCategory, WordDifficulty } from "./types";
import { medicalTerms } from "./medical-terms";
import { generalWords } from "./general-words";

class WordGenerator {
  private usedWords: Set<string>;
  private medicalWords: Word[];
  private generalWords: Word[];

  constructor() {
    this.usedWords = new Set();
    this.medicalWords = medicalTerms;
    this.generalWords = generalWords;
    console.log("WordGenerator initialized with", this.medicalWords.length, "medical words and", this.generalWords.length, "general words");
  }

  generateWord(category: WordCategory = 'medical', difficulty: WordDifficulty = 'moderate'): Word {
    console.log("Generating word for category:", category, "with difficulty:", difficulty);
    
    let sourceList = category === 'medical' ? this.medicalWords : this.generalWords;
    sourceList = this.filterByDifficulty(sourceList, difficulty);
    
    const availableWords = sourceList.filter(word => !this.usedWords.has(word.word));
    
    if (availableWords.length === 0) {
      console.log("No available words, resetting used words");
      this.usedWords.clear();
      return this.generateWord(category, difficulty);
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    this.usedWords.add(selectedWord.word);
    
    console.log("Selected word:", selectedWord.word, "from category:", selectedWord.category);
    return selectedWord;
  }

  private filterByDifficulty(words: Word[], difficulty: WordDifficulty): Word[] {
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

export const getRandomWord = (category: WordCategory = 'medical'): string => {
  const word = wordGenerator.generateWord(category);
  return word.word;
};

export const isValidWord = (word: string): boolean => {
  return wordGenerator.isValidWord(word);
};

export const getWordDefinition = (word: string): string | undefined => {
  return wordGenerator.getWordDefinition(word);
};
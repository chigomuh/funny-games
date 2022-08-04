import { Word } from "typings/wordChain";

/**
 *
 * @param word 확인하고 싶은 단어
 * @param wordList 단어 리스트
 * @returns {
 *   isPrevious: boolen;
 * }
 */
const isPreviousWords = (word: string, wordList: Word[]) => {
  let isPrevious = false;

  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i].word === word) {
      isPrevious = true;
      break;
    }
  }

  return {
    isPrevious,
  };
};

export default isPreviousWords;

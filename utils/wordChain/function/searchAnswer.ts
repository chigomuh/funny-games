import { Word } from "typings/wordChain";
import getWordAnswer from "utils/wordChain/function/getWordAnswer";

const searchAnswer = async (
  nextChar: string,
  wordHistory: Word[],
  currentPage: number
): Promise<{
  error: boolean;
  word: Word | undefined;
}> => {
  const { word, page, error } = await getWordAnswer(
    nextChar,
    wordHistory,
    currentPage
  );

  if (error) {
    return {
      error: true,
      word: undefined,
    };
  }

  if (word) {
    return {
      error: false,
      word: word,
    };
  }

  if (page !== 1) {
    const { word: originWord, error } = await getWordAnswer(
      nextChar,
      wordHistory,
      1
    );

    if (error) {
      return {
        error: true,
        word: undefined,
      };
    }

    if (originWord) {
      return {
        error: false,
        word: originWord,
      };
    }
  }

  return {
    error: false,
    word: undefined,
  };
};

export default searchAnswer;

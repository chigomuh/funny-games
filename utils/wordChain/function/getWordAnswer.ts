import axios from "axios";
import { Word } from "typings/wordChain";
import getKoreanChar from "utils/wordChain/function/getKoreanChar";
import mergeKoreanChar from "utils/wordChain/function/mergeKoreanChar";

const HOST = process.env.NEXT_PUBLIC_HOST;

/**
 * endWord로 시작하는 단어를 찾아요
 * - wordHistory에 입력된 단어는 제외
 * @param endWord
 * @param wordHistory
 * @param page
 * @returns Promise<{
 *    success: boolean;
 *    result: boolean;
 *    word: Word | undefined;
 *    page: number
 * }>
 */
const getWordAnswer = async (
  endWord: string,
  wordHistory: Word[],
  page: number
): Promise<{
  success: boolean;
  result: boolean;
  word: Word | undefined;
  page: number;
  error: boolean;
}> => {
  // 끝단어와 페이지로 단어 fetch
  const url = `${HOST}/api/stdict?type=answer&word=${endWord}&start=${page}`;

  try {
    const json = await axios(url);
    const {
      data: { channel },
    } = await json.data;

    // 만약, data.channel이 있다면 -> 단어가 있긴 있다
    if (channel) {
      // 단어 리스트를 돌면서
      for (let i = 0; i < channel.item.length; i++) {
        const item: Word = channel.item[i];

        // 한 글자인 경우 continue;
        if (item.word.length === 1) continue;

        // 단어 히스토리를 돌면서
        let isPrevWord = false;
        const replaceItemWord = item.word.replace(/[^가-힣]/g, "");
        for (let j = 0; j < wordHistory.length; j++) {
          // 만약, 단어 히스토리에 있는 단어인 경우
          if (wordHistory[j].word === replaceItemWord) {
            // 이미 있는 단어이다 -> for 탈출
            isPrevWord = true;
            break;
          }
        }

        // 이미 있는 단어인 경우 continue;
        if (isPrevWord) continue;

        // 해당 단어가 정답으로 가능한 경우 return for 탈출
        const word: Word = {
          ...item,
          word: replaceItemWord,
          entered: "bot",
        };

        return {
          word,
          success: true,
          result: true,
          page,
          error: false,
        };
      }

      // fetch한 단어 리스트 모두 유효한 단어가 아닌 경우
      // 다음 페이지 fetch
      let noData = false;
      let nextPage = page + 1;
      while (!noData) {
        const nextData = await getWordAnswer(endWord, wordHistory, nextPage);

        // 애초에 데이터가 없는 경우
        if (!nextData.result) {
          noData = true;
          return {
            success: false,
            result: false,
            word: undefined,
            page,
            error: false,
          };
        }

        // 페이지를 돌다가 단어를 찾은 경우
        if (nextData.success) {
          return {
            success: true,
            result: true,
            word: nextData.word,
            page: nextData.page,
            error: false,
          };
        }

        nextPage += 1;
      }

      return {
        success: false,
        result: false,
        word: undefined,
        page,
        error: false,
      };
    } else {
      // 만약, 단어가 없는 경우, 두음 법칙이 적용되는가?
      const {
        startChar: endStartChar,
        middleChar: endMiddleChar,
        endChar: endEndChar,
      } = getKoreanChar(endWord);

      // 초성이 "ㄴ"인 경우
      if (endStartChar === "ㄴ") {
        // "ㅇ"으로 바꾸고 단어 찾기
        const word = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);
        const data = await getWordAnswer(word, wordHistory, page);

        if (data) {
          return {
            success: data.success,
            word: data.word,
            page: data.page,
            result: true,
            error: false,
          };
        } else {
          return {
            success: false,
            word: undefined,
            page,
            result: false,
            error: false,
          };
        }
      } else if (endStartChar === "ㄹ") {
        const word1 = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);
        const data1 = await getWordAnswer(word1, wordHistory, page);

        if (data1) {
          return data1;
        } else {
          const word2 = mergeKoreanChar(["ㄴ", endMiddleChar, endEndChar]);

          const data2 = await getWordAnswer(word2, wordHistory, page);

          if (data2) {
            return data2;
          } else {
            return {
              success: false,
              word: undefined,
              page,
              result: false,
              error: false,
            };
          }
        }
      }

      return {
        success: false,
        result: false,
        word: undefined,
        page,
        error: false,
      };
    }
  } catch (error: unknown) {
    const errorReturn = {
      success: false,
      result: false,
      word: undefined,
      page,
      error: true,
    };

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        return errorReturn;
      } else if (error.request) {
        console.log(error.request);
        return errorReturn;
      } else {
        console.log(`Error, ${error.message}`);
        return errorReturn;
      }
    } else {
      console.log(error);
      return errorReturn;
    }
  }
};

export default getWordAnswer;

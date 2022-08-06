import axios, { AxiosError } from "axios";
import { Word } from "typings/wordChain";

const HOST = process.env.NEXT_PUBLIC_HOST;

/**
 * 유효한 단어인지 확인 함수
 * word를 표준국어대사전 api로 검증해요
 * @params word
 * @returns {
 *  verification: true | false,
 *  data: word response Data | undefined
 * }
 */
const verificationWord = async (
  word: string
): Promise<{
  verification: boolean;
  data: Word | undefined;
  error: boolean;
}> => {
  const url = `${HOST}/api/stdict?type=verification&word=${word}`;
  try {
    const json = await axios(url);
    const data = json.data;

    if (data.data.channel) {
      const item = data.data.channel.item[0];
      const word: Word = {
        ...item,
        word: item.word.replace(/[^가-힣]/g, ""),
        entered: "user",
      };

      return {
        verification: true,
        data: word,
        error: false,
      };
    } else {
      return {
        verification: false,
        data: undefined,
        error: false,
      };
    }
  } catch (error: unknown) {
    const errorReturn = {
      verification: false,
      data: undefined,
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

export default verificationWord;

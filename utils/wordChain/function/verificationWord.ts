import axios from "axios";

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
const verificationWord = async (word: string) => {
  const url = `${HOST}/api/stdict?type=verification&word=${word}`;
  const json = await axios(url);
  const data = await json.data;

  if (data.data.channel) {
    return {
      verification: true,
      data: data.data.channel.item[0],
    };
  } else {
    return {
      verification: false,
      data: undefined,
    };
  }
};

export default verificationWord;

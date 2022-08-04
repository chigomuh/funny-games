import { endChars, middleChars, startChars } from "../constant";

const getKoreanChar = (word: string) => {
  // "가" 유니코드
  const ga = 44032;

  // 매개변수 word와 "가" 유니코드 차이
  const unicode = word.charCodeAt(0) - ga;

  // 초성: 유니코드 +588마다 변경
  // ㄱ => 1 / ㄲ => 589
  const startCharIndex = Math.floor(unicode / 588);

  // 중성: 유니코드 +28마다 변경
  // ㅏ => 1 / ㅐ => 29
  const middleCharIndex = Math.floor((unicode - startCharIndex * 588) / 28);

  // 종성: endChars.length로 나눈 나머지
  const endCharIndex = Math.floor(unicode % 28);

  return {
    startChar: startChars[startCharIndex],
    middleChar: middleChars[middleCharIndex],
    endChar: endChars[endCharIndex],
  };
};

export default getKoreanChar;

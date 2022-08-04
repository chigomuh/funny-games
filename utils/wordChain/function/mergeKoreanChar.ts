import { endChars, middleChars, startChars } from "../constant";

/**
 * 참조: https://zetawiki.com/wiki/%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C_%ED%95%9C%EA%B8%80_%EC%B4%88%EC%84%B1,_%EC%A4%91%EC%84%B1,_%EC%A2%85%EC%84%B1_%EC%A1%B0%ED%95%A9_%EC%9B%90%EB%A6%AC
 * @param charArr: string[]
 * @returns string;
 */
const mergeKoreanChar = (charArr: string[]) => {
  const startChar = charArr[0] || "";
  const middleChar = charArr[1] || "";
  const endChar = charArr[2] || "";

  const startCharIndex = startChars.indexOf(startChar);
  const middleCharIndex = middleChars.indexOf(middleChar);
  const endCharIndex = endChars.indexOf(endChar);

  const word = String.fromCharCode(
    0xac00 + 21 * 28 * startCharIndex + 28 * middleCharIndex + endCharIndex
  );

  return word;
};

export default mergeKoreanChar;

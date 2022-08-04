import Seo from "components/layout/Seo";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Word } from "typings/wordChain";
import { WORDS } from "utils/wordChain/constant";
import getWordAnswer from "utils/wordChain/function/getWordAnswer";
import getKoreanChar from "utils/wordChain/function/getKoreanChar";
import mergeKoreanChar from "utils/wordChain/function/mergeKoreanChar";
import verificationWord from "utils/wordChain/function/verificationWord";
import isPreviousWords from "utils/wordChain/function/isPreviousWords";
import BigButton from "components/common/BigButton";

const WordChain = () => {
  const [gameStart, setGameStart] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(false);
  const [wordValue, setWordValue] = useState("");
  const [wordHistory, setWordHistory] = useState<Word[]>([]);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verfication, setVerification] = useState(false);
  const randomPage = Math.floor(Math.random() * 10) + 1;
  const currentPage = useRef(randomPage);
  const [gameDone, setGameDone] = useState(true);

  const changePlayerTurn = () => {
    if (currentTurn) {
      setWordValue("");
    }
    setCurrentTurn((prev) => !prev);
  };

  const searchAnswer = async (nextChar: string) => {
    const { word, page } = await getWordAnswer(
      nextChar,
      wordHistory,
      currentPage.current
    );

    if (word) {
      setWordHistory((prev) => [...prev, word]);
      changePlayerTurn();
      return;
    }

    if (page !== 1) {
      const { word: originWord } = await getWordAnswer(
        nextChar,
        wordHistory,
        1
      );

      if (originWord) {
        setWordHistory((prev) => [...prev, originWord]);
        changePlayerTurn();
        return;
      }
    }

    alert("플레이어 승리!");
  };

  const verificationUserValue = async (userWord: string) => {
    setVerificationLoading(true);
    const { verification, data } = await verificationWord(userWord);
    setVerificationLoading(false);
    setVerification(verification);

    if (!verification) {
      alert("단어가 없어요, 게임패배");
      return;
    }

    if (data) {
      const nextChar = userWord[userWord.length - 1];
      setWordHistory((prev) => [...prev, data]);
      currentPage.current = Math.floor(Math.random() * 30) + 1;
      searchAnswer(nextChar);
      return;
    }
  };

  const onClickChangeTurn = (currentTurn?: string) => async () => {
    if (currentTurn === "user") {
      setCurrentTurn(true);
      setGameDone(false);
      setGameStart(true);
    } else if (currentTurn === "bot") {
      const randomIndex = Math.floor(Math.random() * WORDS.length);
      const word = WORDS[randomIndex];
      setCurrentTurn(false);
      await searchAnswer(word);
      setGameDone(false);
      setGameStart(true);
    }
  };

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setWordValue(value);
  };

  const onSubmitAnswer = async (event: FormEvent) => {
    event.preventDefault();
    changePlayerTurn();

    const userWord = wordValue;

    // 한글 단어만 가능
    const replaceUserWord = userWord.replace(/[^가-힣]/g, "");

    if (userWord !== replaceUserWord) {
      alert("한글을 입력하세요!");
      changePlayerTurn();
      return;
    }

    // 1자리 입력? => return
    if (userWord.length === 1) {
      alert("한자리는 안돼요");
      changePlayerTurn();
      return;
    }

    const lastChar = wordHistory.at(-1)?.word.at(-1);

    // 마지막 글자와 다른 글자 입력? => return
    if (lastChar && lastChar !== userWord[0]) {
      const {
        startChar: endStartChar,
        middleChar: endMiddleChar,
        endChar: endEndChar,
      } = getKoreanChar(lastChar);
      const { startChar: userChar } = getKoreanChar(userWord[0]);

      if (endStartChar === "ㄴ" && userChar === "ㅇ") {
        const word = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);

        if (userWord[0] !== word) {
          alert(`두음법칙을 적용해도 첫글자가 달라요. ${userChar} ${word}`);
          changePlayerTurn();
          return;
        }

        verificationUserValue(userWord);
        return;
      } else if (endStartChar === "ㄹ") {
        if (userChar === "ㅇ" || userChar === "ㄴ") {
          const word1 = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);
          const word2 = mergeKoreanChar(["ㄴ", endMiddleChar, endEndChar]);

          if (userWord[0] !== word1 && userWord[0] !== word2) {
            alert(
              `두음법칙을 적용해도 첫글자가 달라요. ${userChar} ${word1} ${word2}`
            );
            changePlayerTurn();
            return;
          }

          // 검증
          verificationUserValue(userWord);
          return;
        }
      }

      alert("앞자리가 달려융");
      changePlayerTurn();
      return;
    }

    // 이미 입력한 단어? => return
    const { isPrevious } = isPreviousWords(userWord, wordHistory);

    if (isPrevious) {
      alert("이미 입력했슈");
      changePlayerTurn();
      return;
    }

    // 표준국어대사전에 있는 경우? => 저장, 플레이어 변경...
    verificationUserValue(userWord);
  };

  return (
    <>
      <Seo title="끝말잇기" />
      <div>
        {!gameStart && (
          <>
            <BigButton text="선공" onClick={onClickChangeTurn("user")} />
            <BigButton text="후공" onClick={onClickChangeTurn("bot")} />
          </>
        )}
        {gameStart && (
          <>
            <div>게임시작</div>
            <div>현재 순서: {currentTurn ? "유저" : "컴퓨터"}</div>
            {wordHistory.length !== 0 && (
              <>
                <div>현재 단어: {wordHistory.at(-1)?.word}</div>
                <div>총 {Math.floor(wordHistory.length / 2)}번 진행했어요</div>
              </>
            )}
            <form onSubmit={onSubmitAnswer}>
              <label>단어: </label>
              <input
                type="text"
                placeholder="입력해봐요"
                value={wordValue}
                onChange={onChangeValue}
                disabled={!currentTurn}
                autoFocus={true}
              />
              {verificationLoading ? (
                <span className="">검증 중...</span>
              ) : !currentTurn ? (
                <span className="animate-checked">
                  {verfication ? "인정!" : "실패!"}
                </span>
              ) : null}
              <button type="submit" disabled={!currentTurn}>
                전송하기
              </button>
            </form>
            {wordHistory.map((word) => (
              <div key={word.target_code}>
                <div>{word.word}</div>
                <div>{word.sense.definition}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default WordChain;

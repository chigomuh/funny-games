import Seo from "components/layout/Seo";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Word } from "typings/wordChain";
import { WORDS } from "utils/wordChain/constant";
import getWordAnswer from "utils/wordChain/function/getWordAnswer";
import getKoreanChar from "utils/wordChain/function/getKoreanChar";
import mergeKoreanChar from "utils/wordChain/function/mergeKoreanChar";
import verificationWord from "utils/wordChain/function/verificationWord";
import isPreviousWords from "utils/wordChain/function/isPreviousWords";
import BigButton from "components/common/BigButton";
import { useRouter } from "next/router";
import { MAIN_BG_COLOR } from "components/common/constant.style";

const STYLE_CONSTANT = {
  buttonBg: "bg-[#ffe500]",
  formBg: "bg-[#ffffff]",
  chatPageBg: "bg-[#b2c7da]",
  userChatBg: "bg-[#ffeb33]",
  botChatBg: "bg-[#ffffff]",
};

const WordChain = () => {
  const [gameStart, setGameStart] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(false);
  const [wordValue, setWordValue] = useState("");
  const [wordHistory, setWordHistory] = useState<Word[]>([]);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verfication, setVerification] = useState(false);
  const randomPage = Math.floor(Math.random() * 10) + 1;
  const currentPage = useRef(randomPage);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const inputValueRef = useRef<HTMLInputElement>(null);
  const [gameDone, setGameDone] = useState(false);
  const router = useRouter();

  const { buttonBg, formBg, chatPageBg, userChatBg, botChatBg } =
    STYLE_CONSTANT;

  const scrollBottom = () => {
    if (chatLogRef.current) {
      const { scrollHeight } = chatLogRef.current;
      window.scrollTo(0, scrollHeight);
    }
  };

  const setFocus = () => {
    if (inputValueRef.current) {
      const { current } = inputValueRef;
      current.disabled = false;
      current.focus();
    }
  };

  const setDisabled = () => {
    if (inputValueRef.current) {
      const { current } = inputValueRef;
      current.blur();
      current.disabled = true;
    }
  };

  const reStartGame = () => {
    setGameStart(false);
    setWordHistory([]);
    setWordValue("");
    setVerificationLoading(false);
    setVerification(false);
    setGameDone(false);
  };

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

      setFocus();
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

        setFocus();
        return;
      }
    }

    alert("플레이어 승리!");
    setGameDone(true);
  };

  const verificationUserValue = async (userWord: string) => {
    setVerificationLoading(true);
    const { verification, data } = await verificationWord(userWord);
    setVerificationLoading(false);
    setVerification(verification);

    if (!verification) {
      alert("단어가 없어요, 게임패배");
      setGameDone(true);
      return;
    }

    if (data) {
      const nextChar = userWord[userWord.length - 1];
      setWordHistory((prev) => [...prev, data]);
      currentPage.current = Math.floor(Math.random() * 30) + 1;
      await searchAnswer(nextChar);

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

    setDisabled();

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

  useEffect(() => {
    scrollBottom();
  }, [wordHistory]);

  return (
    <>
      <Seo title="끝말잇기" />

      {!gameStart && (
        <>
          <div
            className={`flex items-center justify-center w-screen h-screen space-x-4 ${MAIN_BG_COLOR}`}
          >
            <BigButton text="선공" onClick={onClickChangeTurn("user")} />
            <BigButton text="후공" onClick={onClickChangeTurn("bot")} />
          </div>
        </>
      )}
      {gameStart && (
        <div
          className={`w-full h-screen flex flex-col justify-between ${chatPageBg}`}
        >
          <div className={`${chatPageBg}`}>
            <div className={`${chatPageBg} w-full sticky top-0 left-0 z-50`}>
              <div>{gameDone ? "게임 끝" : "게임시작"}</div>
              {gameDone && (
                <>
                  <div className="w-30 h-30" onClick={reStartGame}>
                    다시 하기
                  </div>
                  <div className="w-30 h-30" onClick={() => router.push("/")}>
                    운동장 가기
                  </div>
                </>
              )}
              <div>현재 순서: {currentTurn ? "유저" : "컴퓨터"}</div>
              {wordHistory.length !== 0 && (
                <>
                  <div>현재 단어: {wordHistory.at(-1)?.word}</div>
                  <div>
                    총 {Math.floor(wordHistory.length / 2)}번 진행했어요
                  </div>
                </>
              )}
            </div>
            <div className={`w-full flex flex-col justify-start z-10 sticky`}>
              <div className={`bottom-0`} ref={chatLogRef}>
                {wordHistory.map((word) => (
                  <div key={word.target_code}>
                    <div
                      className={`${
                        word.entered === "user" ? userChatBg : botChatBg
                      }`}
                    >
                      {word.word}
                    </div>
                    <div>{word.sense.definition}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 left-0 z-50 w-full">
            <form
              onSubmit={onSubmitAnswer}
              className={`flex items-center justify-between ${formBg} w-full`}
            >
              <label>단어: </label>
              <input
                type="text"
                placeholder="입력해봐요"
                value={wordValue}
                onChange={onChangeValue}
                ref={inputValueRef}
                autoFocus={true}
              />
              {verificationLoading ? (
                <span className="">검증 중...</span>
              ) : !currentTurn ? (
                <span className="animate-checked">
                  {verfication ? "인정!" : "실패!"}
                </span>
              ) : null}
              <button
                type="submit"
                disabled={!currentTurn}
                className={`${buttonBg}`}
              >
                전송하기
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WordChain;

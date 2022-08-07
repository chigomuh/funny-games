import Seo from "components/layout/Seo";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Word } from "typings/wordChain";
import { WORDS } from "utils/wordChain/constant";
import getWordAnswer from "utils/wordChain/function/getWordAnswer";
import getKoreanChar from "utils/wordChain/function/getKoreanChar";
import mergeKoreanChar from "utils/wordChain/function/mergeKoreanChar";
import verificationWord from "utils/wordChain/function/verificationWord";
import isPreviousWords from "utils/wordChain/function/isPreviousWords";
import { useRouter } from "next/router";
import { STYLE_CONSTANT } from "components/wordChain/constant.style";
import ChatText from "components/common/ChatText";
import Error from "components/wordChain/Error";
import Header from "components/wordChain/Layout/Header";
import Image from "next/image";

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
  const [notice, setNotice] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const infoText =
    "게임 규칙은 다음과 같아요.\n\n1. 어휘 / 명사 / 고유어, 한자어, 외래어, 혼종어만 허용돼요.\n\n2. 두음 법칙이 적용돼요.\n- 'ㄴ' 👉 'ㅇ'\n- 'ㄹ' 👉 'ㄴ' / 'ㅇ'\n\n3. 글자 수 제한은 없어요.";

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
    }
    setCurrentTurn(true);
    setWordValue("");
  };

  const setDisabled = () => {
    if (inputValueRef.current) {
      const { current } = inputValueRef;
      current.blur();
      current.disabled = true;
    }
    setCurrentTurn(false);
    setWordValue("");
  };

  const reStartGame = () => {
    setGameStart(false);
    setWordHistory([]);
    setWordValue("");
    setVerificationLoading(false);
    setVerification(false);
    setGameDone(false);
    setNotice("");
    setError(false);
  };

  const searchAnswer = async (nextChar: string) => {
    setIsSearch(true);
    const { word, page, error } = await getWordAnswer(
      nextChar,
      wordHistory,
      currentPage.current
    );

    if (error) {
      setError(true);
    }

    if (word) {
      setWordHistory((prev) => [...prev, word]);
      setFocus();
      setIsSearch(false);
      return;
    }

    if (page !== 1) {
      const { word: originWord, error } = await getWordAnswer(
        nextChar,
        wordHistory,
        1
      );

      if (error) {
        setError(true);
      }

      if (originWord) {
        setWordHistory((prev) => [...prev, originWord]);
        setFocus();
        setIsSearch(false);
        return;
      }
    }
    setIsSearch(false);
    setNotice("플레이어 승리!");
    setGameDone(true);
    setDisabled();
  };

  const verificationUserValue = async (userWord: string) => {
    setVerificationLoading(true);
    const { verification, data, error } = await verificationWord(userWord);
    if (error) {
      setError(true);
    }
    setVerificationLoading(false);
    setVerification(verification);

    if (!verification) {
      setNotice("단어가 없어요, 게임패배");
      setGameDone(true);
      setDisabled();
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

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;

    setWordValue(value);
  };

  const onSubmitAnswer = async (event: FormEvent) => {
    event.preventDefault();

    setDisabled();

    const userWord = wordValue;

    if (userWord === "") return;

    // 한글 단어만 가능
    const replaceUserWord = userWord.replace(/[^가-힣]/g, "");

    if (userWord !== replaceUserWord) {
      setNotice("한글을 입력하세요!");
      setFocus();
      return;
    }

    // 1자리 입력? => return
    if (userWord.length === 1) {
      setNotice("한자리는 안돼요");
      setFocus();
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
          setNotice(`두음법칙을 적용해도 첫글자가 달라요.`);
          setFocus();
          return;
        }

        verificationUserValue(userWord);
        return;
      } else if (endStartChar === "ㄹ") {
        if (userChar === "ㅇ" || userChar === "ㄴ") {
          const word1 = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);
          const word2 = mergeKoreanChar(["ㄴ", endMiddleChar, endEndChar]);

          if (userWord[0] !== word1 && userWord[0] !== word2) {
            setNotice(`두음법칙을 적용해도 첫글자가 달라요.`);
            setFocus();
            return;
          }

          // 검증
          verificationUserValue(userWord);
          return;
        }
      }

      setNotice("앞자리가 달려융");
      setFocus();
      return;
    }

    // 이미 입력한 단어? => return
    const { isPrevious } = isPreviousWords(userWord, wordHistory);

    if (isPrevious) {
      setNotice("이미 입력했슈");
      setFocus();
      return;
    }

    // 표준국어대사전에 있는 경우? => 저장, 플레이어 변경...
    verificationUserValue(userWord);
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
      setGameStart(true);
      await searchAnswer(word);
      setGameDone(false);
    }
  };

  useEffect(() => {
    scrollBottom();
  }, [wordHistory, gameDone]);

  return (
    <>
      <Seo title="끝말잇기" />
      {error && <Error reStartGame={reStartGame} />}
      {/* 여기 부터 게임 스타트 */}
      <div
        className={`w-full h-screen flex flex-col justify-between ${chatPageBg} relative`}
      >
        <div className={`${chatPageBg}`}>
          <Header wordHistory={wordHistory} />
          <div className={`w-full flex flex-col justify-start z-10 p-2`}>
            <div className={`space-y-2`} ref={chatLogRef}>
              <div className={`flex flex-col space-y-2`}>
                <ChatText
                  text={infoText}
                  backgroundColor={botChatBg}
                  dangerouslySet={false}
                />
                {!gameStart && (
                  <span
                    className={`${botChatBg} w-fit max-w-[250px] rounded-md p-2 relative whitespace-pre-line flex`}
                  >
                    <div
                      className={`${userChatBg} w-24 h-16 mr-2 flex justify-center items-center font-bold text-xl rounded-md cursor-pointer`}
                      onClick={onClickChangeTurn("user")}
                    >
                      선공
                    </div>
                    <div
                      className={`${userChatBg} w-24 h-16 ml-2 flex justify-center items-center font-bold text-xl rounded-md cursor-pointer`}
                      onClick={onClickChangeTurn("bot")}
                    >
                      후공
                    </div>
                    <span
                      className={`absolute top-[10px] left-0 after:content-[''] after:absolute after:border-[8px] after:border-t-[#ffffff] after:border-r-transparent after:border-b-transparent after:border-l-transparent after:left-[-8px] after:top-10px`}
                    ></span>
                  </span>
                )}
              </div>
              {wordHistory.map((word) => (
                <div
                  key={word.target_code}
                  className={`flex flex-col ${
                    word.entered === "user" ? "items-end" : "items-start"
                  } space-y-2`}
                >
                  <ChatText
                    text={word.word}
                    backgroundColor={
                      word.entered === "user" ? userChatBg : botChatBg
                    }
                    dangerouslySet={false}
                  />
                  <ChatText
                    text={word.sense.definition}
                    backgroundColor={
                      word.entered === "user" ? userChatBg : botChatBg
                    }
                    dangerouslySet={true}
                  />
                </div>
              ))}
              {isSearch && (
                <>
                  <div className="relative flex flex-col items-start space-y-2">
                    <span
                      className={`${botChatBg} w-16 h-10 rounded-md p-2 flex items-center justify-around relative`}
                    >
                      <div className="w-2 h-2 bg-[#9b9b9e] rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-[#9b9b9e] rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-[#9b9b9e] rounded-full animate-pulse"></div>
                      <span
                        className={`absolute top-[10px] left-0 after:content-[''] after:absolute after:border-[8px] after:border-t-[#ffffff] after:border-r-transparent after:border-b-transparent after:border-l-transparent after:left-[-8px] after:top-10px`}
                      ></span>
                    </span>
                  </div>
                </>
              )}
              {gameDone && (
                <div
                  className={`flex flex-col items-start w-60 ${botChatBg} p-2 rounded-md space-y-2`}
                >
                  <div>게임 종료!</div>
                  <div className="w-full space-y-2">
                    <div
                      className="bg-[#f5f5f5] w-full text-center p-2 rounded-md"
                      onClick={reStartGame}
                    >
                      다시 하기
                    </div>
                    <div
                      className="bg-[#f5f5f5] w-full text-center p-2 rounded-md"
                      onClick={() => router.push("/")}
                    >
                      운동장 가기
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 left-0 z-50 w-full">
          <form
            onSubmit={onSubmitAnswer}
            className={`flex items-center justify-between ${formBg} w-full h-10`}
          >
            <input
              type="text"
              placeholder="단어를 입력해봐요"
              value={wordValue}
              onChange={onChangeValue}
              ref={inputValueRef}
              autoFocus={true}
              disabled={!gameStart}
              className={`w-4/5 px-2 outline-none disabled:bg-white disabled:border-0 cursor-text`}
            />
            <div className="flex items-center justify-center w-auto h-full space-x-2">
              {verificationLoading ? (
                <span className="flex items-center justify-center animate-spin">
                  <Image
                    src="/svgs/loading.svg"
                    alt="loading-icon"
                    width={30}
                    height={30}
                  />
                </span>
              ) : gameStart && !currentTurn ? (
                <span className="flex items-center justify-center animate-checked">
                  <Image
                    src={verfication ? "/svgs/check.svg" : "/svgs/fail.svg"}
                    alt="verification-info"
                    width={30}
                    height={30}
                  />
                </span>
              ) : null}
              <button
                type="submit"
                disabled={!currentTurn}
                className={`${buttonBg} flex justify-center items-center h-full w-10 cursor-pointer`}
              >
                <Image
                  src="/svgs/submit.svg"
                  alt="submit"
                  width={35}
                  height={35}
                  className="rotate-90"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default WordChain;

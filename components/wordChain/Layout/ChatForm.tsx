import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Word } from "typings/wordChain";
import getKoreanChar from "utils/wordChain/function/getKoreanChar";
import isPreviousWords from "utils/wordChain/function/isPreviousWords";
import mergeKoreanChar from "utils/wordChain/function/mergeKoreanChar";
import searchAnswer from "utils/wordChain/function/searchAnswer";
import verificationWord from "utils/wordChain/function/verificationWord";
import { STYLE_CONSTANT } from "components/wordChain/constant.style";

interface Props {
  setError: Dispatch<SetStateAction<boolean>>;
  setCurrentTurn: Dispatch<SetStateAction<boolean>>;
  setGameDone: Dispatch<SetStateAction<boolean>>;
  setWordHistory: Dispatch<SetStateAction<Word[]>>;
  setIsSearch: Dispatch<SetStateAction<boolean>>;
  wordHistory: Word[];
  currentTurn: boolean;
  gameStart: boolean;
}

const ChatForm = ({
  setError,
  setCurrentTurn,
  setGameDone,
  setWordHistory,
  setIsSearch,
  wordHistory,
  currentTurn,
  gameStart,
}: Props) => {
  const randomPage = Math.floor(Math.random() * 10) + 1;
  const currentPage = useRef(randomPage);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verfication, setVerification] = useState(false);
  const [wordValue, setWordValue] = useState("");
  const [notice, setNotice] = useState("");
  const inputValueRef = useRef<HTMLInputElement>(null);

  const { formBg, buttonBg } = STYLE_CONSTANT;

  const showNotice = (message: string) => {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 3000);
  };

  const setFocus = () => {
    if (inputValueRef.current) {
      const { current } = inputValueRef;
      current.disabled = false;
    }
  };

  const setDisabled = () => {
    if (inputValueRef.current) {
      const { current } = inputValueRef;
      current.blur();
      current.disabled = true;
    }
  };

  const verificationUserValue = async (userWord: string) => {
    setVerificationLoading(true);
    const {
      verification,
      data,
      error: verifyError,
    } = await verificationWord(userWord);
    setVerificationLoading(false);

    if (verifyError) {
      setError(verifyError);
      return;
    }

    setVerification(verification);

    if (!verification || !data) {
      showNotice("단어가 없어요, 게임패배...");
      setGameDone(true);
      setDisabled();
      setCurrentTurn(false);
      setWordValue("");
      return;
    }

    const nextChar = userWord[userWord.length - 1];
    setWordHistory((prev) => [...prev, data]);
    currentPage.current = Math.floor(Math.random() * 30) + 1;

    setIsSearch(true);
    const { word, error: searchError } = await searchAnswer(
      nextChar,
      wordHistory,
      currentPage.current
    );
    setIsSearch(false);

    // 에러: 에러 설정 리턴
    if (searchError) {
      setError(searchError);
      return;
    }

    // 단어 있음: 단어 저장, focus, search state 조정
    if (word) {
      setWordHistory((prev) => [...prev, word]);
      setFocus();
      setCurrentTurn(true);
      setWordValue("");
      return;
    }

    // 단어 없음: 플레이어 이김, 게임 끝,
    showNotice("플레이어 승리!");
    setGameDone(true);
    setDisabled();
    setCurrentTurn(false);
    setWordValue("");
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
    setCurrentTurn(false);
    setWordValue("");

    const userWord = wordValue;

    if (userWord === "") return;

    // 한글 단어만 가능
    const replaceUserWord = userWord.replace(/[^가-힣]/g, "");

    if (userWord !== replaceUserWord) {
      showNotice("한글을 입력하세요");
      setFocus();
      setCurrentTurn(true);
      setWordValue("");
      return;
    }

    // 1자리 입력? => return
    if (userWord.length === 1) {
      showNotice("한 글자는 안돼요");
      setFocus();
      setCurrentTurn(true);
      setWordValue("");
      return;
    }

    if (wordHistory.length === 0) {
      verificationUserValue(userWord);
      return;
    }

    const lastWord = wordHistory[wordHistory.length - 1].word;
    const lastChar = lastWord[lastWord.length - 1];

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
          showNotice(`두음법칙을 적용해도 첫 글자가 달라요`);
          setFocus();
          setCurrentTurn(true);
          setWordValue("");
          return;
        }

        verificationUserValue(userWord);
        return;
      } else if (endStartChar === "ㄹ") {
        if (userChar === "ㅇ" || userChar === "ㄴ") {
          const word1 = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);
          const word2 = mergeKoreanChar(["ㄴ", endMiddleChar, endEndChar]);

          if (userWord[0] !== word1 && userWord[0] !== word2) {
            showNotice(`두음법칙을 적용해도 첫 글자가 달라요`);
            setFocus();
            setCurrentTurn(true);
            setWordValue("");
            return;
          }

          // 검증
          verificationUserValue(userWord);
          return;
        }
      }

      showNotice("첫 글자가 달라요");
      setFocus();
      setCurrentTurn(true);
      setWordValue("");
      return;
    }

    // 이미 입력한 단어? => return
    const { isPrevious } = isPreviousWords(userWord, wordHistory);

    if (isPrevious) {
      showNotice("이미 입력한 단어에요");
      setFocus();
      setCurrentTurn(true);
      setWordValue("");
      return;
    }

    // 표준국어대사전에 있는 경우? => 저장, 플레이어 변경...
    verificationUserValue(userWord);
  };

  return (
    <div className="sticky bottom-0 left-0 z-50 w-full">
      {notice !== "" && (
        <div className="absolute top-0 right-12 flex items-center justify-center h-10 px-4 text-xs text-black -translate-y-[50px] bg-[#e3f7fc] rounded-md w-fit animate-checked">
          {notice}
          <span className="absolute top-[10px] after:content-[''] after:absolute after:border-[8px] after:border-t-[#e3f7fc] after:border-r-transparent after:border-b-transparent after:border-l-transparent after:top-[28px] after:right-[10px] right-0"></span>
        </div>
      )}
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
          disabled={!gameStart && !currentTurn}
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
            <span
              className={`flex items-center justify-center animate-checked`}
            >
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
  );
};

export default ChatForm;

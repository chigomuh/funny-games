import Seo from "components/layout/Seo";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Word } from "typings/wordChain";
import { WORDS } from "utils/wordChain/constant";
import getWordAnswer from "utils/wordChain/function/getWordAnswer";
import getKoreanChar from "utils/wordChain/function/getKoreanChar";
import mergeKoreanChar from "utils/wordChain/function/mergeKoreanChar";
import verificationWord from "utils/wordChain/function/verificationWord";
import isPreviousWords from "utils/wordChain/function/isPreviousWords";

const WordChain = () => {
  const [gameStart, setGameStart] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(false);
  const [wordValue, setWordValue] = useState("");
  const [wordHistory, setWordHistory] = useState<Word[]>([]);
  const randomPage = Math.floor(Math.random() * 30) + 1;
  const currentPage = useRef(randomPage);

  const changePlayerTurn = () => {
    setWordValue("");
    setCurrentTurn((prev) => !prev);
  };

  const onClickChangeTurn = (currentTurn?: string) => async () => {
    if (currentTurn === "user") {
      setCurrentTurn(true);
      setGameStart(true);
    } else if (currentTurn === "bot") {
      const randomIndex = Math.floor(Math.random() * WORDS.length);
      const word = WORDS[randomIndex];
      setCurrentTurn(false);
      const { word: startWord } = await getWordAnswer(
        word,
        wordHistory,
        currentPage.current
      );
      if (startWord) {
        setWordHistory((prev) => [...prev, startWord]);
      }

      changePlayerTurn();
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
    const lastChar = wordHistory.at(-1)?.word.at(-1);

    // 1자리 입력? => return
    if (userWord.length === 1) {
      alert("한자리는 안돼요");
      changePlayerTurn();
      return;
    }

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

        const { verification, data } = await verificationWord(userWord);

        if (verification) {
          setWordHistory((prev) => [...prev, data]);

          const nextChar = userWord.at(-1);

          if (currentTurn && nextChar) {
            const { word: nienWord } = await getWordAnswer(
              nextChar,
              wordHistory,
              currentPage.current
            );

            if (nienWord) {
              setWordHistory((prev) => [...prev, nienWord]);
            }
          }

          changePlayerTurn();
          return;
        }

        alert("단어가 없어요, 게임패배");
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
          const { verification, data } = await verificationWord(userWord);
          if (verification) {
            setWordHistory((prev) => [...prev, data]);
            currentPage.current = Math.floor(Math.random() * 30) + 1;
            const nextChar = userWord.at(-1);

            if (currentTurn && nextChar) {
              const { word: rielWord } = await getWordAnswer(
                nextChar,
                wordHistory,
                currentPage.current
              );

              if (rielWord) {
                setWordHistory((prev) => [...prev, rielWord]);
              } else {
                alert("플레이어 승리!");
              }
            }

            changePlayerTurn();
            return;
          }

          alert("단어가 없어요, 게임 패배");
          changePlayerTurn();
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
    const { verification, data: wordData } = await verificationWord(userWord);

    // 유저가 유효 값을 입력한 경우 컴퓨터가 다시 답 주기
    if (verification) {
      currentPage.current = Math.floor(Math.random() * 30) + 1;

      setWordHistory((prev) => [...prev, wordData]);

      const nextChar = userWord.at(-1);

      if (currentTurn && nextChar) {
        const { word: botWord, page } = await getWordAnswer(
          nextChar,
          wordHistory,
          currentPage.current
        );

        if (botWord) {
          setWordHistory((prev) => [...prev, botWord]);
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
      }
      return;
    }

    // 표준국어대사전에 없는 경우 => 게임 패배
    alert("해당 단어는 없어요, 게임 종료!");
  };

  return (
    <>
      <Seo title="끝말잇기" />
      <div>
        {!gameStart && (
          <>
            <button
              className="w-20 h-20 bg-green-300 border border-black"
              onClick={onClickChangeTurn("user")}
            >
              선공
            </button>
            <button
              className="w-20 h-20 bg-green-300 border border-black"
              onClick={onClickChangeTurn("bot")}
            >
              후공
            </button>
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

import Seo from "components/layout/Seo";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import axios from "axios";
import { Word } from "typings/wordChain";
import { getKoreanChar, mergeKoreanChar } from "utils/functions/getKoreanChar";
import { WORDS } from "utils/constant";

/**
 * 유효한 단어인지 확인 함수
 * return {
 *  verification: true | false,
 *  data: word response Data | undefined
 * }
 */
const verificationWord = async (word: string) => {
  const url = `/api/stdict?type=verification&word=${word}`;
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

const isPreviousWords = (word: string, wordList: Word[]) => {
  let isPrevious = false;

  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i].word === word) {
      isPrevious = true;
      break;
    }
  }

  return {
    isPrevious,
  };
};

const WordChain = () => {
  const [gameStart, setGameStart] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(false);
  const [wordValue, setWordValue] = useState("");
  const [wordHistory, setWordHistory] = useState<Word[]>([]);
  const randomPage = Math.floor(Math.random() * 30) + 1;
  const currentPage = useRef(randomPage);

  const getAnswer = async (endWord: string, page: number) => {
    const url = `/api/stdict?type=answer&word=${endWord}&start=${page}`;
    const json = await axios(url);
    const {
      data: { channel },
    } = await json.data;
    let findAnswer = false;

    if (channel) {
      for (let i = 0; i < channel.item.length; i++) {
        const item = channel.item[i];
        if (item.word.length === 1) continue;

        for (let j = 0; j < wordHistory.length; j++) {
          if (wordHistory[j].word === item.word) break;
        }

        setWordHistory((prev) => [...prev, item]);
        findAnswer = true;
        setCurrentTurn(true);

        break;
      }

      if (!findAnswer) {
        currentPage.current += 1;
        getAnswer(endWord, currentPage.current);
      }
    } else {
      const {
        startChar: endStartChar,
        middleChar: endMiddleChar,
        endChar: endEndChar,
      } = getKoreanChar(endWord);

      if (endStartChar === "ㄴ") {
        const word = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);
        getAnswer(word, currentPage.current);

        return;
      } else if (endStartChar === "ㄹ") {
        const word1 = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);
        const word2 = mergeKoreanChar(["ㄴ", endMiddleChar, endEndChar]);

        getAnswer(word1, currentPage.current);
        getAnswer(word2, currentPage.current);
      }

      alert("승리!");
    }
  };

  const changePlayerTurn = () => {
    setWordValue("");
    setCurrentTurn((prev) => !prev);
  };

  const onClickChangeTurn = (currentTurn?: string) => () => {
    if (currentTurn === "user") {
      setCurrentTurn(true);
      setGameStart(true);
    } else if (currentTurn === "bot") {
      const randomIndex = Math.floor(Math.random() * WORDS.length);
      const word = WORDS[randomIndex];
      getAnswer(word, currentPage.current);
      setCurrentTurn(false);
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
          alert("두음법칙을 다시 해봐요 'ㄴ' => 'ㅇ'");
          changePlayerTurn();
          return;
        }

        const { verification, data } = await verificationWord(userWord);

        if (verification) {
          setWordHistory((prev) => [...prev, data]);

          const nextChar = userWord.at(-1);

          if (currentTurn && nextChar) {
            getAnswer(nextChar, currentPage.current);
          }

          changePlayerTurn();
          return;
        }

        alert("단어가 없어요, 게임패배");
        changePlayerTurn();
        return;
      } else if (endStartChar === "ㄹ") {
        if (userChar === "ㅇ" || userChar === "ㄴ") {
          const word1 = mergeKoreanChar(["ㅇ", endMiddleChar, endEndChar]);
          const word2 = mergeKoreanChar(["ㄴ", endMiddleChar, endEndChar]);

          console.log(word1, word2);
          if (userWord[0] !== word1 && userWord[0] !== word2) {
            alert("두음법칙을 다시 해봐요 'ㄹ' => 'ㅇ, ㄴ'");
            changePlayerTurn();
            return;
          }

          // 검증
          const { verification, data } = await verificationWord(userWord);
          console.log(verification, data);
          if (verification) {
            currentPage.current = Math.floor(Math.random() * 30) + 1;

            setWordHistory((prev) => [...prev, data]);

            const nextChar = userWord.at(-1);

            if (currentTurn && nextChar) {
              getAnswer(nextChar, currentPage.current);
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
        await getAnswer(nextChar, currentPage.current);
        changePlayerTurn();
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
              <div>현재 단어: {wordHistory.at(-1)?.word}</div>
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

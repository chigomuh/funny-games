import Seo from "components/layout/Seo";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import axios from "axios";
import { Word } from "typings/wordChain";

const WordChain = () => {
  const [gameStart, setGameStart] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(false);
  const [wordValue, setWordValue] = useState("");
  const [wordHistory, setWordHistory] = useState<Word[]>([]);
  const wordList = useRef<string[]>([]);
  const currentPage = useRef(1);

  const onClickChangeTurn = (currentTurn?: string) => () => {
    if (!currentTurn) {
      setCurrentTurn((prev) => !prev);

      return;
    }
    if (currentTurn === "user") {
      setCurrentTurn(true);
      setGameStart(true);
    } else if (currentTurn === "bot") {
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

    const userWord = wordValue;
    const lastChar = wordHistory.at(-1)?.word.at(-1);

    if (wordList.current.length !== 0 && lastChar !== userWord[0]) {
      alert("앞자리가 달려융");

      return;
    }

    if (wordList.current.includes(userWord)) {
      alert("이미 입력했슈");

      return;
    }

    const url = `/api/stdict?type=verification&word=${userWord}`;
    const json = await axios(url);
    const data = await json.data;

    if (data.data.channel) {
      setWordHistory((prev) => [...prev, data.data.channel.item[0]]);
      wordList.current = [...wordList.current, userWord];
      setWordValue("");
      setCurrentTurn((prev) => !prev);

      if (currentTurn) {
        const getAnswer = async (page: number) => {
          const url = `/api/stdict?type=answer&word=${userWord.at(
            -1
          )}&start=${page}`;
          const json = await axios(url);
          const {
            data: { channel },
          } = await json.data;
          let findAnswer = false;

          if (channel) {
            for (let i = 0; i < channel.item.length; i++) {
              const item = channel.item[i];
              if (
                item.word.length !== 1 &&
                !wordList.current.includes(item.word)
              ) {
                setWordHistory((prev) => [...prev, item]);
                wordList.current = [...wordList.current, item.word];
                findAnswer = true;
                setCurrentTurn(true);

                break;
              }
            }

            if (!findAnswer) {
              currentPage.current += 1;
              getAnswer(currentPage.current);
            }
          }
        };

        getAnswer(currentPage.current);
      }

      return;
    }

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

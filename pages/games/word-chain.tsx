import Seo from "components/layout/Seo";
import { ChangeEvent, useState } from "react";

const WordChain = () => {
  const [gameStart, setGameStart] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(false);
  const [wordValue, setWordValue] = useState("");

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

  console.log(currentTurn);

  return (
    <>
      <Seo title="끝말잇기" />
      <div>
        {!gameStart && (
          <>
            <button
              className="border border-black w-20 h-20 bg-green-300"
              onClick={onClickChangeTurn("user")}
            >
              선공
            </button>
            <button
              className="border border-black w-20 h-20 bg-green-300"
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
            <form>
              <label>단어: </label>
              <input
                type="text"
                placeholder="입력해봐요"
                value={wordValue}
                onChange={onChangeValue}
              />
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default WordChain;

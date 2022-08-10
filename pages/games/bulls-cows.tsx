import Button from "components/bullsCows/Button";
import { FormEvent, useState } from "react";
import { BallsHistory } from "typings/bullsCows";
import checkBalls from "utils/bullsCows/function/checkBalls";
import checkValue from "utils/bullsCows/function/checkValue";
import makeBalls from "utils/bullsCows/function/makeBalls";

const BullsCows = () => {
  const [balls, setBalls] = useState<string>();
  const [history, setHistory] = useState<BallsHistory[]>([]);
  const [value, setValue] = useState("");
  const [gameStart, setGameStart] = useState(false);

  const onClickCheckBalls = (event: FormEvent) => {
    event.preventDefault();

    const { check, message } = checkValue(value, history);

    if (!check) {
      console.log(message);
      setValue("");
      return;
    }

    if (balls === value) {
      console.log("홈런");
      setValue("");
      return;
    }

    if (history.length > 9) {
      console.log("패배! 더이상 기회가 없어요.");
      setValue("");
      return;
    }

    if (balls) {
      const { strike, ball } = checkBalls(balls, value);

      // 유효한 값, 저장
      const history = {
        balls: value,
        strike,
        ball,
      };

      setHistory((prev) => [...prev, history]);
    }

    setValue("");
  };

  const onClickGameStart = () => {
    setGameStart(true);
    setBalls(makeBalls());
  };

  return (
    <>
      <div>숫자야구 게임</div>
      {!gameStart && <div onClick={onClickGameStart}>게임 시작</div>}
      {gameStart && (
        <>
          {balls && balls.split("").map((ball) => <div key={ball}>{ball}</div>)}
          <div>{value}</div>
          <div className="grid grid-cols-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((ball) => (
              <Button key={ball} text={ball} setValue={setValue} />
            ))}
            <div
              className="flex items-center justify-center"
              onClick={onClickCheckBalls}
            >
              정답
            </div>
            <Button text="0" setValue={setValue} />
            <div
              className="flex items-center justify-center"
              onClick={() => setValue((prev) => prev.slice(0, prev.length - 1))}
            >
              지우기
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BullsCows;

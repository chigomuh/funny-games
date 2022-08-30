import { ChangeEvent, FormEvent, useState } from "react";
import { BallsHistory } from "typings/bullsCows";
import checkBalls from "utils/bullsCows/function/checkBalls";
import checkValue from "utils/bullsCows/function/checkValue";
import makeBalls from "utils/bullsCows/function/makeBalls";

const BullsCows = () => {
  const [balls, setBalls] = useState<string>();
  const [history, setHistory] = useState<BallsHistory[]>([]);
  const [value, setValue] = useState("");
  const [gameStart, setGameStart] = useState(false);
  const [gameDone, setGameDone] = useState(false);

  const onClickGameStart = () => {
    setGameStart(true);
    setGameDone(false);
    setValue("");
    setHistory([]);
    setBalls(makeBalls());
  };

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
      setValue(value);
      setGameDone(true);
      return;
    }

    if (history.length > 9) {
      console.log("패배! 더이상 기회가 없어요.");
      setValue("");
      setGameDone(true);
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

  const onChangeInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;

    if (/^[0-9]{0,4}$/.test(value) || value === "") {
      setValue(value);
    }
  };

  return (
    <>
      <div>숫자야구</div>
      {!gameStart && <div onClick={onClickGameStart}>게임 시작</div>}
      {gameStart && (
        <div className="space-y-2">
          {!gameDone ? (
            <div className="flex items-center justify-center space-x-2">
              {balls &&
                ["?", "?", "?", "?"].map((ball, idx) => (
                  <div
                    key={`${ball}baseBall${idx}`}
                    className="flex items-center justify-center w-20 h-32 text-6xl font-bold bg-[#2b6673] rounded-md"
                  >
                    {ball}
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              {balls &&
                balls.split("").map((ball, idx) => (
                  <div
                    key={`${ball}baseBall${idx}`}
                    className="flex items-center justify-center w-20 h-32 text-6xl font-bold bg-[#2b6673] rounded-md"
                  >
                    {ball}
                  </div>
                ))}
            </div>
          )}
          <div className="flex items-center justify-center">vs</div>
          {!value && (
            <div className="flex items-center justify-center space-x-2">
              {["?", "?", "?", "?"].map((skel, idx) => (
                <div
                  key={`${skel}${idx}`}
                  className="flex items-center justify-center w-20 h-32 text-6xl font-bold bg-red-600 rounded-md"
                >
                  {skel}
                </div>
              ))}
            </div>
          )}
          {value && (
            <div className="flex items-center justify-center space-x-2">
              {value.split("").map((userBall, idx) => (
                <div
                  key={`${userBall}userBall${idx}`}
                  className="flex items-center justify-center w-20 h-32 text-6xl font-bold bg-red-600 rounded-md"
                >
                  {userBall}
                </div>
              ))}
            </div>
          )}
          <form
            onSubmit={onClickCheckBalls}
            className="flex items-center justify-center bg-gray-300"
          >
            <div>
              <input
                type="text"
                value={value}
                onChange={onChangeInputValue}
                className="bg-slate-400"
                disabled={gameDone}
              />
              <button type="submit">제출</button>
            </div>
          </form>
          {gameDone && <div onClick={onClickGameStart}>다시하기</div>}
          <div className="flex items-center justify-center w-full">
            <div className="grid w-full max-w-lg grid-cols-2 gap-2 p-4">
              {history.map((log) => (
                <div
                  key={log.balls}
                  className="flex items-center justify-center space-x-2 bg-gray-300 rounded-md"
                >
                  <div>{log.balls}</div>
                  {log.strike === 0 && log.ball === 0 ? (
                    <div className="flex">
                      <span className="flex justify-center items-center w-4 h-4 bg-[#ff0000] rounded-full">
                        O
                      </span>
                      <span className="flex justify-center items-center w-4 h-4 rounded-full bg-[#7db249]">
                        U
                      </span>
                      <span className="flex justify-center items-center w-4 h-4 bg-[#ffcd4a] rounded-full">
                        T
                      </span>
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="flex items-center justify-center">
                        {log.strike}
                        <div className="flex items-center justify-center w-4 h-4 bg-[#ffcd4a] rounded-full">
                          S
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        {log.ball}
                        <div className="flex items-center justify-center w-4 h-4 bg-[#7db249] rounded-full">
                          B
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BullsCows;

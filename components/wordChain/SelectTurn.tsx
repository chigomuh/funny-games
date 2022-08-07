import { Dispatch, SetStateAction } from "react";
import { Word } from "typings/wordChain";
import { WORDS } from "utils/wordChain/constant";
import searchAnswer from "utils/wordChain/function/searchAnswer";
import { STYLE_CONSTANT } from "components/wordChain/constant.style";

interface Props {
  setCurrentTurn: Dispatch<SetStateAction<boolean>>;
  setGameStart: Dispatch<SetStateAction<boolean>>;
  setIsSearch: Dispatch<SetStateAction<boolean>>;
  wordHistory: Word[];
  setWordHistory: Dispatch<SetStateAction<Word[]>>;
  setError: Dispatch<SetStateAction<boolean>>;
}

const SelectTurn = ({
  setCurrentTurn,
  setGameStart,
  setIsSearch,
  wordHistory,
  setWordHistory,
  setError,
}: Props) => {
  const { botChatBg, userChatBg } = STYLE_CONSTANT;

  const onClickChangeTurn = (currentTurn?: string) => async () => {
    if (currentTurn === "user") {
      setCurrentTurn(true);
      setGameStart(true);
    } else if (currentTurn === "bot") {
      const randomIndex = Math.floor(Math.random() * WORDS.length);
      const startWord = WORDS[randomIndex];
      setCurrentTurn(false);
      setGameStart(true);

      setIsSearch(true);
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const { word, error } = await searchAnswer(
        startWord,
        wordHistory,
        randomPage
      );
      setIsSearch(false);

      if (error) {
        setError(error);
        return;
      }

      if (word) {
        setWordHistory((prev) => [...prev, word]);
        setCurrentTurn(true);
        return;
      }
    }
  };

  return (
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
  );
};

export default SelectTurn;

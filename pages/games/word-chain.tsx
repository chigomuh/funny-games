import Seo from "components/layout/Seo";
import { useEffect, useRef, useState } from "react";
import { Word } from "typings/wordChain";
import { STYLE_CONSTANT } from "components/wordChain/constant.style";
import ChatText from "components/common/ChatText";
import Error from "components/wordChain/Error";
import Header from "components/wordChain/Layout/Header";
import ChatForm from "components/wordChain/Layout/ChatForm";
import Searching from "components/wordChain/Searching";
import GameDone from "components/wordChain/GameDone";
import SelectTurn from "components/wordChain/SelectTurn";
import ChatLog from "components/wordChain/ChatLog";

const WordChain = () => {
  const { chatPageBg, botChatBg } = STYLE_CONSTANT;

  const [gameStart, setGameStart] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(false);
  const [wordHistory, setWordHistory] = useState<Word[]>([]);
  const [gameDone, setGameDone] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [error, setError] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);

  const infoText =
    "만나서 반가워요! 🖐\n게임 규칙은 다음과 같아요.\n\n1. 어휘 / 명사 / 고유어, 한자어, 외래어, 혼종어만 허용돼요.\n\n2. 두음 법칙이 적용돼요.\n- 'ㄴ' 👉 'ㅇ'\n- 'ㄹ' 👉 'ㄴ' / 'ㅇ'\n\n3. 글자 수 제한은 없어요.";

  const reStartGame = () => {
    setGameStart(false);
    setWordHistory([]);
    setGameDone(false);
    setError(false);
  };

  const scrollBottom = () => {
    if (chatLogRef.current) {
      const { scrollHeight } = chatLogRef.current;
      window.scrollTo(0, scrollHeight);
    }
  };

  useEffect(() => {
    scrollBottom();
  }, [wordHistory, gameDone]);

  return (
    <>
      <Seo title="끝말잇기" />
      {error && <Error reStartGame={reStartGame} />}
      <div
        className={`w-full h-screen flex flex-col justify-between ${chatPageBg} relative`}
      >
        <div className={`${chatPageBg}`}>
          <Header reStartGame={reStartGame} />
          <div className={`w-full flex flex-col justify-start z-10 p-2`}>
            <div className={`space-y-2`} ref={chatLogRef}>
              <div className={`flex flex-col space-y-2`}>
                <ChatText
                  text={infoText}
                  backgroundColor={botChatBg}
                  dangerouslySet={false}
                />
                {!gameStart && (
                  <SelectTurn
                    setCurrentTurn={setCurrentTurn}
                    setGameStart={setGameStart}
                    setIsSearch={setIsSearch}
                    wordHistory={wordHistory}
                    setWordHistory={setWordHistory}
                    setError={setError}
                  />
                )}
              </div>
              <ChatLog wordHistory={wordHistory} />
              {isSearch && <Searching />}
              {gameDone && <GameDone onClick={reStartGame} />}
            </div>
          </div>
        </div>
        <ChatForm
          setError={setError}
          setCurrentTurn={setCurrentTurn}
          setGameDone={setGameDone}
          setWordHistory={setWordHistory}
          setIsSearch={setIsSearch}
          wordHistory={wordHistory}
          currentTurn={currentTurn}
          gameStart={gameStart}
        />
      </div>
    </>
  );
};

export default WordChain;

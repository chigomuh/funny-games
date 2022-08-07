import ChatText from "components/common/ChatText";
import { Word } from "typings/wordChain";
import { STYLE_CONSTANT } from "components/wordChain/constant.style";

interface Props {
  wordHistory: Word[];
}

const ChatLog = ({ wordHistory }: Props) => {
  const { botChatBg, userChatBg } = STYLE_CONSTANT;

  return (
    <>
      {wordHistory.map((word) => (
        <div
          key={word.target_code}
          className={`flex flex-col ${
            word.entered === "user" ? "items-end" : "items-start"
          } space-y-2`}
        >
          <ChatText
            text={word.word}
            backgroundColor={word.entered === "user" ? userChatBg : botChatBg}
            dangerouslySet={false}
          />
          <ChatText
            text={word.sense.definition}
            backgroundColor={word.entered === "user" ? userChatBg : botChatBg}
            dangerouslySet={true}
          />
        </div>
      ))}
    </>
  );
};

export default ChatLog;

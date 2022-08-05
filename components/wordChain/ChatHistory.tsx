import { Word } from "typings/wordChain";

interface Props {
  wordHistory: Word[];
}

const ChatHistory = ({ wordHistory }: Props) => {
  return (
    <>
      {wordHistory.map((word) => (
        <div key={word.target_code}>
          <div>{word.word}</div>
          <div>{word.sense.definition}</div>
        </div>
      ))}
    </>
  );
};

export default ChatHistory;

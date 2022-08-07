import { useRouter } from "next/router";
import { STYLE_CONSTANT } from "components/wordChain/constant.style";

interface Props {
  onClick: () => void;
}

const GameDone = ({ onClick }: Props) => {
  const { botChatBg } = STYLE_CONSTANT;
  const router = useRouter();

  return (
    <div
      className={`flex flex-col items-start w-60 ${botChatBg} p-2 rounded-md space-y-2`}
    >
      <div>게임 종료!</div>
      <div className="w-full space-y-2">
        <div
          className="bg-[#f5f5f5] w-full text-center p-2 rounded-md"
          onClick={onClick}
        >
          다시 하기
        </div>
        <div
          className="bg-[#f5f5f5] w-full text-center p-2 rounded-md"
          onClick={() => router.push("/")}
        >
          운동장 가기
        </div>
      </div>
    </div>
  );
};

export default GameDone;

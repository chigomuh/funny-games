import { useRouter } from "next/router";
import { STYLE_CONSTANT } from "components/wordChain/constant.style";

interface Props {
  reStartGame: () => void;
}

const Error = ({ reStartGame }: Props) => {
  const router = useRouter();
  const { userChatBg } = STYLE_CONSTANT;

  return (
    <>
      <div className="fixed z-50 w-full h-full text-white bg-black top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] opacity-50"></div>
      <div className="fixed z-50 w-4/5 h-52 text-black bg-white top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] space-y-2 max-w-xs px-4">
        <div className="py-2 text-center border-b border-black">Funny Game</div>
        <div className="font-bold text-center">일시적인 오류가 발생했어요.</div>
        <div className="text-sm text-center">
          서버로부터 단어 정보를 불러오지 못했어요.
        </div>
        <div className="text-sm text-center">
          재시작하거나 메인화면으로 이동하세요.
        </div>
        <div className="flex items-center justify-center space-x-4">
          <div
            className={`w-20 h-10 ${userChatBg} flex justify-center items-center rounded-md font-bold`}
            onClick={reStartGame}
          >
            재시작
          </div>
          <div
            className={`w-20 h-10 ${userChatBg} flex justify-center items-center rounded-md font-bold`}
            onClick={() => router.push("/")}
          >
            메인
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;

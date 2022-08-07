import { STYLE_CONSTANT } from "components/wordChain/constant.style";

const Searching = () => {
  const { botChatBg } = STYLE_CONSTANT;

  return (
    <div className="relative flex flex-col items-start space-y-2">
      <span
        className={`${botChatBg} w-16 h-10 rounded-md p-2 flex items-center justify-around relative`}
      >
        <div className="w-2 h-2 bg-[#9b9b9e] rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-[#9b9b9e] rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-[#9b9b9e] rounded-full animate-pulse"></div>
        <span
          className={`absolute top-[10px] left-0 after:content-[''] after:absolute after:border-[8px] after:border-t-[#ffffff] after:border-r-transparent after:border-b-transparent after:border-l-transparent after:left-[-8px] after:top-10px`}
        ></span>
      </span>
    </div>
  );
};

export default Searching;

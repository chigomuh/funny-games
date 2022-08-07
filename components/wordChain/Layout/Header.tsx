import { Word } from "typings/wordChain";
import { STYLE_CONSTANT } from "components/wordChain/constant.style";

interface Props {
  wordHistory: Word[];
}

const Header = ({ wordHistory }: Props) => {
  const { chatPageBg } = STYLE_CONSTANT;

  return (
    <div className={`${chatPageBg} w-full sticky top-0 left-0 z-20`}>
      {wordHistory.length !== 0 && (
        <div className="flex items-center justify-center space-x-2 text-xl">
          <span className="text-sm">제시어:</span>
          <div className="text-2xl font-bold">{wordHistory.at(-1)?.word}</div>
        </div>
      )}
    </div>
  );
};

export default Header;

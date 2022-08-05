import {
  BOX_SHADOW,
  BUTTON_BG_COLOR,
  BUTTON_TEXT_COLOR,
} from "./constant.style";

interface Props {
  text: string;
  onClick: () => void;
}

const BigButton = ({ text, onClick }: Props) => {
  return (
    <button
      className={`${BUTTON_BG_COLOR} ${BUTTON_TEXT_COLOR} font-bold text-2xl w-32 h-32 border border-black rounded-lg`}
      onClick={onClick}
      style={{
        boxShadow: BOX_SHADOW,
      }}
    >
      {text}
    </button>
  );
};

export default BigButton;

interface Props {
  text: string;
  onClick: () => void;
}

const BigButton = ({ text, onClick }: Props) => {
  return (
    <button
      className="w-20 h-20 bg-green-300 border border-black"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default BigButton;

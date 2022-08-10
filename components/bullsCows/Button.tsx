import { Dispatch, SetStateAction } from "react";

interface Props {
  text: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const Button = ({ text, setValue }: Props) => {
  const onClick = () => {
    setValue((prev) => (prev.length < 4 ? prev + text : prev));
  };

  return (
    <>
      <div className="flex items-center justify-center" onClick={onClick}>
        {text}
      </div>
    </>
  );
};

export default Button;

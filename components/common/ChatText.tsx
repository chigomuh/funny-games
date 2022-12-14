interface Props {
  text: string;
  backgroundColor: string;
  dangerouslySet: boolean;
}

const ChatText = ({ text, backgroundColor, dangerouslySet }: Props) => {
  const borderColor = backgroundColor.slice(4, 11);
  const positionSet =
    backgroundColor === "bg-[#ffffff]"
      ? `after:left-[-8px] left-0`
      : `after:right-[-8px] right-0`;

  if (dangerouslySet) {
    return (
      <>
        <span
          className={`${backgroundColor} w-fit max-w-[250px] rounded-md p-2`}
          dangerouslySetInnerHTML={{ __html: text }}
        ></span>
      </>
    );
  }

  return (
    <span
      className={`${backgroundColor} w-fit max-w-[250px] rounded-md p-2 relative whitespace-pre-line`}
    >
      {text}
      <span
        className={`absolute top-[10px] after:content-[''] after:absolute after:border-[8px] ${
          borderColor === "#ffffff"
            ? "after:border-t-[#ffffff]"
            : "after:border-t-[#ffeb33]"
        } after:border-r-transparent after:border-b-transparent after:border-l-transparent after:top-10px ${positionSet}`}
      ></span>
    </span>
  );
};

export default ChatText;

import { STYLE_CONSTANT } from "components/wordChain/constant.style";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  reStartGame: () => void;
}

const Header = ({ reStartGame }: Props) => {
  const { chatPageBg } = STYLE_CONSTANT;

  const router = useRouter();

  return (
    <div
      className={`${chatPageBg} w-full sticky top-0 left-0 z-20 flex justify-between p-2 items-center`}
    >
      <div
        className="flex items-center justify-center space-x-2"
        onClick={reStartGame}
      >
        <Image
          src="/svgs/Arrow.svg"
          alt="backspace-icon"
          width={30}
          height={30}
        />
        <div className="font-bold">끝말잇기 장인</div>
      </div>
      <div
        className="flex items-center justify-center"
        onClick={() => router.push("/")}
      >
        <Image src="/svgs/Home.svg" alt="Home-icon" width={30} height={30} />
      </div>
    </div>
  );
};

export default Header;

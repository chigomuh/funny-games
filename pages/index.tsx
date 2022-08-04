import {
  BOX_SHADOW,
  BUTTON_BG_COLOR,
  BUTTON_TEXT_COLOR,
} from "components/common/constant.style";
import Seo from "components/layout/Seo";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { GAMES } from "utils/common/constant";

const Home: NextPage = () => {
  return (
    <>
      <Seo title="운동장" />
      <div className="w-screen h-screen space-y-10 md:flex">
        <div className="relative">
          <div className="absolute top-0 right-0 z-50 py-4 text-3xl font-bold">
            <span className="flex flex-col items-end">
              <span>어이 인간,</span>
              <span>게임 한 판 어때</span>
            </span>
          </div>
          <Image
            src="/images/main-cat.png"
            alt="cat"
            width={600}
            height={400}
          />
        </div>
        <div className="flex items-center justify-center">
          {GAMES.map((game) => (
            <Fragment key={game.id}>
              <Link href={`/games/${game.id}`}>
                <a
                  className={`flex justify-center items-center w-40 h-10  font-bold text-xl rounded-lg ${BUTTON_BG_COLOR} ${BUTTON_TEXT_COLOR}`}
                  style={{
                    boxShadow: BOX_SHADOW,
                  }}
                >
                  {game.title}
                </a>
              </Link>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

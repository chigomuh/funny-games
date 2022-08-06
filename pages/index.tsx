import {
  BOX_SHADOW,
  BUTTON_BG_COLOR,
  BUTTON_TEXT_COLOR,
  MAIN_TEXT_COLOR,
} from "components/common/constant.style";
import Seo from "components/layout/Seo";
import type { NextPage } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { GAMES } from "utils/common/constant";

const Home: NextPage = () => {
  return (
    <>
      <Seo title="운동장" />
      <div
        className={`w-screen h-screen overflow-hidden ${MAIN_TEXT_COLOR} bg-[url('/images/main-background.gif')] bg-no-repeat bg-center bg-cover`}
      >
        <div className="absolute top-[10%] left-1/2 -translate-x-[50%] text-6xl font-bold">
          WELCOME TO FUNNY GAME
        </div>
        <div className="flex items-center justify-center w-full h-full">
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

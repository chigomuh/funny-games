import Seo from "components/layout/Seo";
import type { NextPage } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { GAMES } from "utils/constant";

const Home: NextPage = () => {
  return (
    <>
      <Seo title="운동장" />
      <div>홈</div>
      {GAMES.map((game) => (
        <Fragment key={game.id}>
          <Link href={`/games/${game.id}`}>
            <a>{game.title}</a>
          </Link>
        </Fragment>
      ))}
    </>
  );
};

export default Home;

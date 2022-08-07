import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

const Seo = ({ title, description, url, image }: Props) => {
  const titleText = title ? `${title} | Funny World` : `Funny World`;
  const descriptionText = description ?? "간단한 게임을 즐겨봐요!";
  const urlLink = url ?? "https://games-chigomuh.vercel.app";
  const imageLink =
    image ?? "https://games-chigomuh.vercel.app/images/thumnail/main.png";

  return (
    <Head>
      <title>{titleText}</title>
      <meta
        name="description"
        content="각종 게임을 즐겨보아요. 간단하고 재미있는 싱글 모드 게임이에요. 여러가지 게임을 즐길 수 있어요."
      />
      <meta property="og:description" content={descriptionText} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={titleText} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={urlLink} />
      <meta property="og:image" content={imageLink} />
      <meta property="og:article:author" content="chigomuh" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Seo;

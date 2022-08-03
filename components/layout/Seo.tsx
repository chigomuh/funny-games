import Head from "next/head";

interface Props {
  title: string;
}

const Seo = ({ title }: Props) => {
  const titleText = `${title} | K-Game`;

  return (
    <Head>
      <title>{titleText}</title>
      <meta
        name="description"
        content="각종 게임을 즐겨보아요. 간단하고 재미있는 싱글 모드 게임이에요. 여러가지 게임을 즐길 수 있어요."
      />
      <meta
        property="og:description"
        content="간단하고 재미있는 게임을 해봐요."
      />
      <meta name="viewport" content="intial-scale=1.0, width=device-width" />
      <meta property="og:title" content={titleText} />
      <meta property="og:type" content="website" />
      {/* <meta property="og:url" content="https://gnu-weather.vercel.app" />
        <meta
          property="og:image"
          content="https://gnu-weather.vercel.app/images/mascot/gnu-basic.png"
        /> */}
      <meta property="og:article:author" content="chigomuh" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Seo;

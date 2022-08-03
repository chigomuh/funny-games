import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.STDICT_API_KEY;
const BASE_URL = "http://stdict.korean.go.kr/api/search.do";

const stdict = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { word, type, start },
  } = req;

  const defaultEndPoint = `${BASE_URL}?key=${API_KEY}&q=${word}&req_type=json&advanced=y&pos=1&type1=word&type2=native,loanword,chinese`;

  if (type === "verification") {
    const URL = defaultEndPoint;
    const response = await fetch(URL);
    const data = await response.json();

    res.status(200).json({
      data,
    });
  } else if (type === "answer") {
    const URL = `${defaultEndPoint}&method=start&start=${start}`;
    const response = await fetch(URL);
    const data = await response.json();

    res.status(200).json({
      data,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Query Error",
    });
  }
};

export default stdict;

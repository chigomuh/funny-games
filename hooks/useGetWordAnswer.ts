import useSWR from "swr";
import { Word } from "typings/wordChain";
import fetcher from "hooks/fetcher";
import { useRef, useState } from "react";

const HOST = process.env.NEXT_PUBLIC_HOST;

const useGetWordAnswer = (
  endWord: string,
  wordHistory: Word[]
): {
  data: Word | undefined;
  loading: boolean;
} => {
  const randomPage = Math.floor(Math.random() * 10) + 1;
  const [page, setPage] = useState(randomPage);
  const visitFirstPage = useRef(false);
  const url = `${HOST}/api/stdict?type=answer&word=${endWord}&start=${page}`;

  const { data } = useSWR(url, fetcher);

  // 데이터 fetching 전
  if (!data) {
    return {
      data: undefined,
      loading: true,
    };
  }

  const {
    data: { channel },
  } = data;

  if (page === 1) {
    visitFirstPage.current = true;
  }

  // 데이터 fetching 후 데이터가 없는 경우
  if (!channel) {
    // page가 1인 경우 해당 단어 없음
    if (visitFirstPage.current) {
      return {
        data: undefined,
        loading: false,
      };
    }

    // page가 1이 아닌 경우 단어 존재 가능성 있음
    // page 1로 지정
    setPage(1);

    return {
      data: undefined,
      loading: true,
    };
  }

  // 만약, data.channel이 있다면 -> 단어가 있긴 있다
  // 단어 리스트를 돌면서
  for (let i = 0; i < channel.item.length; i++) {
    const item: Word = channel.item[i];

    // 한 글자인 경우 continue;
    if (item.word.length === 1) continue;

    // 단어 히스토리를 돌면서
    let isPrevWord = false;
    const replaceItemWord = item.word.replace(/[^가-힣]/g, "");
    for (let j = 0; j < wordHistory.length; j++) {
      // 만약, 단어 히스토리에 있는 단어인 경우
      if (wordHistory[j].word === replaceItemWord) {
        // 이미 있는 단어이다 -> for 탈출
        isPrevWord = true;
        break;
      }
    }

    // 이미 있는 단어인 경우 continue;
    if (isPrevWord) continue;

    // 해당 단어가 정답으로 가능한 경우 return for 탈출
    const word: Word = {
      ...item,
      word: replaceItemWord,
      entered: "bot",
    };

    return {
      data: word,
      loading: false,
    };
  }

  // fetch한 단어 리스트 모두 유효한 단어가 아닌 경우
  // 다음 페이지 fetch
  setPage((prev) => prev + 1);

  return {
    data: undefined,
    loading: false,
  };
};
export default useGetWordAnswer;

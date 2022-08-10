import { BallsHistory } from "typings/bullsCows";

const checkValue = (value: string, valueArray: BallsHistory[], len = 4) => {
  // 숫자가 아닌 경우
  if (!/^[0-9]+$/g.test(value)) {
    return {
      check: false,
      message: "숫자만 입력하세요.",
    };
  }

  // 길이가 다른 경우
  if (value.length !== len) {
    return {
      check: false,
      message: "자리 수를 확인하세요.",
    };
  }

  // 중복 값이 있는 경우
  if (new Set(value).size !== len) {
    return {
      check: false,
      message: "중복은 안돼요.",
    };
  }

  // 이미 확인 한 경우
  const history = valueArray.map((history) => history.balls);
  if (history.includes(value)) {
    return {
      check: false,
      message: "이전에, 이미 확인했어요.",
    };
  }

  return {
    check: true,
    message: "성공",
  };
};

export default checkValue;

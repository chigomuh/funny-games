const checkBalls = (answerBalls: string, userBalls: string) => {
  let strike = 0;
  let ball = 0;

  for (let i = 0; i < answerBalls.length; i++) {
    if (userBalls.includes(answerBalls[i].toString())) {
      if (userBalls.indexOf(answerBalls[i].toString()) === i) {
        strike += 1;
      } else {
        ball += 1;
      }
    }
  }

  return {
    strike,
    ball,
  };
};

export default checkBalls;

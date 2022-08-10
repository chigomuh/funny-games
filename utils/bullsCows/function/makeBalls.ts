const makeBalls = (num: number = 4) => {
  const balls = Array(10)
    .fill(0)
    .map((_, idx) => idx);
  const returnBalls: number[] = [];

  for (let i = 0; i < num; i++) {
    const randomIdx = Math.floor(Math.random() * balls.length);
    const ball = balls[randomIdx];
    balls.splice(randomIdx, 1);

    returnBalls.push(ball);
  }

  return returnBalls.join("");
};

export default makeBalls;

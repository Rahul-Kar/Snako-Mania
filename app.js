// constants and varibales....
let lastUpdate_Time = 0;
let speed = 20;
const game_box = document.querySelector(".game_box");
let snakeArr = [{ x: 7, y: 5 }];
let food = { x: 13, y: 15 };
let inputDiection = { x: 0, y: 0 };
let last_inputDiection = { x: 0, y: 0 };
const bgMusic = new Audio("music/music.mp3");
const food_Music = new Audio("music/food.mp3");
const move_Music = new Audio("music/move.mp3");
const gameOver_Music = new Audio("music/gameover.mp3");
const score_box = document.querySelector(".score_box");
const Highscore_box = document.querySelector(".Highscore_box");
let score = 0;
const gameover_box = document.querySelector(".gameover_box");
const btn = document.querySelector(".btn");

// varibales for localStorage...
let highscore_val = 0;
let HighScore;

// window.onload = (e) => {
//   bgMusic.play();
// };
// creating the game loop...
const main = (currentTime) => {
  window.requestAnimationFrame(main);
  const second_since_last_render = (currentTime - lastUpdate_Time) / 1000;
  if (second_since_last_render < 1 / speed) {
    return;
  }
  lastUpdate_Time = currentTime;

  update();
  display();
};

// storing the score in local storage...
HighScore = localStorage.getItem("HighScore");
if (HighScore === null) {
  localStorage.setItem("HighScore", JSON.stringify(highscore_val));
} else {
  highscore_val = JSON.parse(localStorage.getItem("HighScore"));
  Highscore_box.innerHTML = `High Score: ${highscore_val}`;
}

// KeyDown events
const keyEvent = (e) => {
  bgMusic.play();
  switch (e.key) {
    case "w":
      if (last_inputDiection.y != 0) break;
      inputDiection = { x: 0, y: -1 };
      break;
    case "s":
      if (last_inputDiection.y != 0) break;
      inputDiection = { x: 0, y: 1 };
      break;
    case "d":
      if (last_inputDiection.x != 0) break;
      inputDiection = { x: 1, y: 0 };
      break;
    case "a":
      if (last_inputDiection.x != 0) break;
      inputDiection = { x: -1, y: 0 };
      break;

    case "ArrowUp":
      if (last_inputDiection.y != 0) break;
      inputDiection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (last_inputDiection.y != 0) break;
      inputDiection = { x: 0, y: 1 };
      break;
    case "ArrowRight":
      if (last_inputDiection.x != 0) break;
      inputDiection = { x: 1, y: 0 };
      break;
    case "ArrowLeft":
      if (last_inputDiection.x != 0) break;
      inputDiection = { x: -1, y: 0 };
      break;
  }
  if (
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "w" ||
    e.key === "s" ||
    e.key === "a" ||
    e.key === "d" ||
     e.key === "Enter"
  ) {
    move_Music.play();
  }
};
document.addEventListener("keydown", keyEvent);

// Updating the snake array...
const update = () => {
  const input = getInputs();
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += input.x;
  snakeArr[0].y += input.y;
  game_box.innerHTML = "";

  // if the snake eat the food then ...
  // Add a new segment to the snake and regenarate the food...
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    food_Music.play();
    score += 1;
    if (score > highscore_val) {
      highscore_val = score;
      localStorage.setItem("HighScore", JSON.stringify(highscore_val));
      Highscore_box.innerHTML = `High Score: ${highscore_val}`;
    }
    score_box.innerHTML = `Your score: ${score}`;
    // generate Random food position in the grid
    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
    snakeArr.unshift({
      x: snakeArr[0].x + inputDiection.x,
      y: snakeArr[0].y + inputDiection.y,
    });
  }

  // Game over function
  const isCollide = (snakeArr) => {
    // if the snake bump into the wall then...
    if (
      snakeArr[0].x > 18 ||
      snakeArr[0].x <= 0 ||
      snakeArr[0].y > 18 ||
      snakeArr[0].y <= 0
    ) {
      return true;
    }
    // If the snake bump into itself then..
    for (let i = 1; i < snakeArr.length; i++) {
      if (snakeArr[i].x == snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
        return true;
      }
    }
  };
  if (isCollide(snakeArr)) {
    // alert();
    gameOver_Music.play();
    bgMusic.pause();
    gameover_box.classList.add("show");
    // Removing the eventListner
    document.removeEventListener("keydown", keyEvent);
    inputDiection = { x: 0, y: 0 };
    snakeArr = [{ x: 10, y: 12 }];
  }
};

//display the snake in gamebox
const display = () => {
  snakeArr.forEach((elem, index) => {
    const snakeEelement = document.createElement("div");
    snakeEelement.style.gridColumnStart = elem.x;
    snakeEelement.style.gridRowStart = elem.y;
    if (index === 0) {
      snakeEelement.classList.add("head");
    }
    snakeEelement.classList.add("snake");
    game_box.appendChild(snakeEelement);
  });

  // Display the food
  const foodEelement = document.createElement("div");
  foodEelement.style.gridColumnStart = food.x;
  foodEelement.style.gridRowStart = food.y;
  foodEelement.classList.add("food");
  game_box.appendChild(foodEelement);
};

btn.addEventListener("click", (e) => {
  window.location.reload();
});
window.onkeydown = (e) => {
  console.log(e.key);
  if (e.key === "Enter") {
    window.location.reload();
  }
};

// function for taking the input..
const getInputs = () => {
  last_inputDiection = inputDiection;
  return inputDiection;
};

window.requestAnimationFrame(main);

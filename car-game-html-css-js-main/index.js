const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

const collisionSound = new Audio('assets/collision.mp3');
const bgMusic = new Audio('assets/BGMusic.mp3');
bgMusic.loop = true; // Ensure the background music loops

startScreen.addEventListener('click', initializeGame);

let player = { speed: 5, score: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

let speedInterval;

function keyDown(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function keyUp(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function isCollide(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function moveLines() {
  const lines = document.querySelectorAll('.lines');
  lines.forEach(function (item) {
    if (item.y >= 700) {
      item.y -= 750;
    }
    item.y += player.speed;
    item.style.top = item.y + 'px';
  });
}

function endGame() {
  clearInterval(speedInterval);
  player.start = false;
  bgMusic.pause(); // Stop the background music
  startScreen.classList.remove('hide');
  startScreen.innerHTML =
    'Game over <br> Your final score is ' +
    player.score +
    ' <br> Press here to restart the game.';
}

function moveEnemy(myCar) {
  const enemyCarList = document.querySelectorAll('.enemyCar');

  enemyCarList.forEach(function (enemyCar) {
    if (isCollide(myCar, enemyCar)) {
      collisionSound.play(); // Play the collision sound effect
      endGame();
    }

    if (enemyCar.y >= 750) {
      enemyCar.y = -300;
      enemyCar.style.left = Math.floor(Math.random() * 350) + 'px';
    }

    enemyCar.y += player.speed;
    enemyCar.style.top = enemyCar.y + 'px';
  });
}

function runGame() {
  const car = document.querySelector('.myCar');
  const road = gameArea.getBoundingClientRect();

  if (player.start) {
    moveLines();
    moveEnemy(car);

    if (keys.ArrowUp && player.y > road.top + 150) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < road.bottom - 85) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 50) {
      player.x += player.speed;
    }

    car.style.top = player.y + 'px';
    car.style.left = player.x + 'px';

    // Update the score based on the time or distance
    player.score += player.speed;
    score.innerText = 'Score: ' + player.score + '\nSpeed: ' + player.speed;

    window.requestAnimationFrame(runGame);
  }
}

function increaseSpeed() {
  player.speed++;
}

function initializeGame() {
  startScreen.classList.add('hide');
  gameArea.innerHTML = '';

  player.start = true;
  player.score = 0;
  player.speed = 1;
  score.innerText = 'Score: ' + player.score + '\nSpeed: ' + player.speed;
  window.requestAnimationFrame(runGame);

  bgMusic.currentTime = 0; // Reset the background music to start
  if (bgMusic.paused) {
    bgMusic.play(); // Play the background music if not already playing
  }

  for (let x = 0; x < 5; x++) {
    let roadLine = document.createElement('div');
    roadLine.setAttribute('class', 'lines');
    roadLine.y = x * 150;
    roadLine.style.top = roadLine.y + 'px';
    gameArea.appendChild(roadLine);
  }

  let car = document.createElement('div');
  car.setAttribute('class', 'myCar');
  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  for (let x = 0; x < 3; x++) {
    let enemyCar = document.createElement('div');
    enemyCar.setAttribute('class', 'enemyCar');
    enemyCar.y = (x + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + 'px';
    enemyCar.style.left = Math.floor(Math.random() * 350) + 'px';
    gameArea.appendChild(enemyCar);
  }

  // Increase speed every 5 seconds
  speedInterval = setInterval(increaseSpeed, 900);
}
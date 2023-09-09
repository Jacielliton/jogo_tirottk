// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 50;
const playerHeight = 50;
const enemyWidth = 50;
const enemyHeight = 50;

let playerX = 50;
let playerY = 50;
let bullets = [];
let enemyBullets = []; 
let score = 0;

let enemySpeed = 2;
let enemyShootInterval = 2000;
let enemyShootTimeout;
let enemyDirection = 1; 

let enemyX = Math.random() * (canvas.width - enemyWidth) / 2 + canvas.width / 2;
let enemyY = Math.random() * (canvas.height - enemyHeight);

function enemyShoot() {
    enemyBullets.push({ x: enemyX, y: enemyY });
    enemyShootTimeout = setTimeout(enemyShoot, enemyShootInterval);
  }
  setInterval(enemyShoot, 2000);

  enemyShootTimeout = setTimeout(enemyShoot, enemyShootInterval);

function checkCollision(x1, y1, width1, height1, x2, y2, width2, height2) {
  return x1 < x2 + width2 &&
         x2 < x1 + width1 &&
         y1 < y2 + height2 &&
         y2 < y1 + height1;
}

function draw() {
  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha o jogador
  ctx.fillStyle = "#00F";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

  // Desenha o inimigo
  ctx.fillStyle = "#0F0";
  ctx.fillRect(enemyX, enemyY, enemyWidth, enemyHeight);

  enemyY += enemySpeed * enemyDirection;
  if (enemyY >= (canvas.height - enemyHeight) || enemyY <= 0) {
    enemyDirection *= -1;
  }

  // Atualiza e desenha as balas
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillStyle = "#F00";
    ctx.fillRect(bullets[i].x, bullets[i].y, 10, 10);
    bullets[i].x += 5;

    // Verifica a colisão com o inimigo
    if (checkCollision(bullets[i].x, bullets[i].y, 10, 10, enemyX, enemyY, enemyWidth, enemyHeight)) {
        // Incrementa a pontuação
        score++;
        document.getElementById("score").textContent = "Pontuação: " + score;
  
        // Aumenta a velocidade e a taxa de tiro do inimigo
        enemySpeed += 0.2;
  
        if (enemyShootInterval > 500) {
          enemyShootInterval -= 100;
          clearTimeout(enemyShootTimeout);
          enemyShootTimeout = setTimeout(enemyShoot, enemyShootInterval);
        }
      // Remove a bala
      bullets.splice(i, 1);
      i--;     

      // Move o inimigo para uma nova posição
      enemyX = Math.random() * (canvas.width - enemyWidth) / 2 + canvas.width / 2;
      enemyY = Math.random() * (canvas.height - enemyHeight);
      continue;
    }

    // Remove a bala se ela sair do canvas
    if (bullets[i].x > canvas.width) {
      bullets.splice(i, 1);
      i--;
    }
  }
  for (let i = 0; i < enemyBullets.length; i++) {
    ctx.fillStyle = "#FF0";
    ctx.fillRect(enemyBullets[i].x, enemyBullets[i].y, 10, 10);
    enemyBullets[i].x -= 5;

    // Verifica a colisão com o jogador
    if (checkCollision(enemyBullets[i].x, enemyBullets[i].y, 10, 10, playerX, playerY, playerWidth, playerHeight)) {
      // Zera a pontuação
      score = 0;
      document.getElementById("score").textContent = "Pontuação: " + score;

      // Remove a bala
      enemyBullets.splice(i, 1);
      i--;
      continue;
    }

    // Remove a bala se ela sair do canvas
    if (enemyBullets[i].x < 0) {
      enemyBullets.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(draw);
}

canvas.addEventListener('click', function(event) {
  // Dispara uma bala do canto superior esquerdo do jogador
  bullets.push({ x: playerX, y: playerY });
});

// Mover o jogador com as teclas do teclado
document.addEventListener('keydown', function(event) {
  let newPlayerX = playerX;
  let newPlayerY = playerY;

  switch(event.key) {
    case 'w':
      newPlayerY -= 10;
      break;
    case 'a':
      newPlayerX -= 10;
      break;
    case 's':
      newPlayerY += 10;
      break;
    case 'd':
      newPlayerX += 10;
      break;
  }

  // Verifica se o jogador está dentro dos limites do canvas
  if (newPlayerX >= 0 && newPlayerX <= canvas.width - playerWidth) {
    playerX = newPlayerX;
  }
  if (newPlayerY >= 0 && newPlayerY <= canvas.height - playerHeight) {
    playerY = newPlayerY;
  }
});

// Inicia o loop do jogo
draw();

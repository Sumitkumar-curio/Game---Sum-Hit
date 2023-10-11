const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const instructionsElement = document.getElementById("instructions");

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    color: "blue",
    speed: 5,
    isMovingLeft: false,
    isMovingRight: false,
};
const bgMusic = document.getElementById("bg-music");

// Function to play the background music
function playBackgroundMusic() {
    bgMusic.play();
}

// Define a timer variable and the initial time in seconds
let timer = 10;

// Function to update the timer display
function updateTimer() {
    if (timer >= 0) {
        instructionsElement.textContent = `Time Left: ${timer} seconds`;
        timer--;
    } else {
        // Game over logic (e.g., stop the game, display a message, etc.)
        instructionsElement.textContent = "Game Over";
        // You can add your game-over logic here
    }
}

// Call the updateTimer function every second
setInterval(updateTimer, 1000);


// Call the function when a user clicks a button, for example
const playButton = document.getElementById("play-button");
playButton.addEventListener("click", playBackgroundMusic);


const bullets = [];
const targets = [];
let score = 0;

// Handle keyboard input
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
        player.isMovingLeft = true;
    } else if (event.key === "ArrowRight") {
        player.isMovingRight = true;
    } else if (event.key === " ") {
        if (!player.isShooting) {
            player.isShooting = true;
            shootBullet();
        }
    }
}

function handleKeyUp(event) {
    if (event.key === "ArrowLeft") {
        player.isMovingLeft = false;
    } else if (event.key === "ArrowRight") {
        player.isMovingRight = false;
    } else if (event.key === " ") {
        player.isShooting = false;
    }
}

// Game loop
function gameLoop() {
    clearCanvas();
    updatePlayer();
    updateBullets();
    updateTargets();
    checkCollisions(); // New: Check for collisions
    drawPlayer();
    drawBullets();
    drawTargets();
    requestAnimationFrame(gameLoop);
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Update player position
function updatePlayer() {
    if (player.isMovingLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.isMovingRight && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Bullet class
// Modify the Bullet class
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.color = "red";
        this.speed = 5;
        this.points = 10; // New: Points for hitting a target
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Update the checkCollisions function
function checkCollisions() {
    for (let i = targets.length - 1; i >= 0; i--) {
        if (
            player.x < targets[i].x + targets[i].width &&
            player.x + player.width > targets[i].x &&
            player.y < targets[i].y + targets[i].height &&
            player.y + player.height > targets[i].y
        ) {
            // Increase the score when hitting a green target
            if (targets[i].color === "green") {
                score -= 20;
            }
            scoreElement.textContent = score;
            targets.splice(i, 1);
        }

        // Check for bullet collisions
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (
                bullets[j].x < targets[i].x + targets[i].width &&
                bullets[j].x + bullets[j].width > targets[i].x &&
                bullets[j].y < targets[i].y + targets[i].height &&
                bullets[j].y + bullets[j].height > targets[i].y
            ) {
                // Increase the score when hitting a green target
                if (targets[i].color === "green") {
                    score += 10;
                }
                scoreElement.textContent = score;
                bullets.splice(j, 1);
                targets.splice(i, 1);
            }
        }
    }
}

// Update bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }
}

// Draw bullets
function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw();
    }
}

// Shoot a bullet
function shootBullet() {
    const bullet = new Bullet(player.x + player.width / 2 - 2.5, player.y);
    bullets.push(bullet);
}

// Target class
class Target {
    constructor(x, y, width, height, color, points) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.points = points;
    }
}

// Create a target
function createTarget() {
    const x = Math.random() * (canvas.width - 40);
    const y = -30;
    const width = 40;
    const height = 30;
    const color = "green";
    const points = Math.random() < 0.3 ? 20 : 10;
    const target = new Target(x, y, width, height, color, points);
    targets.push(target);
}

// Update targets
function updateTargets() {
    for (let i = targets.length - 1; i >= 0; i--) {
        targets[i].y += 2;
        if (targets[i].y > canvas.height) {
            targets.splice(i, 1);
        }
    }
    if (Math.random() < 0.02) {
        createTarget();
    }
}

// Draw targets
function drawTargets() {
    for (let i = 0; i < targets.length; i++) {
        ctx.fillStyle = targets[i].color;
        ctx.fillRect(targets[i].x, targets[i].y, targets[i].width, targets[i].height);
    }
}



// Start the game loop
gameLoop();

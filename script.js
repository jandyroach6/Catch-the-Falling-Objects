// Game variables
let score = 0;
let gameRunning = false;
let fallingItems = [];
let missedItems = 0;
let maxMissedItems = 5;
let spawnInterval;
let gameLoop;

// DOM elements
const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Set initial basket position
let basketX = window.innerWidth / 2;
basket.style.left = basketX + 'px';

// Mouse movement event listener
gameContainer.addEventListener('mousemove', (e) => {
    if (gameRunning) {
        basketX = e.clientX;
        basket.style.left = basketX + 'px';
    }
});

// Touch movement event listeners for mobile
gameContainer.addEventListener('touchmove', (e) => {
    if (gameRunning) {
        e.preventDefault();
        basketX = e.touches[0].clientX;
        basket.style.left = basketX + 'px';
    }
});

// Start game
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
    // Reset game state
    score = 0;
    scoreElement.textContent = score;
    missedItems = 0;
    fallingItems.forEach(item => item.element.remove());
    fallingItems = [];
    
    // Hide start screen and game over screen
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    // Start game loop
    gameRunning = true;
    spawnInterval = setInterval(spawnItem, 1000);
    gameLoop = setInterval(updateGame, 16);
}

function spawnItem() {
    // Create falling item
    const item = document.createElement('div');
    item.className = 'item';
    
    // Randomize item type
    const itemTypes = ['apple', 'orange', 'banana'];
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    item.classList.add(itemType);
    
    // Set random position
    const x = Math.random() * window.innerWidth;
    item.style.left = x + 'px';
    item.style.top = '0px';
    
    // Add to game container
    gameContainer.appendChild(item);
    
    // Add to falling items array
    fallingItems.push({
        element: item,
        x: x,
        y: 0,
        speed: 2 + Math.random() * 2, // Random speed between 2 and 4
        caught: false
    });
}

function updateGame() {
    const basketRect = basket.getBoundingClientRect();
    
    // Update each falling item
    for (let i = fallingItems.length - 1; i >= 0; i--) {
        const item = fallingItems[i];
        
        // Move item down
        item.y += item.speed;
        item.element.style.top = item.y + 'px';
        
        // Check for collision with basket
        const itemRect = item.element.getBoundingClientRect();
        
        if (!item.caught && 
            itemRect.bottom >= basketRect.top && 
            itemRect.top <= basketRect.bottom && 
            itemRect.left <= basketRect.right && 
            itemRect.right >= basketRect.left) {
            
            // Item caught!
            item.caught = true;
            item.element.remove();
            fallingItems.splice(i, 1);
            score++;
            scoreElement.textContent = score;
            
            // Increase difficulty every 10 points
            if (score % 10 === 0) {
                clearInterval(spawnInterval);
                const newInterval = Math.max(300, 1000 - (score / 10) * 100);
                spawnInterval = setInterval(spawnItem, newInterval);
            }
        }
        // Check if item is out of bounds
        else if (item.y > window.innerHeight) {
            item.element.remove();
            fallingItems.splice(i, 1);
            missedItems++;
            
            // Check for game over
            if (missedItems >= maxMissedItems) {
                endGame();
            }
        }
    }
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    clearInterval(spawnInterval);
    
    // Show game over screen
    gameOverScreen.style.display = 'flex';
    finalScoreElement.textContent = 'Final Score: ' + score;
    
    // Remove remaining items
    fallingItems.forEach(item => item.element.remove());
    fallingItems = [];
}

// Handle window resize
window.addEventListener('resize', () => {
    basketX = Math.min(basketX, window.innerWidth);
    basket.style.left = basketX + 'px';
});
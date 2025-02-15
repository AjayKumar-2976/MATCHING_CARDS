let cards = document.querySelectorAll(".cards");
let hasFlippedCard = false;
let firstCard, secondCard;
let matchedCards = 0;
let lockBoard = false;

// Timer variables
let timer = document.getElementById("timer");
let restart = document.getElementById("restartButton");
let timeEnding = new Audio("./timer-digital-countdown-bop-audio-1-00-04.mp3");
let interval;
let timeLeft = 120; // 2 minutes in seconds

// Score
let score = 0;

// Start the timer
function startTimer() {
    clearInterval(interval); // Clear any existing timer
    timeLeft = 120; // Reset time to 2 minutes
    interval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeLeft <= 3 && timeLeft >= 0) {
            timeEnding.play();
        }

        if (timeLeft === 0) {
            clearInterval(interval);
            lockBoard = true;
            alert("Time is up! You lost the match.");
            window.location.href = "results.html";
        }
        timeLeft--;
    }, 1000);
}

// Flip card logic
function flipCard(card) {
    if (lockBoard || card === firstCard) return;

    card.classList.add("flip");
    const music = new Audio('./flipsound.mp3');
    music.play();

    if (!hasFlippedCard) {
        // First card
        hasFlippedCard = true;
        firstCard = card;
    } else {
        // Second card
        hasFlippedCard = false;
        secondCard = card;
        checkForMatch();
    }
}

// Check if cards match
function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        // Match found
        score++;
        document.getElementById("score").textContent = `Score: ${score * 5}`;
        disableCards();
        matchedCards++;
        checkGameOver();
    } else {
        // No match
        unflipCards();
    }
}

// Disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', handleCardClick);
    secondCard.removeEventListener('click', handleCardClick);
    resetBoard();
}

// Unflip cards if no match
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

// Reset board state
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Check if all cards are matched
function checkGameOver() {
    if (matchedCards === cards.length / 2) {
        clearInterval(interval);
        const gameOverSound = new Audio('./mixkit-musical-game-over-959.wav');
        gameOverSound.play();
        alert("Congratulations! You've matched all the cards.");

        // Save score and time to localStorage
        const finalScore = score * 5;
        localStorage.setItem('finalScore', finalScore);
        localStorage.setItem('timeLeft', timeLeft);

        // Redirect to results page
        window.location.href = 'results.html';
    }
}

// Shuffle cards
function shuffleCards() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}

// Reset game
function resetGame() {
    matchedCards = 0;
    score = 0;
    document.getElementById("score").textContent = "Score: 0";
    clearInterval(interval);
    startTimer();
    shuffleCards();

    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', handleCardClick);
    });
}

// Restart game
function restartGame() {
    resetGame();
    alert("Game restarted! Good luck!");
}

// Handle card click
function handleCardClick() {
    flipCard(this);
}

// Add event listeners
cards.forEach(card => card.addEventListener('click', handleCardClick));
document.getElementById("resetButton").addEventListener('click', resetGame);
document.getElementById("restartButton").addEventListener('click', restartGame);

// Initialize game
shuffleCards();
startTimer();
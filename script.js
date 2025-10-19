// 1. Define the 4 unique cards (MMT-Themed Placeholders)
// **ACTION: REPLACE THESE IMG FILENAMES WITH YOUR ACTUAL IMAGE NAMES**
const cardImages = [
    { name: 'mmt-chart', img: 'images/mmt-chart.jpg' },
    { name: 'mmt-coin', img: 'images/mmt-coin.jpg' },
    { name: 'mmt-logo', img: 'images/mmt-logo.jpg' },
    { name: 'mmt-team', img: 'images/mmt-team.jpg' },
];

// 2. Global Game State
let cards = [...cardImages, ...cardImages];
const gameBoard = document.querySelector('.memory-game');
const moveCounterElement = document.getElementById('move-counter');
const resetButton = document.getElementById('reset-button');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let moves = 0;

// --- CORE FUNCTIONS ---

// Shuffles the array (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Creates the card HTML element
function createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('memory-card');
    cardElement.dataset.name = card.name;

    cardElement.innerHTML = `
        <img class="front-face" src="${card.img}" alt="${card.name}">
        <img class="back-face" src="images/card-back.png" alt="Card Back"> 
    `;

    cardElement.addEventListener('click', flipCard);
    return cardElement;
}

// Handles card flipping and logic
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    incrementMoves();
    checkForMatch();
}

function incrementMoves() {
    moves++;
    moveCounterElement.textContent = moves;
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // Cards match: apply the 'match' class for CSS animation
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    
    // Remove listeners so they can't be clicked again
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    checkForWin();
}

function unflipCards() {
    lockBoard = true; // Lock the board during flip delay

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1200); // Shorter delay for faster gameplay
}

function resetBoard() {
    [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
}

function checkForWin() {
    const matchedCards = document.querySelectorAll('.memory-card.match');
    if (matchedCards.length === cards.length) {
        document.getElementById('win-message').classList.remove('hidden');
        resetButton.textContent = "Play Again";
    }
}

// --- INITIALIZATION ---

function initializeGame() {
    shuffle(cards);
    gameBoard.innerHTML = '';
    
    cards.forEach(card => {
        gameBoard.appendChild(createCard(card));
    });

    // Reset state variables
    resetBoard();
    moves = 0;
    moveCounterElement.textContent = moves;
    document.getElementById('win-message').classList.add('hidden');
    resetButton.textContent = "Restart Game";
}

// Event Listeners
resetButton.addEventListener('click', initializeGame);

// Start the game on load
initializeGame();

const memoryGame = document.querySelector('.memory-game');
const startButton = document.getElementById('start-button');
const endButton = document.getElementById('end-button');
const overlay = document.getElementById('overlay');
const countdownElement = document.getElementById('countdown');
const timerElement = document.getElementById('timer');
const celebration = document.getElementById('celebration');
const celebrationTime = document.getElementById('celebration-time');
const celebrationOK = document.getElementById('celebration-ok');
const message = document.getElementById('message');
const messageText = document.getElementById('message-text');
const messageOK = document.getElementById('message-ok');
const messageCancel = document.getElementById('message-cancel');

const cardsArray = [
    { name: '😊', img: '😊' },
    { name: '🐶', img: '🐶' },
    { name: '🐱', img: '🐱' },
    { name: '🍕', img: '🍕' },
    { name: '🍔', img: '🍔' },
    { name: '🚀', img: '🚀' },
    { name: '😊', img: '😊' },
    { name: '🐶', img: '🐶' },
    { name: '🐱', img: '🐱' },
    { name: '🍕', img: '🍕' },
    { name: '🍔', img: '🍔' },
    { name: '🚀', img: '🚀' },
];
let animationFrame;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameStarted = false;
let startTime;
let timerInterval;
let cards = [];

shuffleCards();

startButton.addEventListener('click', startGame);
endButton.addEventListener('click', () => {
    if (!gameStarted) {
        showMessage('The game is not running. Start the game first!');
        return;
    }

    showMessage('Are you sure you want to end the game?', (confirmed) => {
        if (confirmed) {
            resetGame();
        }
    });
});

celebrationOK.addEventListener('click', () => {
    celebration.style.display = 'none';
    stopConfetti();
    resetGame();
});

const canvas = document.createElement('canvas');
canvas.id = 'confetti-canvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '1002';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettiParticles = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' }
];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function initConfetti() {
    for (let i = 0; i < confettiCount; i++) {
        confettiParticles.push({
            color: colors[Math.floor(randomRange(0, colors.length))],
            dimensions: {
                x: randomRange(10, 20),
                y: randomRange(10, 30)
            },
            position: {
                x: randomRange(0, canvas.width),
                y: canvas.height - 1
            },
            rotation: randomRange(0, 2 * Math.PI),
            scale: {
                x: 1,
                y: 1
            },
            velocity: {
                x: randomRange(-25, 25),
                y: randomRange(0, -50)
            }
        });
    }
}

function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
        confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        if (confetto.position.y >= canvas.height) confettiParticles.splice(index, 1);

        if (confetto.position.x > canvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = canvas.width;

        confetto.scale.y = Math.cos(confetto.position.y * 0.1);
        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        ctx.fillRect(-width / 2, -height / 2, width, height);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    if (confettiParticles.length <= 10) initConfetti();

    animationFrame = requestAnimationFrame(renderConfetti);
}

function startConfetti() {
    initConfetti();
    renderConfetti();
}

function stopConfetti() {
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animationFrame);
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    startButton.disabled = true;

    overlay.style.display = 'flex';

    let count = 3;
    countdownElement.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.textContent = count;
        } else {
            countdownElement.textContent = 'GO!';
            clearInterval(countdownInterval);

            setTimeout(() => {
                overlay.style.display = 'none';
                cards.forEach(card => card.addEventListener('click', flipCard));
                startTimer();
            }, 1000);
        }
    }, 1000);
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `Time: ${elapsedTime}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

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
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    checkGameOver();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function checkGameOver() {
    const allCards = document.querySelectorAll('.memory-card');
    const matchedCards = document.querySelectorAll('.memory-card.flip');

    if (allCards.length === matchedCards.length) {
        stopTimer();
        celebrate();
    }
}

function celebrate() {
    celebration.style.display = 'flex';
    celebrationTime.textContent = timerElement.textContent;

    startConfetti();

    const existingElements = [];

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        const { top, left } = getRandomPosition(existingElements);
        confetti.style.top = `${top}%`;
        confetti.style.left = `${left}%`;
        confetti.style.animationDuration = `${Math.random() * 5 + 2}s`;
        celebration.appendChild(confetti);
        existingElements.push(confetti);
    }

    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon', 'small');
        const { top, left } = getRandomPosition(existingElements);
        balloon.style.top = `${top}%`;
        balloon.style.left = `${left}%`;
        balloon.style.animationDuration = `${Math.random() * 6 + 3}s`;
        celebration.appendChild(balloon);
        existingElements.push(balloon);
    }

    for (let i = 0; i < 10; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon', 'large');
        const { top, left } = getRandomPosition(existingElements);
        balloon.style.top = `${top}%`;
        balloon.style.left = `${left}%`;
        balloon.style.animationDuration = `${Math.random() * 12 + 6}s`;
        celebration.appendChild(balloon);
        existingElements.push(balloon);
    }

    document.getElementById('celebration-ok').addEventListener('click', () => {
        celebration.style.display = 'none';
        stopConfetti();
        resetGame();
    });
}

function resetGame() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    stopTimer();
    timerElement.textContent = 'Time: 0s';

    cards.forEach(card => card.removeEventListener('click', flipCard));

    shuffleCards();

    startButton.disabled = false;
    gameStarted = false;

    stopConfetti();

    celebration.style.display = 'none';
    celebration.innerHTML = `
        <h1>Congratulations! 🎉</h1>
        <p>You finished the game in <span id="celebration-time"></span></p>
        <button id="celebration-ok">OK</button>
        <div class="confetti"></div>
        <div class="balloons"></div>
    `;

    document.getElementById('celebration-ok').addEventListener('click', () => {
        celebration.style.display = 'none';
        stopConfetti();
        resetGame();
    });
}

function shuffleCards() {
    cardsArray.sort(() => Math.random() - 0.5);

    memoryGame.innerHTML = '';
    cardsArray.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.framework = item.name;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.textContent = item.img;

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.textContent = '❓';

        card.appendChild(frontFace);
        card.appendChild(backFace);

        memoryGame.appendChild(card);
    });

    cards = document.querySelectorAll('.memory-card');
}

function showMessage(text, callback) {
    messageText.textContent = text;
    message.style.display = 'block';

    messageOK.onclick = () => {
        message.style.display = 'none';
        if (callback) callback(true);
    };

    messageCancel.onclick = () => {
        message.style.display = 'none';
        if (callback) callback(false);
    };
}


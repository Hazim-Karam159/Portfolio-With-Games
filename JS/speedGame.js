let interval;
let score = 0;
let startTime;
let elapsedTime = 0;
let currentNumber = null;
let canType = false;

const randomNumberEl = document.getElementById("random-number");
const userInput = document.getElementById("user-input");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const countdownScreen = document.getElementById("countdown-screen");
const countdownText = document.getElementById("countdown");
const celebrationScreen = document.getElementById("celebration-screen");
const finalScore = document.getElementById("final-score");
const finalTime = document.getElementById("final-time");
const okBtn = document.getElementById("ok-btn");
const celebrationMessage = document.getElementById("celebration-message");

window.onload = () => {
    countdownScreen.classList.add("hidden");
    celebrationScreen.classList.add("hidden");
};

function generateRandomNumber() {
    return Math.floor(Math.random() * 10);
}

function updateRandomNumber() {
    currentNumber = generateRandomNumber();
    randomNumberEl.textContent = currentNumber;
    canType = true;
}

function startCountdown(callback) {
    countdownScreen.classList.remove("hidden");
    let countdown = 3;
    countdownText.textContent = countdown;

    let countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownText.textContent = countdown;
        } else {
            countdownText.textContent = "Starting 🚀";
            clearInterval(countdownInterval);
            setTimeout(() => {
                countdownScreen.classList.add("hidden"); 
                callback(); 
            }, 700);
        }
    }, 1000);
}

function startGame() {
    score = 0;
    elapsedTime = 0;
    scoreEl.textContent = score;
    timeEl.textContent = elapsedTime;
    userInput.value = "";
    userInput.focus();

    startBtn.disabled = true;
    stopBtn.disabled = false;

    startCountdown(() => {
        startTime = new Date();
        interval = setInterval(() => {
            elapsedTime = Math.floor((new Date() - startTime) / 1000);
            timeEl.textContent = elapsedTime;
            updateRandomNumber();
        }, 700);
    });
}

function stopGame() {
    clearInterval(interval);
    startBtn.disabled = false;
    stopBtn.disabled = true;
    randomNumberEl.textContent = "?";
    canType = false;
    
       
        celebrationMessage.textContent = " Game Over! ";
        
        finalTime.textContent = `Time: ${elapsedTime} seconds`;
        
    

    finalScore.textContent = score;
    finalTime.textContent = elapsedTime;
    celebrationScreen.classList.remove("hidden");
}

function celebrateScore() {
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

        requestAnimationFrame(renderConfetti);
    }

    initConfetti();
    renderConfetti();

    setTimeout(() => {
        document.body.removeChild(canvas);
    }, 5000);
}


userInput.addEventListener("input", () => {
    if (canType && userInput.value === String(currentNumber)) {
        score++;
        scoreEl.textContent = score;
        userInput.value = "";
        canType = false;

        if (score === 5) {
            clearInterval(interval); 
            celebrationMessage.textContent = "🎉 You Won! 🎉"; 
            finalScore.textContent = `Score: ${score}`; 
            finalTime.textContent = `Time: ${elapsedTime} seconds`; 
            celebrateScore(); 
            stopGame(); 
        }
    }
    userInput.focus(); 
});

startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
okBtn.addEventListener("click", () => {
    celebrationScreen.classList.add("hidden");
});
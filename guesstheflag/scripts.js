const countryApi = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const startBtn = document.querySelector('#startGame');
const showNextBtn = document.querySelector('#showNext');
let countries = [];
let questions = [];
let currentQuestion = 0;
let score = 0;
let highScore = localStorage.getItem('highScore');

startBtn.addEventListener('click', () => {
    startGame();
})

showNextBtn.addEventListener('click', () => {
    showNextQuestion();
})

function createElement(element, className = '') {
    const created = document.createElement(element);
    created.classList = className;
    return created;
}

async function startGame() {
    await getCountries();
    await generateQuestion();
    renderScore();
    renderHighScore();

    renderQuestions();
}

async function getCountries() {
    await fetch(countryApi)
        .then(res => res.json())
        .then(data => countries = data.data);
}

function showNextQuestion() {
    showNextBtn.classList.add('hidden');
    currentQuestion++;
    renderQuestions();
}

function generateQuestion() {
    for (let i = 0; i < 10; i++) {
        const IDs = [Math.round(Math.random() * 219), Math.round(Math.random() * 219), Math.round(Math.random() * 219), Math.round(Math.random() * 219)];

        const q = {
            answers: [IDs[0], IDs[1], IDs[2], IDs[3]],
            correctAnswer: IDs[0].toString()
        };

        questions.push(q);

    }
}

function renderQuestions() {
    const countryName = document.querySelector('.country-name span');
    const flagsContainer = document.querySelector('.countries');
    const q = questions[currentQuestion];
    const qShuffled = q.answers.sort(() => Math.random() - 0.5);
    // console.log(questions)

    countryName.textContent = countries[+q.correctAnswer].name;
    flagsContainer.innerHTML = '';

    q.answers.forEach((answer, index) => {
        const flag = createElement('button', 'country-flag');
        const flagImg = createElement('img');

        flagImg.src = countries[+qShuffled[index]].flag;
        flagImg.dataset.id = answer.toString();

        flag.append(flagImg);
        flagsContainer.append(flag);
    });

    handleAnswer(q.correctAnswer);
}

function increaseScore() {
    score++
    if (highScore < score) updateScoreInLocal() && renderHighScore();
}

function updateScoreInLocal() {
    highScore = score;
    localStorage.setItem('highScore', score);
}

function renderScore() {
    const scoreSpan = document.querySelector('#score');
    scoreSpan.textContent = `Score: ${score}`;
}

function renderHighScore() {
    const highScoreSpan = document.querySelector('#highScore');
    highScoreSpan.textContent = `High score: ${highScore}`;
}

function handleAnswer(answer) {
    const countries = document.querySelector('.countries');
    const flags = document.querySelectorAll('.country-flag');

    countries.addEventListener('click', (e) => handleConditions(e), {once: true});

    const handleConditions = function(e) {
        if (!e.target.dataset.id) return;

        let flag = e.target.parentElement;

        if (answer === e.target.dataset.id) {
            flag.classList.add('correct');
            increaseScore();
            if (currentQuestion + 1 !== questions.length) showNextBtn.classList.remove('hidden');
        } else {
            flag.classList.add('incorrect');
            flags.forEach(f => { if (answer === f.firstChild.dataset.id) f.classList.add('correct') })
            if (currentQuestion + 1 !== questions.length) showNextBtn.classList.remove('hidden');
        }

        renderScore();
    }
}


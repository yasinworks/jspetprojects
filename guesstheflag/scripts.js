const countryApi = 'https://restcountries.com/v3.1/all';
const startBtn = document.querySelector('#startGame');
const showNextBtn = document.querySelector('#showNext');
const countryName = document.querySelector('.country-name span');
const flagsContainer = document.querySelector('.countries');
let countries = [];
let questions = [];
let currentQuestion = 0;

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

async function getCountries() {
    await fetch(countryApi)
        .then(res => res.json())
        .then(data => countries = data);
}

async function startGame() {
    await getCountries();
    await generateQuestion();

    renderQuestions();
}

function generateQuestion() {
    for (let i = 0; i < 10; i++) {
        const IDs = [Math.round(Math.random() * 250), Math.round(Math.random() * 250), Math.round(Math.random() * 250), Math.round(Math.random() * 250)];

        const q = {
            answers: [IDs[0], IDs[1], IDs[2], IDs[3]],
            correctAnswer: IDs[0].toString()
        };

        questions.push(q);

    };
}

function renderQuestions() {
    const q = questions[currentQuestion];
    console.log(questions)

    countryName.textContent = countries[+q.correctAnswer].name.common;

    flagsContainer.innerHTML = '';

    q.answers.forEach(answer => {
        const flag = createElement('button', 'country-flag');
        const flagImg = createElement('img');

        flagImg.src = countries[+answer].flags.png;
        flagImg.dataset.id = answer.toString();

        flag.append(flagImg);
        flagsContainer.append(flag);
    });


    handleAnswer(q.correctAnswer);
}

function handleAnswer(answer) {
    const flags = document.querySelectorAll('.country-flag');

    flags.forEach(flag => {
        flag.addEventListener('click', (e) => {
            if (answer === e.target.dataset.id) {
                flag.classList.add('correct');
                if (currentQuestion < questions.length) {
                    showNextBtn.classList.remove('hidden');
                }
            } else {
                flag.classList.add('incorrect');
            }
        });
    });
}

function showNextQuestion() {
    showNextBtn.classList.add('hidden');
    currentQuestion++;
    renderQuestions();
}
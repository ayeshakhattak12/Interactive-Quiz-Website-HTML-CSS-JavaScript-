// Quiz Questions Array
const questions = [
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        id: 2,
        question: "Which planet is the largest in our solar system?",
        options: ["Mars", "Jupiter", "Saturn", "Earth"],
        correct: 1
    },
    {
        id: 3,
        question: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correct: 2
    },
    {
        id: 4,
        question: "How many kilometers are in a marathon?",
        options: ["21.1 km", "42.2 km", "30 km", "50 km"],
        correct: 1
    },
    {
        id: 5,
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
    },
    {
        id: 6,
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        id: 7,
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
    }
];

// Quiz State
let currentQuestion = 0;
let score = 0;
let timeLeft = 0;
let timerInterval = null;
let selectedOption = null;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const questionCounter = document.getElementById('question-counter');
const timerDisplay = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressFill = document.getElementById('progress-fill');
const resultsTitle = document.getElementById('results-title');
const scoreDisplay = document.getElementById('score-display');
const resultsMessage = document.getElementById('results-message');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', submitQuiz);
restartBtn.addEventListener('click', restartQuiz);

// Functions
function startQuiz() {
    // Reset state
    currentQuestion = 0;
    score = 0;
    
    // Switch screens
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultsScreen.classList.add('hidden');
    
    // Start timer (60 seconds per question)
    timeLeft = 60 * questions.length;
    startTimer();
    
    // Display first question
    displayQuestion();
    updateProgress();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Change color when time is running out
    if (timeLeft <= 30) {
        timerDisplay.style.color = '#f44336';
    }
}

function displayQuestion() {
    const question = questions[currentQuestion];
    selectedOption = null;
    
    // Update question text
    questionText.textContent = `${currentQuestion + 1}. ${question.question}`;
    
    // Clear and populate options
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.innerHTML = `
            <input type="radio" name="option" id="option-${index}" value="${index}">
            <label for="option-${index}">${option}</label>
        `;
        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    // Disable next button until selection
    nextBtn.disabled = true;
    submitBtn.disabled = true;
}

function selectOption(index) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false;
    });
    
    // Select new option
    const selectedDiv = document.querySelectorAll('.option')[index];
    selectedDiv.classList.add('selected');
    selectedDiv.querySelector('input').checked = true;
    
    selectedOption = index;
    nextBtn.disabled = false;
    submitBtn.disabled = false;
}

function nextQuestion() {
    // Check answer
    if (selectedOption === questions[currentQuestion].correct) {
        score++;
    }
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        displayQuestion();
        updateProgress();
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    
    // Show submit button on last question, next button otherwise
    if (currentQuestion === questions.length - 1) {
        nextBtn.hidden = true;
        submitBtn.hidden = false;
        submitBtn.disabled = true;
    } else {
        nextBtn.hidden = false;
        submitBtn.hidden = true;
    }
}

function submitQuiz() {
    // Check answer for last question
    if (selectedOption === questions[currentQuestion].correct) {
        score++;
    }
    
    clearInterval(timerInterval);
    showResults();
}

function showResults() {
    // Switch screens
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    // Calculate score percentage
    const percentage = Math.round((score / questions.length) * 100);
    
    // Display score
    scoreDisplay.textContent = `${score}/${questions.length} (${percentage}%)`;
    
    // Determine message and styling
    if (percentage >= 80) {
        resultsTitle.textContent = "🎉 Excellent Work!";
        scoreDisplay.className = 'score-good';
        resultsMessage.textContent = "Outstanding performance! You're a true knowledge master.";
    } else if (percentage >= 50) {
        resultsTitle.textContent = "👍 Good Job!";
        scoreDisplay.className = 'score-average';
        resultsMessage.textContent = "Not bad at all! Keep learning and you'll do even better.";
    } else {
        resultsTitle.textContent = "💪 Keep Trying!";
        scoreDisplay.className = 'score-poor';
        resultsMessage.textContent = "Every quiz is a learning opportunity. Give it another shot!";
    }
}

function restartQuiz() {
    // Reset everything
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    timeLeft = 0;
    clearInterval(timerInterval);
    
    // Reset UI
    scoreDisplay.className = '';
    timerDisplay.style.color = '#667eea';
    
    // Show welcome screen
    resultsScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
}
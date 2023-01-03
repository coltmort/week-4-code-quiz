// sets all global variables
const answer1 = document.querySelector('.answer1')
const answer2 = document.querySelector('.answer2')
const answer3 = document.querySelector('.answer3')
const answer4 = document.querySelector('.answer4')
const seconds = document.querySelector('.seconds')
const secondsText = document.querySelector('.seconds-text')
const question = document.querySelector('.question')
const answers = document.querySelector('.answers')
const startButton = document.querySelector('.start-button')
var restartButton 
const startSection = document.querySelector('.start')
const quizSection = document.querySelector('.quiz')
const resultsSection = document.querySelector('.results')
const reviewSection = document.querySelector('.review')
const scorecardButton = document.querySelector('.scorecard-btn')
const highScoresButton = document.querySelector('.nav-highscores')
const backArrow = document.querySelector('.back-arrow')
const highScoresAside = document.querySelector('.highscores')
const userScore = document.querySelector('.user-score')
const saveScoreBtn = document.querySelector('.initials-save-btn')
const initialsInput = document.querySelector('.initials-input')
const scoreContainer = document.querySelector('.score-container')
const highscoreText = document.querySelector('.highscore')
const inputContainer = document.querySelector('.input-container')
var secondsLeft = 20
var userAnswers = '' 
var correctAnswers = ''
var questionNumber = 0
var timerInterval
var highScores = [{},{},{},{},{},{},{},{},{}]
var score = 0
var initialsAndScore = []
var userInitials = ''

var questionsArray = [
    {
        question: "What does HTML stand for?",
        choices: ["Hypertext Markup Language", "Cascading Stylesheets", "London", "Birmingham"],
        answer: 1
    },
    {
        question: "Which tag is used to add an image to HTML?",
        choices: ["<image>", "<img>", "<picture>", "<a>"],
        answer: 2
    },
      
    {
        question: "What style of labeling should you use in javaScript?",
        choices: ["H-Case", "PascalCase", "lowercase", "camelCase"],
        answer: 4
    },
    {
        question: "What is a repo?",
        choices: ["A reference to the Repo Man", "a place that hosts an applications source code", "GitHub", "google"],
        answer: 2
    },
    {
        question: 'How would you select a button with a class of "activate" in css',
        choices:['#activate', 'activate', '.activate', '&activate'],
        answer: 3
    }
]

// Event listener section,

// Hides start screen and shows quiz 
startButton.addEventListener('click', function(){
    startTimer()
    startSection.setAttribute('style', 'display:none')
    quizSection.setAttribute('style', 'display:flex')
})

scorecardButton.addEventListener('click', function(){
    if (scorecardButton.dataset.visible === 'hidden'){
        reviewSection.setAttribute('style', 'display:flex')
        scorecardButton.textContent = 'Hide scorecard'
        scorecardButton.dataset.visible = 'visible'
    } else {
        reviewSection.setAttribute('style', 'display:none')
        scorecardButton.textContent = 'Show scorecard'
        scorecardButton.dataset.visible = 'hidden'
    }
})

// event listener moves to next question on click in .answers
answers.addEventListener('click', function(event){
    if (event.target.matches('button')){
        userAnswers += event.target.dataset.number
        if(userAnswers.charAt(questionNumber)!== correctAnswers.charAt(questionNumber)){
            secondsLeft = secondsLeft - 10
        }

        if(questionNumber < questionsArray.length - 1) {
            questionNumber++ 
            writeQuestion()
        } else {
            writeResults()
        }
    secondsText.textContent = secondsLeft + ' Seconds'
    }
})

highScoresButton.addEventListener('click', function(){
    openHighscores()
})

backArrow.addEventListener('click', function(){
    closeHighscores()
})

// Calls functions needed to initialize quiz
writeQuestion()
getHighScores()
writeHighScores()

// sets correct answer string for comparision to userAnswer
for (let i = 0; i < questionsArray.length; i++) {
    correctAnswers += questionsArray[i].answer
}


// Function Section
function getHighScores(){
    if(localStorage.getItem('highscores')){
        highScores = JSON.parse(localStorage.getItem('highscores'))
    }
}

function openHighscores(){
    if(highScoresAside.dataset.open === 'false')
    highScoresAside.dataset.open = "true"
}

function closeHighscores(){
    if(highScoresAside.dataset.open === 'true')
    highScoresAside.dataset.open = "false"
}

function startTimer(){
    timerInterval = setInterval(function(){
        secondsLeft--
        secondsText.textContent = secondsLeft + ' Seconds'
        // check if time has run out, or if by selecting a wrong answer 
        // the time would be negaitive, it resets time to 0
        if (secondsLeft === 0 || Math.sign(secondsLeft) === -1){
            secondsLeft = 0
            secondsText.textContent = secondsLeft + ' Seconds'
            clearInterval(timerInterval)
            writeResults()
        }
    },1000)
}

function writeQuestion(){
    question.innerText = questionsArray[questionNumber].question
    answer1.innerText = questionsArray[questionNumber].choices[0]
    answer2.innerText = questionsArray[questionNumber].choices[1]
    answer3.innerText = questionsArray[questionNumber].choices[2]
    answer4.innerText = questionsArray[questionNumber].choices[3]
}

function writeResults(){
    quizSection.setAttribute('style', 'display:none')
    resultsSection.setAttribute('style', 'display:flex; flex-direction:row')
    // Creates divs for each of the questions in the review section
    for (let i = 0; i < questionsArray.length; i++) {
        var newDiv = document.createElement('div')
        if (userAnswers.charAt(i) === correctAnswers.charAt(i)){  
            newDiv.textContent = 'Question ' + (i + 1) + ' is correct'
            score++
        } else if(userAnswers.charAt(i) === ''){
            newDiv.textContent = 'Question ' + (i + 1) + ' was not answered'
        } else {
            newDiv.textContent = 'Question ' + (i + 1) + ' is incorrect'
        }
        reviewSection.appendChild(newDiv)
    }
    
    // score section, calculation
    if (secondsLeft !== 0){
        score = score * secondsLeft
    } else {
        score = score
    }

    userScore.innerText = score
    isHighScore()
    // creates restart button
    restartButton = document.createElement('button')
    restartButton.textContent = 'Restart'
    restartButton.classList.add('restart-button')
    scoreContainer.appendChild(restartButton)
    // removes previous round results onClick of restart button
    restartButton.addEventListener('click', function(){
        userAnswers = ''
        questionNumber = 0
        secondsLeft = 20
        // removes appended children
        while (reviewSection.firstChild) {
        reviewSection.removeChild(reviewSection.firstChild)
        }
        scoreContainer.removeChild(restartButton)
        // resets scorecard
        reviewSection.setAttribute('style', 'display:none')
        scorecardButton.textContent = 'Show scorecard'
        scorecardButton.dataset.visible = 'hidden'
        score = 0
        inputContainer.setAttribute('style', 'display: inline')
        saveScoreBtn.setAttribute('style', 'display:inline')
        initialsInput.disabled = false
        // restarts quiz section
        startTimer()
        resultsSection.setAttribute('style', 'display:none')
        reviewSection.setAttribute('style', 'display:none')
        quizSection.setAttribute('style', 'display:flex')
        writeQuestion()
    })
    clearInterval(timerInterval)

    // !!Don't take these event listeners out of write results function!!
    saveScoreBtn.addEventListener('click', function(){
        setScores() 
         
    },{once:true})

    initialsInput.addEventListener('keypress', enterKey)
}

function enterKey(event){
    if(event.code === 'Enter'){
        setScores()
    }
}

// Get previous highscores, add most recent score to array, sort by score
function setScores(){
    userInitials = initialsInput.value.toUpperCase()
    if(localStorage.getItem('highscores')){
        highScores = JSON.parse(localStorage.getItem('highscores'))
    }
    highScores.unshift({initials: userInitials, score: score})
    highScores.sort((a, b) => b['score'] - a['score'])
    // if array.length > 10 remove last item in array
    if(highScores.length > 10){
        highScores.pop()
    }
    localStorage.setItem('highscores', JSON.stringify(highScores))
    writeHighScores()
    saveScoreBtn.setAttribute('style', 'display:none')
    initialsInput.disabled = true 
    initialsInput.removeEventListener('keypress', enterKey)
}

function isHighScore(){
    let j = highScores.length
    let min = highScores[j-1].score
    if(min < score){
        highscoreText.innerHTML = 'Congratulations! <br> You got a highscore!'
    } else {
        highscoreText.innerHTML = 'Good Job! <br> You scored:'
        inputContainer.setAttribute('style', 'display: none')
    }
}

function writeHighScores(){
    highScores.forEach((c, i) => {
        let position = i + 1
        let positionSelector = '.position' + position
        let el = document.querySelector(positionSelector)
        let initialsEl = el.children[0]
        let scoreEl = el.children[1]
        if(c.initials){
            initialsEl.textContent = c.initials
        } else {
            initialsEl.textContent = '- - -'
        }
        if (c.score){
        scoreEl.textContent = c.score
        } else {
            scoreEl.textContent = '- -'
        }}
    )
}
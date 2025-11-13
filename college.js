document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const nextBtn = document.getElementById("next-btn");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const questionNumberDisplay = document.getElementById("question-number");

  let index = 0;
  let score = 0;
  let questions = [];
  let userAnswers = [];
  let timerInterval;
  let totalTimeLeft = 90; // 1.30 minutes = 90 seconds for all 10 questions

  // Fetch questions from Open Trivia Database API
  async function fetchQuestions() {
    try {
      questionText.textContent = "Loading questions...";
      
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      
      const data = await response.json();
      
      questions = data.results.map((q) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = q.question;
        const question = txt.value;
        
        const allChoices = [...q.incorrect_answers, q.correct_answer];
        const shuffled = allChoices.sort(() => Math.random() - 0.5);
        
        txt.innerHTML = q.correct_answer;
        const answer = txt.value;
        
        const choices = shuffled.map((choice) => {
          txt.innerHTML = choice;
          return txt.value;
        });
        
        return {
          question,
          choices,
          answer,
        };
      });
      
      showQuestion();
      startTimer();
    } catch (error) {
      questionText.textContent = "Error loading questions. Please try again.";
      console.error("Error:", error);
      
      setTimeout(() => {
        questionContainer.classList.add("hidden");
        startBtn.classList.remove("hidden");
      }, 2000);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    timerDisplay.textContent = `Time: ${formatTime(totalTimeLeft)}`;
    
    timerInterval = setInterval(() => {
      totalTimeLeft--;
      timerDisplay.textContent = `Time: ${formatTime(totalTimeLeft)}`;
      
      if (totalTimeLeft <= 30) {
        timerDisplay.style.color = "#dc3545";
      } else {
        timerDisplay.style.color = "#ffffff";
      }
      
      if (totalTimeLeft <= 0) {
        clearInterval(timerInterval);
        // Time's up - show results
        showResult();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  startBtn.addEventListener("click", startQuiz);

  nextBtn.addEventListener("click", nextQuestion);

  restartBtn.addEventListener("click", () => {
    stopTimer();
    resultContainer.classList.add("hidden");
    index = 0;
    score = 0;
    questions = [];
    userAnswers = [];
    totalTimeLeft = 90;
    startBtn.classList.remove("hidden");
    questionContainer.classList.add("hidden");
  });

  function startQuiz() {
    startBtn.classList.add("hidden");
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    index = 0;
    score = 0;
    userAnswers = [];
    totalTimeLeft = 90;
    
    fetchQuestions();
  }

  function showQuestion() {
    nextBtn.classList.add("hidden");
    questionText.textContent = questions[index].question;
    questionNumberDisplay.textContent = `Question ${index + 1} of ${questions.length}`;

    choicesList.innerHTML = "";

    questions[index].choices.forEach((choice) => {
      const li = document.createElement("li");
      li.textContent = choice;

      li.addEventListener("click", () => selectedAnswer(li, choice));
      choicesList.appendChild(li);
    });
  }

  function selectedAnswer(selectedLi, choice) {
    const allChoices = choicesList.querySelectorAll("li");

    // Remove previous selection
    allChoices.forEach((li) => {
      li.classList.remove("selected");
      li.style.pointerEvents = "none";
    });

    // Mark current selection
    selectedLi.classList.add("selected");

    // Store user's answer
    userAnswers[index] = choice;

    nextBtn.classList.remove("hidden");
  }

  function nextQuestion() {
    index++;
    if (index < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    stopTimer();
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    
    // Calculate score
    score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) {
        score++;
      }
    });
    
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    
    if (percentage >= 80) {
      message = "🎉 Excellent!";
    } else if (percentage >= 60) {
      message = "👍 Good Job!";
    } else if (percentage >= 40) {
      message = "😊 Not Bad!";
    } else {
      message = "📚 Keep Practicing!";
    }
    
    const timeTaken = 90 - totalTimeLeft;
    
    scoreDisplay.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 15px;">${message}</div>
      <div style="font-size: 20px;">You scored ${score} out of ${questions.length}</div>
      <div style="font-size: 16px; margin-top: 10px; opacity: 0.9;">Time taken: ${formatTime(timeTaken)}</div>
    `;
  }
});

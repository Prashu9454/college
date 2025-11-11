document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const nextBtn = document.getElementById("next-btn");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");

  let index = 0;
  let score = 0;
  let questions = [];

  // Fetch questions from Open Trivia Database API
  async function fetchQuestions() {
    try {
      questionText.textContent = "Loading questions...";
      
      // Fetching 10 multiple choice questions
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      
      const data = await response.json();
      
      // Transform API data to our format
      questions = data.results.map((q) => {
        // Decode HTML entities
        const txt = document.createElement("textarea");
        txt.innerHTML = q.question;
        const question = txt.value;
        
        // Combine correct and incorrect answers
        const allChoices = [...q.incorrect_answers, q.correct_answer];
        
        // Shuffle choices
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
    } catch (error) {
      questionText.textContent = "Error loading questions. Please try again.";
      console.error("Error:", error);
      
      // Show restart button to try again
      setTimeout(() => {
        questionContainer.classList.add("hidden");
        startBtn.classList.remove("hidden");
      }, 2000);
    }
  }

  startBtn.addEventListener("click", startQuiz);

  nextBtn.addEventListener("click", () => {
    index++;
    if (index < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });

  restartBtn.addEventListener("click", () => {
    resultContainer.classList.add("hidden");
    index = 0;
    score = 0;
    questions = [];
    startBtn.classList.remove("hidden");
    questionContainer.classList.add("hidden");
  });

  function startQuiz() {
    startBtn.classList.add("hidden");
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    index = 0;
    score = 0;
    
    // Fetch new questions from API
    fetchQuestions();
  }

  function showQuestion() {
    nextBtn.classList.add("hidden");
    questionText.textContent = questions[index].question;

    choicesList.innerHTML = "";

    questions[index].choices.forEach((choice) => {
      const li = document.createElement("li");
      li.textContent = choice;

      li.addEventListener("click", () => selectedAnswer(li, choice));
      choicesList.appendChild(li);
    });
  }

  function selectedAnswer(selectedLi, choice) {
    const correctAnswer = questions[index].answer;
    const allChoices = choicesList.querySelectorAll("li");

    allChoices.forEach((li) => {
      li.style.pointerEvents = "none";

      if (li.textContent === correctAnswer) {
        li.classList.add("correct");
      }
      if (li.textContent === choice && choice !== correctAnswer) {
        li.classList.add("wrong");
      }
    });

    selectedLi.classList.add("selected");

    if (choice === correctAnswer) {
      score++;
    }

    nextBtn.classList.remove("hidden");
  }

  function showResult() {
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreDisplay.textContent = `🎉 You scored ${score} / ${questions.length}!`;
  }
});
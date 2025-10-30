
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

  const questions = [
    {
      question: "What is the capital of France?",
      choices: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      choices: ["Mars", "Venus", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      question: "Who wrote the book - 'Hamlet'?",
      choices: [
        "Charles Dickens",
        "Jane Austen",
        "William Shakespeare",
        "Mark Twain",
      ],
      answer: "William Shakespeare",
    },
    {
      question: "Which is the largest mammal?",
      choices: ["Elephant", "Blue Whale", "Giraffe", "Rhino"],
      answer: "Blue Whale",
    },
    {
      question: "Which gas do plants absorb during photosynthesis?",
      choices: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      answer: "Carbon Dioxide",
    },
    {
      question: "In which continent is the Sahara Desert located?",
      choices: ["Asia", "Africa", "Australia", "South America"],
      answer: "Africa",
    },
    {
      question: "Which is the smallest prime number?",
      choices: ["0", "1", "2", "3"],
      answer: "2",
    },
    {
      question: "What is the boiling point of water at sea level?",
      choices: ["50°C", "75°C", "100°C", "150°C"],
      answer: "100°C",
    },
  ];

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
    startBtn.classList.remove("hidden"); // show start again
    questionContainer.classList.add("hidden");
  });

  function startQuiz() {
    startBtn.classList.add("hidden");
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    showQuestion();
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
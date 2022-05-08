const apiLink = "https://api.quotable.io/random?minLength=100&maxLength=140";
let TIME_LIMIT = 60;
let container = document.querySelector(".word");
let inputContainer = document.getElementById("input");
let theme = document.getElementById("mode-toggle");
let darkmode = false;
let body = document.querySelector(".mode");
let scoreContainer = document.querySelector(".score_container");
let typingSection = document.querySelector(".typing-section");
let errorCount = document.getElementById("error");
let accuracyPercent = document.getElementById("accuracy");
let cpmContainer = document.getElementById("cpm");
let wpmContainer = document.getElementById("wpm");
const restartBtn = document.getElementById("btn");
let typingsound = new Audio("click.wav");
let errorsound = new Audio("error.wav");

let words = [
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod quisquam necessitatibus sapiente! Doloremque, culpa cupiditate! Neque animi fugiat nam quisquam consequatur esse fuga atque vero quod quas. Quasi, laborum delectus.",
];
let dummy =
  "Most of the important things in the world have been accomplished by people who have kept on trying when there seemed to be no hope at all.";

let total_errors = 0;
let errors = 0;
let quoteNo = 0;
let currenQuote = "";
let characterTyped = 0;
let accuracy = 0;
let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let timer = null;

function fetchWords() {
  fetch(apiLink)
    .then((res) => res.json())
    .then((data) => {
      showQuote(data.content);
    })
    .catch((e) => console.log(e));
}

fetchWords();

function showQuote(word) {
  container.textContent = null;
  wordData = word;
  // separating each character and add span element to style them

  wordData &&
    wordData.split("").forEach((char) => {
      const spanElement = document.createElement("span");
      spanElement.innerText = char;

      container.appendChild(spanElement);
    });

  // roll over to first quote
  if (quoteNo < words.length - 1) {
    quoteNo++;
  } else {
    quoteNo = 0;
  }

  matchingInput(word && word);
}

async function matchingInput(word) {
  // get input and split it
  current_input = inputContainer.value;
  current_input_array = current_input.split("");

  
  if(word&&word.length===current_input.length){
    restart()
  }
  // increment total characters typed
  // typingsound.play();
  characterTyped++;
  errors = 0;

  quoteSpanArray = container.querySelectorAll("span");
  quoteSpanArray.forEach((char, index) => {
    let typedChar = current_input_array[index];

    if (typedChar == null) {
      char.classList.remove("correct");
      char.classList.remove("wrong");
    } else if (typedChar === char.innerText) {
      typingsound.play();
      errorsound.pause();

      char.classList.add("correct");
      char.classList.remove("wrong");
    
      // incorrect characters
    } else {
      errorsound.play();
      typingsound.pause();
      char.classList.add("wrong");
      char.classList.remove("correct");

      // increment number of errors
      errors++;
    }
  });

  // implement total errors count
  errorCount.textContent = total_errors + errors;

  // update accuracy
  let correctCharacters = characterTyped - (total_errors + errors);
  let accuracyValue = (correctCharacters / characterTyped) * 100;
  accuracyPercent.textContent = "%" + Math.round(accuracyValue);

  // calculating cpm and wpm
  cpm = Math.round((characterTyped / timeElapsed) * 60);
  wpm = Math.round((characterTyped / 5 / timeElapsed) * 60);

  // updating cpm and wpm
  cpmContainer.textContent = cpm;
  wpmContainer.textContent = wpm;

  // console.log(word ?word.length: dummy.length)
  if (inputContainer.value.length == word && word.length) {
    console.log(inputContainer.length);
    showStats();
  }
  
}

matchingInput();

showQuote();

function updateTimer() {
  if (timeLeft > 0) {
    // decrease the current time left
    timeLeft--;

    // increase the time elapsed
    timeElapsed++;

    // update the timer text
  }
}

updateTimer();

function restart() {
  scoreContainer.style.display = "none";
  typingSection.style.display = "block";
  inputContainer.value = "";
  window.location = "index.html";
}

restartBtn.addEventListener("click", () => {
  restart();
});

function showStats() {
  scoreContainer.style.display = "block";
  typingSection.style.display = "none";
}

function themeSwitch() {
  const btn = document.getElementById("mode-toggle");
  if (localStorage.getItem("darkTheme")) {
    document.body.classList.add("active");
  }
  btn.addEventListener("click", () => {
    localStorage.setItem("darkTheme", "true");
    document.body.classList.toggle("active");
    btn.textContent = "on";
    if (document.body.classList.contains("active")) {
      localStorage.removeItem("darkTheme");
      document.body.classList.remove("darkTheme");
    }
  });
}

themeSwitch();

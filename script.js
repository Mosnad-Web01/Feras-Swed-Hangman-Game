// Function to create the Hangman game elements
function createGameElements() {
  const gameContainer = document.createElement("div");
  gameContainer.id = "game-container";

  // Word Display
  const wordDisplayDiv = document.createElement("div");
  wordDisplayDiv.id = "word-display";
  gameContainer.appendChild(wordDisplayDiv);

  // Letters Container
  const lettersDiv = document.createElement("div");
  lettersDiv.id = "letters";
  gameContainer.appendChild(lettersDiv);

  // Wrong Guesses
  const wrongGuessesDiv = document.createElement("div");
  wrongGuessesDiv.id = "wrong-guesses";
  gameContainer.appendChild(wrongGuessesDiv);

  // Hangman Image
  const hangmanImg = document.createElement("img");
  hangmanImg.id = "hangman-image";
  hangmanImg.src = "images/hangman0.png";
  gameContainer.appendChild(hangmanImg);

  // Message
  const messageDiv = document.createElement("div");
  messageDiv.id = "message";
  gameContainer.appendChild(messageDiv);

  // Reset Button
  const resetBtn = document.createElement("button");
  resetBtn.id = "reset-button";
  resetBtn.textContent = "Reset Game";
  resetBtn.style.display = "none";
  gameContainer.appendChild(resetBtn);

  document.body.appendChild(gameContainer);
}

createGameElements();

const wordDisplay = document.getElementById("word-display");
const lettersContainer = document.getElementById("letters");
const wrongGuessesDisplay = document.getElementById("wrong-guesses");
const hangmanImage = document.getElementById("hangman-image");
const messageDisplay = document.getElementById("message");
const resetButton = document.getElementById("reset-button");

let word = "";
let guessedLetters = [];
let wrongGuesses = 0;
let maxGuesses = 6;

// API URL for fetching words
const apiUrl = "https://random-word-api.herokuapp.com/word?number=1";

// Function to fetch a random word from the API
async function getWord() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    word = data[0].toLowerCase();
  } catch (error) {
    console.error("Error fetching word:", error);
    messageDisplay.textContent =
      "Failed to fetch a word. Please try again later.";
  }
}

// Function to display the word with blanks for unguessed letters
function displayWord() {
  let displayedWord = "";
  for (let i = 0; i < word.length; i++) {
    if (guessedLetters.includes(word[i])) {
      displayedWord += word[i] + " ";
    } else {
      displayedWord += "_ ";
    }
  }
  wordDisplay.textContent = displayedWord;
}

let hint;

function generateHint() {
  switch (word) {
    // case "word1":
    //   hint = "Hint for word 1";
    //   break;
    // case "word2":
    //   hint = "Hint for word 2";
    //   break;
    //  Add Cases
    default:
      hint = `The word might be something ${
        [...word][Math.floor(Math.random() * [...word].length)]
      } `; //default hint if the word not matched in the cases
      break;
  }

  const hintBox = document.createElement("div");
  hintBox.id = "hint-box";
  hintBox.innerHTML = `<strong>Hint:</strong> ${hint}`;

  // Add the hint box after the Message Display
  messageDisplay.after(hintBox); // add this code line after this function
}

// Add Audio Elements

//Win music and background
let winMusic = new Audio("pathto/to/winMusic.mp3");
// lose music and background
let loseMusic = new Audio("pathto/to/loseMusic.mp3");

// Function to handle letter clicks
function handleLetterClick(letter) {
  if (guessedLetters.includes(letter) || wrongGuesses >= maxGuesses) {
    return;
  }

  guessedLetters.push(letter);

  if (!word.includes(letter)) {
    wrongGuesses++;
    hangmanImage.src = `images/hangman${wrongGuesses}.png`;
  }

  displayWord();
  updateGuesses();

  checkWinOrLose();
}

// Function to update the wrong guesses display
function updateGuesses() {
  wrongGuessesDisplay.textContent = `Wrong Guesses: ${wrongGuesses} / ${maxGuesses}`;
}

// Function to check if the player won or lost

function checkWinOrLose() {
  if (word.split("").every((letter) => guessedLetters.includes(letter))) {
    messageDisplay.textContent = `Congratulations! You guessed the word: ${word}`;
    resetButton.style.display = "block";
    document.body.classList.add("win"); // Change background to Green
    winMusic.play(); // Start Playing the win music
  } else if (wrongGuesses >= maxGuesses) {
    messageDisplay.textContent = `Game Over! The word was: ${word}`;
    resetButton.style.display = "block";
    document.body.classList.add("lose"); // Change background to Red
    loseMusic.play(); // Start Playing the lose music
  }
}

// Function to reset the game
function resetGame() {
  word = "";
  guessedLetters = [];
  wrongGuesses = 0;
  hangmanImage.src = "images/hangman0.png";
  wordDisplay.textContent = "";
  lettersContainer.innerHTML = "";
  messageDisplay.textContent = "";
  resetButton.style.display = "none";

  getWord().then(() => {
    createLetters();
    displayWord();
    generateHint();
  });

  // Generate a hint each time game resets.

  // Reset CSS
  document.body.classList.remove("win");
  document.body.classList.remove("lose");

  // reset musics
  winMusic.pause();
  winMusic.currentTime = 0; // reset the audio to beginning

  loseMusic.pause();
  loseMusic.currentTime = 0; // reset the audio to beginning
}

// Function to create the letter buttons dynamically
function createLetters() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < alphabet.length; i++) {
    const letterButton = document.createElement("button");
    letterButton.textContent = alphabet[i];
    letterButton.classList.add("letter");
    letterButton.addEventListener("click", () =>
      handleLetterClick(alphabet[i])
    );
    lettersContainer.appendChild(letterButton);
  }
}

// Initialize the game
// Create the elements when game starts
getWord().then(() => {
  createLetters();
  displayWord();
  updateGuesses();
});

resetButton.addEventListener("click", resetGame);

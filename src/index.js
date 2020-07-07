console.log("hi")

// DOM Access
const wordContainer = document.querySelector("#word-container")
const roomCodeSpan = document.querySelector("#room-code")
const createGameButton = document.querySelector("#create-game-button")
const joinGameButton = document.querySelector("#join-game-button")
const joinFormContainer = document.querySelector("#join-form-container")
const joinGameForm = document.querySelector("#join-game-form")
const errorMessageText = document.querySelector("#join-error-message")



// Render Helpers
createGameButton.addEventListener("click", () => {
    // fetch("http://localhost:3000/words")
    //     .then(r => r.json())
    //     .then(wordData => {
    //         wordContainer.innerHTML = ""
    //         wordData.forEach(createWordButton)
    //     })

    fetch("http://localhost:3000/games", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({room_code: generateRoomCode(4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')})
    })
        .then(r => r.json())
        .then(newGameData => {
            displayGame(newGameData)
        })
})

joinGameButton.addEventListener("click", () => {
  // show a form for submitting the room code
  joinGameForm.style.display = "block"

  // nested listener for form submit
  joinGameForm.addEventListener("submit", e => {
    e.preventDefault()
    const roomCode = e.target.code.value
    // fetch from the games to see if any have a room code that matches the value

  fetch(`http://localhost:3000/games/${roomCode}`)
        .then(r => r.json())
        .then(gameObj => {
          if (gameObj){
            // hide the join game form
            joinGameForm.style.display = "none"
            displayGame(gameObj)  }
          else{
        
             // Maybe make the message flash instead?
        
            // if there is already an error message remove and redisplay error message
            // so the user can see that something is happening
            if (errorMessageText.textContent){
              errorMessageText.textContent = ""
              setTimeout(function(){ errorMessageText.textContent = "There was no room with that code. Please try again or create a new game."; }, 400)
            }
            else{
              errorMessageText.textContent = "There was no room with that code. Please try again or create a new game.";
            }
          }
        })
  })
})

function createWordButton(game_word) {
    const wordElement = document.createElement("p")
    wordElement.textContent = `${game_word.name}`

    wordContainer.append(wordElement)
}

function generateRoomCode(length, characters) {
    let result = "";
    for (let i = length; i > 0; --i) result += characters[Math.floor(Math.random() * characters.length)];
    return result;
}

function displayGame(gameObj){
  // clear error message if any
  errorMessageText.textContent = ""
  roomCodeSpan.textContent = `${gameObj.room_code}`
  wordContainer.innerHTML = ""
  gameObj.game_words.forEach(createWordButton)
  console.log(gameObj)
}
// Initialize

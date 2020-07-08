console.log("hi")

// DOM Access
const wordContainer = document.querySelector("#word-container")
const roomCodeSpan = document.querySelector("#room-code")
const createGameButton = document.querySelector("#create-game-button")
const joinGameButton = document.querySelector("#join-game-button")
const joinFormContainer = document.querySelector("#join-form-container")
const joinGameForm = document.querySelector("#join-game-form")
const errorMessageText = document.querySelector("#join-error-message")
const wordsLeftNumber = document.querySelector("#words-left")
const teamColorTurn = document.querySelector("#team-color")
const gameDataBar = document.querySelector("#game-info")
const bottomButtons = document.querySelector("#bottom-buttons")

let currentRoomCode = ""



// Render Helpers
createGameButton.addEventListener("click", () => {
    gameDataBar.style.display = "flex"
    bottomButtons.style.display = "flex"

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
            wordsLeftNumber.textContent = newGameData.orange_words_left
            teamColorTurn.textContent = "orange"
            currentRoomCode = newGameData.room_code
        })
})

joinGameButton.addEventListener("click", () => {
  // show a form for submitting the room code
  joinGameForm.style.display = "block"


  // nested listener for form submit
  joinGameForm.addEventListener("submit", e => {
    e.preventDefault()
    const roomCode = e.target.code.value

    gameDataBar.style.display = "flex"
    bottomButtons.style.display = "flex"
    // fetch from the games to see if any have a room code that matches the value

  fetch(`http://localhost:3000/games/${roomCode}`)
        .then(r => r.json())
        .then(gameObj => {
          if (gameObj){
            // hide the join game form
            joinGameForm.style.display = "none"
            displayGame(gameObj)  
            wordsLeftNumber.textContent = gameObj.orange_words_left
            if (gameObj.orange_turn){
              teamColorTurn.textContent = "orange"
              wordsLeftNumber.textContent = gameObj.orange_words_left
            }
            else{
              teamColorTurn.textContent = "purple"
              wordsLeftNumber.textContent = gameObj.purple_words_left
            }
            currentRoomCode = gameObj.room_code
          }
          else{
                
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

function createWordButton(game_word, gameObj) {
    const wordElement = document.createElement("p")
    wordElement.textContent = `${game_word.name}`
    wordElement.dataset.category = game_word.category
    wordElement.className = "word-element"

    // event listener for clicking on a word
    if (game_word.guessed === true) {
        wordElement.className = game_word.category
    } else {
        wordElement.addEventListener("click", () => {
            wordElement.className = game_word.category

            console.log(game_word)
            console.log(gameObj)

            const gameStatus = {}
            // check the category
            switch (true){
            
            case ((teamColorTurn.textContent === "orange") && (game_word.category === 'orange')):
                gameObj.orange_words_left -= 1
                gameStatus.orange_words_left = gameObj.orange_words_left
                break;
            case ((teamColorTurn.textContent === "orange") && (game_word.category === 'purple')):
                // change the orange_turn to false
                gameStatus.orange_turn = false
                // purple_words_left -= 1
                gameObj.purple_words_left -= 1
                gameStatus.purple_words_left = gameObj.purple_words_left
                break;

            case ((teamColorTurn.textContent === "orange") && (game_word.category === 'neutral')):
                // post orange_words_left -= 1
                gameStatus.orange_turn = false
                break;

            //purple turn
            case ((teamColorTurn.textContent === "purple") && (game_word.category === 'purple')):
                gameObj.purple_words_left -= 1
                gameStatus.purple_words_left = gameObj.purple_words_left
                break;
            case ((teamColorTurn.textContent === "purple") && (game_word.category === 'orange')):
                // change the orange_turn to true
                gameStatus.orange_turn = true
                // orange_words_left -= 1
                gameObj.orange_words_left -= 1
                gameStatus.orange_words_left = gameObj.orange_words_left
                break;

            case ((teamColorTurn.textContent === "purple") && (game_word.category === 'neutral')):
                // post orange_words_left -= 1
                gameStatus.orange_turn = true
        
                break;

            case (game_word.category === 'bomb'):
                //game over
                const winner = gameObj.orange_turn ? "Purple" : "Orange"
                gameOver(gameObj, winner)
                break;
            
            }
            console.log(gameStatus)
            // PATCH fetch (to update game and gameword guessed to true)
            fetch(`http://localhost:3000/games/${gameObj.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameStatus),
            })
            .then(response => response.json())
            .then(updatedGameObj => {
            // render the new wordcount and turn
                if (updatedGameObj.orange_turn){
                    teamColorTurn.textContent = "orange"
                    wordsLeftNumber.textContent = updatedGameObj.orange_words_left
                    if (updatedGameObj.orange_words_left === 0) {
                        gameOver(updatedGameObj, "Orange")
                    }
                }
                else{
                    teamColorTurn.textContent = "purple"
                    wordsLeftNumber.textContent = updatedGameObj.purple_words_left
                    if (updatedGameObj.purple_words_left === 0) {
                        gameOver(updatedGameObj, "Purple")
                    }
                }
                updateGameWord(game_word, updatedGameObj)
            })
        }, {once : true});
    }

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
  gameObj.game_words.forEach(word => createWordButton(word, gameObj))
  console.log(gameObj)
}

function updateGameWord(game_word, gameObj) {
    fetch(`http://localhost:3000/game_words/${game_word.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({guessed: true}),
        })
        .then(response => response.json())
        .then(updatedGameWord => {
            const found_game_word = gameObj.game_words.find(game_word => game_word.id == updatedGameWord.id)
            found_game_word.guessed = true
        })
}

function deleteRound(gameObj) {
    fetch(`http://localhost:3000/games/${gameObj.id}`, {
        method: 'DELETE'
    })
        .then(r => r.text())
        .then(console.log)
}

function createNewRound(currentRoomCode) {
    fetch(`http://localhost:3000/games/${currentRoomCode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({room_code: currentRoomCode}),
    })
        .then(response => response.json())
        .then(newGameData => {
            displayGame(newGameData)
            wordsLeftNumber.textContent = newGameData.orange_words_left
            teamColorTurn.textContent = "orange"
        })
}
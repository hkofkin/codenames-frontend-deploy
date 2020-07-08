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
const spymasterViewButton = document.querySelector("#spymaster-view-button")
const endTurnButton = bottomButtons.querySelector("#end-turn-button")

let currentRoomCode = ""

// Render Helpers
createGameButton.addEventListener("click", () => {
    gameDataBar.style.display = "flex"
    bottomButtons.style.display = "flex"

    createGame()
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
      getGameByRoomCode(roomCode)
        .then(gameObj => {
          if (gameObj){
            displayGame(gameObj)             
          }
          else{
              displayErrors()
          }
        })
  })
})

function createWordButton(game_word, gameObj) {
    const wordElement = document.createElement("button")
    wordElement.disabled = false
    wordElement.textContent = `${game_word.name}`
    wordElement.dataset.category = game_word.category
    wordElement.className = "word-element"

    // event listener for clicking on a word
    if (game_word.guessed === true) {
        wordElement.className = game_word.category
    } else {
        wordElement.addEventListener("click", () => {
            wordElement.className = game_word.category

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
            // PATCH fetch (to update game turn and score)
            updateGame(gameObj.id, gameStatus)
              .then(updatedGameObj => {
                endTurnButton.dataset.turn = updatedGameObj.orange_turn ? "orange" : "purple"
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
    // let result = "";
    // for (let i = length; i > 0; --i) result += characters[Math.floor(Math.random() * characters.length)];
    // return result;

    return Math.random().toString(16).substr(2, 5);
}

function displayGame(gameObj){
  // clear error message if any
  errorMessageText.textContent = ""
  // hide join game form if open 
  joinGameForm.style.display = "none"

  displayGameDetails(gameObj)

  wordContainer.innerHTML = ""
  gameObj.game_words.forEach(word => createWordButton(word, gameObj))
  console.log(gameObj)
}

function displayGameDetails(gameObj){
  //display turn and score info
  if (gameObj.orange_turn){
    teamColorTurn.textContent = "orange"
    wordsLeftNumber.textContent = gameObj.orange_words_left
  }
  else{
    teamColorTurn.textContent = "purple"
    wordsLeftNumber.textContent = gameObj.purple_words_left
  }
  // store room code in global variable and display on screen
  currentRoomCode = gameObj.room_code
  roomCodeSpan.textContent = `${gameObj.room_code}`
  endTurnButton.dataset.id = gameObj.id
  endTurnButton.dataset.turn = gameObj.orange_turn ? "orange" : "purple"
  
}

function displayErrors(){
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

spymasterViewButton.addEventListener("click", () => {

    if (spymasterViewButton.textContent === "SPYMASTER VIEW: OFF") {
        const foundWords = wordContainer.querySelectorAll(".word-element")
        spymasterViewButton.textContent = "SPYMASTER VIEW: ON"

        foundWords.forEach(foundWord => {
            foundWord.className = "spymaster-on"
            foundWord.disabled = true
        })
    } else {
        const foundWords = wordContainer.querySelectorAll(".spymaster-on")
        spymasterViewButton.textContent = "SPYMASTER VIEW: OFF"

        foundWords.forEach(foundWord => {
            foundWord.className = "word-element"
            foundWord.disabled = false
        })
    }
})

// end turn event listener
endTurnButton.addEventListener("click", (e) => endTurn(e))

function endTurn(e){

    e.target.dataset.turn = toggle(e.target.dataset.turn, "orange", "purple")
    // if (e.target.dataset.turn === "orange"){
    //     e.target.dataset.turn = "purple"
    // }
    // else{
    //     e.target.dataset.turn = "orange"
    // }
    
    // update who's turn it is (fetch)
    const gameId = e.target.dataset.id
    const data = {
        orange_turn: e.target.dataset.turn === "orange"
    }
    
    updateGame(gameId, data)
    // duplicated from line 120 - make into fn!!!!
    .then(updatedGameObj => {
        // display turn and score on the dom
        endTurnButton.dataset.turn = updatedGameObj.orange_turn ? "orange" : "purple";
            
            if (updatedGameObj.orange_turn){
                teamColorTurn.textContent = "orange"
                wordsLeftNumber.textContent = updatedGameObj.orange_words_left
            }
            else{
                teamColorTurn.textContent = "purple"
                wordsLeftNumber.textContent = updatedGameObj.purple_words_left
            }
        }
    )}


function toggle(attribute, value1, value2){
    if (attribute === value1){
        return value2
    }
    else{
        return value1
    }
}
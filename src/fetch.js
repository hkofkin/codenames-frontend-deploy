
function createGame(){
  return fetch("http://localhost:3000/games", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({room_code: generateRoomCode()})
  })
  .then(r => r.json())
}

function getGameByRoomCode(roomCode){
  return fetch(`http://localhost:3000/games/${roomCode}`)
  .then(r => r.json())
}

function updateGame(id, data){
  return fetch(`http://localhost:3000/games/${id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
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
          const foundGameWord = gameObj.game_words.find(game_word => game_word.id == updatedGameWord.id)
          foundGameWord.guessed = true
          console.log("updatedGameWord", updatedGameWord)
      })
}

function deleteRound(gameId) {
    fetch(`http://localhost:3000/games/${gameId}`, {
        method: 'DELETE'
    })
        .then(r => r.text())
        .then(deleteData => {
          console.log("deleteData", deleteData)
        })
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
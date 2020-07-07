console.log("hi")

// DOM Access
const wordContainer = document.querySelector("#word-container")
const roomCodeSpan = document.querySelector("#room-code")
const createGameButton = document.querySelector("#create-game-button")

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
            roomCodeSpan.textContent = `${newGameData.room_code}`
            wordContainer.innerHTML = ""
            newGameData.game_words.forEach(createWordButton)
            console.log(newGameData)
        })
})

function createWordButton(game_word) {
    const wordElement = document.createElement("p")
    wordElement.textContent = `${game_word.name}`

    wordContainer.append(wordElement)
}

function generateRoomCode(length, characters) {
    var result = "";
    for (var i = length; i > 0; --i) result += characters[Math.floor(Math.random() * characters.length)];
    return result;
}


// Initialize

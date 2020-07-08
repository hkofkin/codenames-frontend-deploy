const modal = document.querySelector("#modal")
const newGameButton = document.querySelector("#new-game-button")

newGameButton.addEventListener("click", (e) => {  
    modal.style.display = "none"
    createNewRound(currentRoomCode)
})

function gameOver(gameObj, winner) {

    // display all the answers - show the  spymaster view

    window.setTimeout(displayAllColors, 300);
    
    window.setTimeout(displayModal, 700, gameObj, winner);    
}

function displayModal(gameObj, winner){
    // once the game is over (and modal pops up), the game is destroyed
    deleteRound(gameObj.id)
    modal.style.display = "block"
    const winnerTag = document.querySelector("#winner-tag")
    winnerTag.textContent = `${winner} Team Wins`

    // // display all the answers - show the  spymaster view

    // const nonFoundWords = wordContainer.querySelectorAll(".word-element")

    // nonFoundWords.forEach(word => {
    //     word.className = "spymaster-on"
    //     // word.disabled = false
    // })
}

function displayAllColors(){
    const nonFoundWords = wordContainer.querySelectorAll(".word-element")

    nonFoundWords.forEach(word => {
        word.className = "spymaster-on"
        // word.disabled = false
    })
}
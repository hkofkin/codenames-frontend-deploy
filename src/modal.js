const modal = document.querySelector("#modal")
const newGameButton = document.querySelector("#new-game-button")

newGameButton.addEventListener("click", (e) => {  
    modal.style.display = "none"
    createNewRound(currentRoomCode)
})

function gameOver(gameObj, winner) {
    window.setTimeout(displayModal, 300, gameObj, winner);    
}

function displayModal(gameObj, winner){
    // once the game is over (and modal pops up), the game is destroyed
    deleteRound(gameObj.id)
    modal.style.display = "block"
    const winnerTag = document.querySelector("#winner-tag")
    winnerTag.textContent = `${winner} Team Wins`
}
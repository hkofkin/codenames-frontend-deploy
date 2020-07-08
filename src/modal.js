const modal = document.querySelector("#modal")
const newGameButton = document.querySelector("#new-game-button")

newGameButton.addEventListener("click", (e) => {  
    modal.style.display = "none"
    const gameId = e.target.dataset.id      
    deleteRound(gameId)
})

function gameOver(gameObj, winner) {

    modal.style.display = "block"
    const winnerTag = document.querySelector("#winner")
    winnerTag.textContent = `${winner} Team Wins`

    newGameButton.dataset.id = gameObj.id  
}
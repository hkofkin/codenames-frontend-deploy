const modal = document.querySelector("#modal")
const newGameButton = document.querySelector("#new-game-button")

function gameOver(gameObj, winner) {
    modal.style.display = "block"

    const winnerTag = document.querySelector("#winner")
    winnerTag.textContent = `${winner} Team Wins`

    newGameButton.addEventListener("click", () => {
        modal.style.display = "none"
        deleteRound(gameObj)
    })
}

const modal = document.querySelector("#modal")
const newGameButton = document.querySelector("#new-game-button")

function gameOver(gameObj, winner) {
    modal.style.display = "block"

    const winnerTag = document.createElement("p")
    winnerTag.textContent = `${winner} Team Wins`
    modal.append(winnerTag)

    newGameButton.addEventListener("click", () => {
        modal.style.display = "none"
        deleteRound(gameObj)
        createNewRound(currentRoomCode)
    })
}

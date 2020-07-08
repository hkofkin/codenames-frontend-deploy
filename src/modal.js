const modal = document.querySelector("#modal")
const newGameButton = document.querySelector("#new-game-button")

function gameOver(gameObj, winner) {
    modal.style.display = "block"
    // needed to remove previous winner from modal when someone starts a new game in the same room
    // const winnerTag = document.createElement("p")
    const winnerTag = document.querySelector("#winner-tag")
    winnerTag.textContent = `${winner} Team Wins`
    // modal.append(winnerTag)

    newGameButton.addEventListener("click", () => {
        modal.style.display = "none"
        deleteRound(gameObj)
        createNewRound(currentRoomCode)
    })
}

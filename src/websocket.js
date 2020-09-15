function createGameRoomWebsocketConnection(roomCode) {
    
    // Creates the new WebSocket connection.
    socket = new WebSocket('ws://localhost:3000/cable');
     // When the connection is first created, this code runs subscribing the client to a specific chatroom stream in the ChatRoomChannel.
    socket.onopen = function(event) {
        console.log(event)
        console.log('WebSocket is connected.');
        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                room_code: roomCode,
                channel: 'GameRoomChannel'
            }),
        };
        socket.send(JSON.stringify(msg));
    };
    
    // When the connection is closed, this code will run.
    socket.onclose = function(event) {
         console.log('WebSocket is closed.');
    };
    // When a message is received through the websocket, this code will run.
    socket.onmessage = function(event) {            
        const response = event.data;
        const msg = JSON.parse(response);
        
        // Ignores pings.
        if (msg.type === "ping") {
            return;
        }
        console.log("FROM RAILS: ", msg);
        
        // Renders any newly created messages onto the page.
        if (msg.message.game_word) {
            renderGameWord(msg.message.game_word, msg.message.game)
            // updateGameWord(msg.message, endTurnButton.dataset.id)
            console.log("THIS IS RENDERING THE NEW GAME WORD", msg.message.game_word)
        // } else if (msg.message.room_code) {
            console.log(msg.message)
            renderGame(msg.message.game)
            console.log("THIS IS RENDERING THE UPDATED GAME", msg.message.game)
        }

        // endTurnButton is clicked
        else if (msg.message.room_code){
            // change the turn on the DOM
            if (msg.message.orange_turn){
                teamColorTurn.textContent = "orange"
                endTurnButton.dataset.turn = "orange"
            }
            else{
                teamColorTurn.textContent = "purple"
                endTurnButton.dataset.turn = "purple"
            }
        }

        // newGameButton is clicked
        else if (msg.message.game_words) {
            console.log("the start new game button was clicked", msg.message)
        }
        
    };
    
    // When an error occurs through the websocket connection, this code is run printing the error message.
    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };
}


function renderGameWord(gameWord, gameObj) {
    let wordButton = document.getElementById(`${gameWord.id}`)
    wordButton.className = gameWord.category;

    // window.setTimeout(displayPlayer2Modal, 750, gameWord, gameObj);    

    if ((gameWord.category === "bomb" || gameObj.orange_words_left == 0 || gameObj.purple_words_left == 0) && (modal.style.display === "none") ) {

        console.log("GAME OVER !!!!")
        // gameOver()
        let winner;
        if (gameWord.category === "bomb"){
            winner = gameObj.orange_turn ? "Purple" : "Orange"
        }
        else{
            winner = gameObj.orange_turn ? "Orange" : "Purple"

        }
        displayAllColors()
        modal.style.display = "block"
        const winnerTag = document.querySelector("#winner-tag")
        winnerTag.textContent = `${winner} Team Wins`
    }

    // if ()

    // when one person clicks start new game, modal.style.display should = "none"
    // call : 
    // getGameByRoomCode(roomCode)
        // .then(gameObj => {
        //     if (gameObj){
        //       displayGame(gameObj) 
        //       gameDataBar.style.display = "flex"
        //       bottomButtons.style.display = "flex"
        //       createGameRoomWebsocketConnection(roomCode)
        //     }
        //     else{
        //         displayErrors()
        //     }
        //   })
}

function renderGame(gameObj) {
    if (gameObj.orange_turn) {
        teamColorTurn.textContent = "orange"
        wordsLeftNumberOrange.textContent = gameObj.orange_words_left 
        endTurnButton.dataset.turn = "orange";
 
    } else {
        teamColorTurn.textContent = "purple"
        wordsLeftNumberPurple.textContent = gameObj.purple_words_left 
        endTurnButton.dataset.turn = "purple";
    }
}
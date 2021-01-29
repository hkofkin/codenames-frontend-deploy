let socket;

function createGameRoomWebsocketConnection(roomCode) {
    
    // if there is already an open connection, close it before opening new ws connection
    // (for example if in a game, but create or join a new/diff game, we don't still want to receive from the old game if others are still playing)
    console.log("socket", socket)
    socket && socket.close()
    // Creates the new WebSocket connection.
    socket = new WebSocket('ws://codenames-env.eba-fmhix3fu.us-east-2.elasticbeanstalk.com/cable');
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
        console.log('Existing WebSocket has disconnected.');
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
        // `msg.message &&` removes TypeError Cannot read property 'game_word' of undefined
        if (msg.message && msg.message.game_word) {
            renderGameWord(msg.message.game_word, msg.message.game)
            // updateGameWord(msg.message, endTurnButton.dataset.id)
            console.log("THIS IS RENDERING THE NEW GAME WORD", msg.message.game_word)
        // } else if (msg.message.room_code) {
            console.log(msg.message)
            renderGame(msg.message.game)
            console.log("THIS IS RENDERING THE UPDATED GAME", msg.message.game)
        }

        // endTurnButton is clicked
        else if (msg.message && msg.message.room_code){
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
        else if (msg.message && msg.message.type === "new round") {
            console.log(msg.message)
            console.log(msg.message.game)
            console.log("the start new game button was clicked", msg.message)
            
            displayGame(msg.message.game)
            //close the modal
            modal.style.display = "none"

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
        displayModal(gameObj, winner)
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
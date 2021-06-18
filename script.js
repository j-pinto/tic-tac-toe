const board = (function () {
    let xArray = [];
    let oArray = [];

    let winCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    const squareOccupied = function(square) {
        let x = xArray;
            o = oArray; 
        if ( x.includes(square) || o.includes(square) ) {
            return true
        } else {
            return false
        }
    }

    const badFormat = function (marker, input) {
        if (marker != 'x' && marker != 'o') {
            return true
        } else if (input < 0 || input > 8 || !(Number.isInteger(input))) {
            return true
        } else {
            return false
        }
    }

    const getPlayerArray = function(marker) {
        array = marker == 'x' ? xArray : oArray
        return array
    }

    const addSquare = function(square) {
        player = game.getPlayer();
        let array = getPlayerArray(player.marker); 
        return array.push(square) 
    }

    const inputValid = function(marker, input) {
        if (badFormat(marker, input)) {
            return false
        } 

        if ( squareOccupied(input) ) {
            return false;
        } else {
            return true;
        }
    }

    const refresh = function() {
        let squares = document.getElementsByClassName("square")
        xArray.forEach(element => {
            squares.item(element).innerHTML = 'x'
        });

        oArray.forEach(element => {
            squares.item(element).innerHTML = 'o'
        });
    }

    const win = function(marker) {
        let isWin = false;
        playerArray = getPlayerArray(marker);

        winCombos.forEach(combo => {
            if ( combo.every(element => playerArray.includes(element)) ) {
                isWin = true;
            }
        })
        return isWin;
    }

    const tie = function() {
        occupiedSquares = xArray.length + oArray.length
        if (occupiedSquares >= 9) {
            return true
        } else {
            return false
        }
    }

    return { squareOccupied, inputValid, addSquare, refresh, win, tie }
})();

const game = (function () {
    let turnCount = 0;
    let playerX = {};
    let playerO = {};
    let matchType = '';

     function Player(type, marker, name) {
        this.type = type
        this.name = name
        this.marker = marker
    }

    const setMatchType = function(type) {
        matchType = type;
    }

    const getMatchType = function() {
        return matchType;
    }

    const setPlayer = function(type, marker, name) {
        if (marker == 'x') {
            playerX = new Player(type, marker, name);
        } else {
            playerO = new Player(type, marker, name);
        }
    }

    const getPlayer = function() {
        if (turnCount % 2 == 0) {
            return playerX
        } else {
            return playerO
        }
    }

    const humanTurn = function() {
        let squares = document.getElementsByClassName("square")
        for (let i = 0; i < squares.length; i++) {
            squares.item(i).addEventListener( 'click', executeHumanMove )
        }

        animations.setHighlight();
    }

    const executeHumanMove = function (event) {
        marker = getPlayer().marker
        squareNumber = parseInt(event.target.id.slice(-1))
    
        if (board.inputValid(marker, squareNumber)) {
            board.addSquare(squareNumber);
            nextTurn();
        }
    }

    const computerTurn = function() {
        endMouseListen();
        let compPlayer = getPlayer()
        while (true) {
            randomMove = Math.floor(Math.random() * 9)
            if ( board.inputValid(compPlayer.marker, randomMove) ) {
                board.addSquare(randomMove);
                break;
            }
        }

        setTimeout(() => { nextTurn() }, 2500)
    }

    const endMouseListen = function() {
        let squares = document.getElementsByClassName("square")
        for (let i = 0; i < squares.length; i++) {
            squares.item(i).removeEventListener( 'click', executeHumanMove )
        }
    }

    const nextTurn = function() {
        board.refresh();
        player = getPlayer();

        if ( board.win(player.marker) ) {
            endMouseListen();
            prompts.winGame();
        } else if ( board.tie() ) {
            endMouseListen();
            prompts.tieGame();
        } else {
            turnCount++;
            prompts.move();
            getPlayer().type == 'human' ? humanTurn() : computerTurn()
        }
    }

    const play = function() {
        prompts.setupSequence()
        .then(() => {
            prompts.move()
            getPlayer().type == 'human' ? humanTurn() : computerTurn()
        })
    }

    return { play, getPlayer, setPlayer, setMatchType, getMatchType }

})();

const prompts = (function() {

    const setupSequence = function() {
        return new Promise(function (resolve) {
            intro()
            .then(() => selectMatchType())
            .then((value) => enterMatchInfo(value))
            .then(() => resolve())  
        })
    }

    const intro = function() {
        return new Promise(function (resolve) {
            startPrompt = "Welcome to Tic-Tac-Toe! Click the button below to start a new game."
            document.getElementById("prompt").innerHTML = startPrompt;
    
            document.getElementById("button_container").style.display = "flex"
            document.getElementById("button2").style.display = "none"
    
            startButton = document.getElementById("button1")
            startButton.innerHTML = "Start Game"
            
            startButton.onclick = function() {
                resolve();
            }          
        });
    }

    const selectMatchType = function() {
        return new Promise(function(resolve) {
            document.getElementById("prompt").innerHTML = "Select match type:"

            pvpButton = document.getElementById("button1")
            pvpButton.innerHTML = "Player vs Player"

            pvcButton = document.getElementById("button2")
            pvcButton.style.display = "block"
            pvcButton.innerHTML = "Player vs Computer"
    
            pvpButton.onclick = function() {
                resolve(0);
            }
    
            pvcButton.onclick = function() {
                resolve(1);
            }  
        });
    }

    const enterMatchInfo = function(value) {
        return new Promise(function(resolve) {
            if (value == 0) {
                enterPlayerNames().then(() => resolve())
            } else {
                enterAIMatchSettings().then(() => resolve())
            }
        })
    }

    const enterPlayerNames = function() {
        return new Promise(function(resolve) {
            document.getElementById("button_container").style.display = "none"

            document.getElementById("prompt").innerHTML = "Enter player names"
            form = document.getElementById("pvp_form")
            form.style.display = "block"
    
            form.onsubmit = function() {
                createPvPPlayers()
                form.reset()
                form.style.display = "none"

                resolve()
                return false
            }
        });
    }

    const enterAIMatchSettings = function() {
        return new Promise(function(resolve) {
            document.getElementById("button_container").style.display = "none"

            document.getElementById("prompt").innerHTML = "Enter match settings"
            form = document.getElementById("pvc_form")
            form.style.display = "block"

            form.onsubmit = function() {
                createPvCPlayers()
                form.reset()
                form.style.display = "none"

                resolve()
                return false
            }
        })
    }

    const createPvCPlayers = function() {
        let xRadioButton = document.getElementById("x_radio").checked
        let pMarker;
        xRadioButton == true ? pMarker = 'x' : pMarker = 'o'

        let cMarker;
        pMarker == 'x' ? cMarker = 'o' : cMarker = 'x'

        game.setMatchType('PvC')
        game.setPlayer('human', pMarker, 'Human')
        game.setPlayer('computer', cMarker, 'Computer')
    }

    const createPvPPlayers = function() {
        let xName = document.getElementById("xName").value
        let oName = document.getElementById("oName").value

        game.setMatchType('PvP')
        game.setPlayer('human','x', xName)
        game.setPlayer('human','o', oName)
    }

    const move = function() {
        let matchType = game.getMatchType()
        let player = game.getPlayer()

        if (matchType == 'PvC' && player.type == 'human') {
            movePrompt = `Your turn. Click an empty square to place move.`
        } else if (matchType == 'PvC' && player.type == 'computer') {
            movePrompt = `Computer's turn. Please wait...`
        } else {
            movePrompt = `${player.name}'s turn. Click an empty square to place move.`
        }
    
        document.getElementById("prompt").innerHTML = movePrompt;
    }
    
    const winGame = function(name) {
        let matchType = game.getMatchType()
        let player = game.getPlayer()

        if (matchType == 'PvC' && player.type == 'human'){
            winPrompt = `You are the winner!!!`
        } else if (matchType == 'PvC' && player.type == 'computer') {
            winPrompt = `The Computer wins!!!`
        } else {
            winPrompt = `${player.name} is the winner!!!`
        }

        document.getElementById("prompt").innerHTML = winPrompt
    }
    
    const tieGame = function() {
        tiePrompt = `Game is a draw`
        document.getElementById("prompt").innerHTML = tiePrompt
    }

    return { move, winGame, tieGame, setupSequence }
})();

const animations = (function () {
    const setHighlight = function() {
        let squares = document.getElementsByClassName("square")

        for (let i = 0; i < squares.length; i++) {
            highlightListen(squares.item(i))
        }    
    }

    const highlightListen = function(square) {
        square.addEventListener('mouseenter', addHighlight)
        square.addEventListener('mouseout', removeHighlight)
    }

    const addHighlight = function(event) {
        event.target.classList.add("highlight")
    }

    const removeHighlight = function(event) {
        event.target.classList.remove("highlight")
    }

    return { setHighlight }
})();


module.exports = board
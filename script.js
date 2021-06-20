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
                animation.win(combo);
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

        animation.setHighlight();
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

    const refreshListen = function() {
        let refreshBtn = document.getElementById("refresh-button")
        refreshBtn.addEventListener('mouseup', refresh) 
    }

    const refresh = function(bool) {
        location.reload()
    }

    const play = function() {
        prompts.setupSequence()
        .then(() => {
            prompts.move()
            refreshListen()
            getPlayer().type == 'human' ? humanTurn() : computerTurn()
        })
    }

    return { play, getPlayer, setPlayer, setMatchType, getMatchType }

})();

const prompts = (function() {
    const setupSequence = function() {
        return new Promise(function (resolve) {
            gameModeSelection()
            .then((type) => enterMatchInfo(type))
            .then(() => resolve())        
        })
    }

    const gameModeSelection = function() {
        return new Promise(function(resolve) {
            let singlePlyrBtn = document.getElementById("1-player-button")
            let twoPlyrBtn = document.getElementById("2-player-button")
        
            singlePlyrBtn.addEventListener('mouseup', () => {
                animation.gameModeFadeOut().then(() => resolve(1))
            })
            twoPlyrBtn.addEventListener('mouseup', () => {
                animation.gameModeFadeOut().then(() => resolve(2))
            })
        })
    }

    const enterMatchInfo = function(type) {
        return new Promise(function(resolve) {
            if (type == 1) {
                animation.singlePlayerInfoFadeIn()
                .then(() => enterSinglePlayerInfo())
                .then(() => animation.setupFadeOut())
                .then(() => animation.boardFadeIn())
                .then(() => resolve())
            } else {
                animation.twoPlayerInfoFadeIn()
                .then(() => enterTwoPlayerInfo())
                .then(() => animation.setupFadeOut())
                .then(() => animation.boardFadeIn())
                .then(() => resolve())
            }
        })
    }

    const enterSinglePlayerInfo = function() {
        return new Promise(function (resolve) {
            let xButton = document.getElementById("x-marker-button")
            let oButton = document.getElementById("o-marker-button")
            let selected = "lightslategrey"
            let deselected = "white"
            xButton.style.backgroundColor = selected
        
            xButton.addEventListener('click', () => {
                xButton.style.backgroundColor = selected
                oButton.style.backgroundColor = deselected
            })
            oButton.addEventListener('click', () => {
                xButton.style.backgroundColor = deselected
                oButton.style.backgroundColor = selected
            })
    
            let enterBtn = document.getElementById("enter-marker-button")
            enterBtn.addEventListener('click', () => {
                if (xButton.style.backgroundColor == selected) {
                    createPvCPlayers('x')
                } else {
                    createPvCPlayers('o')
                }
                resolve()
            })
        })
    }
    
    const enterTwoPlayerInfo = function() {
        return new Promise(function(resolve) {
            let playBtn = document.getElementById("enter-names-button")
            playBtn.addEventListener('click', () => {
                createPvPPlayers()
                resolve()
            })
        })
    }

    const createPvCPlayers = function(marker) {
        let pMarker = marker
        let cMarker;
        pMarker == 'x' ? cMarker = 'o' : cMarker = 'x'

        game.setMatchType('PvC')
        game.setPlayer('human', pMarker, 'Human')
        game.setPlayer('computer', cMarker, 'Computer')
    }

    const createPvPPlayers = function() {
        p1Name = document.getElementById("p1name").value
        p2Name = document.getElementById("p2name").value

        if (p1Name == '') {p1Name = 'Player 1'}
        if (p2Name == '') {p2Name = 'Player 2'}

        game.setMatchType('PvP')
        game.setPlayer('human','x', p1Name)
        game.setPlayer('human','o', p2Name)

        document.getElementById("p1name").value = ''
        document.getElementById("p2name").value = ''
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

const animation = (function() {
    const gameModeFadeOut = function() {
        return new Promise(function(resolve) {
            let formBox = document.getElementById("flex-container")
            let fadeOut = "fade-in 0.5s ease-in 0s 1 reverse forwards"
            formBox.style.animation = fadeOut
        
            setTimeout(() => {
                let buttonDiv = document.getElementById("game-mode-button-div")
                buttonDiv.style.display = "none"
                resolve()
            }, 500)
        })
    }
    
    const singlePlayerInfoFadeIn = function() {
        return new Promise(function(resolve) {
            let buttonDiv = document.getElementById("marker-button-div")
            buttonDiv.style.display = "flex"
    
            let instructionText = document.getElementById("instruction-text")
            instructionText.innerHTML = "Select Your Marker:"
    
            let formBox = document.getElementById("flex-container")
            let fadeIn = "fade-in 0.75s ease-out 0s 1 normal forwards"
            formBox.style.animation = fadeIn
    
            resolve()
        })
    }
    
    const twoPlayerInfoFadeIn = function() {
        return new Promise(function(resolve) {
            let buttonDiv = document.getElementById("marker-button-div")
            buttonDiv.style.display = "none"
    
            let inputDiv = document.getElementById("player-names-div")
            inputDiv.style.display = "flex"
    
            let instructionText = document.getElementById("instruction-text")
            instructionText.innerHTML = "Enter Player Names:"
    
            let formBox = document.getElementById("flex-container")
            let fadeIn = "fade-in 0.75s ease-out 0s 1 normal forwards"
            formBox.style.animation = fadeIn
    
            resolve()
        })
    }

    const setupFadeOut = function() {
        return new Promise(function(resolve) {
            let body = document.getElementById("grid-container")
            body.style.transition = "all 0.75s"
            body.style.opacity = 0

            let title = document.getElementById("title")
            let container = document.getElementById("flex-container")
            setTimeout(() => {
                title.style.display = "none"
                container.style.display = "none"
                resolve()
            }, 750)
        })
    }

    const boardFadeIn = function() {
        return new Promise(function(resolve) {
            let body = document.getElementById("grid-container")
            body.style.transition = "all 0s"
            body.style.opacity = 100

            let board = document.getElementById("board")
            board.style.display = "grid"

            let squares = document.getElementsByClassName("square")
            let fadeIn = "fade-in 0.75s ease-out 0s 1 normal forwards"
            for (let i = 0; i < squares.length; i++) {
                squares[i].style.animation = fadeIn
            }

            let promptDiv = document.getElementById("prompt-div")
            promptDiv.style.display = "flex"
            promptDiv.style.animation = fadeIn

            setTimeout(() => resolve(), 750)
        })
    }

    const setHighlight = function() {
        let squares = document.getElementsByClassName("square")

        for (let i = 0; i < squares.length; i++) {
            let square = squares.item(i)
            if (square.innerHTML == "") {
                highlightListen(square)
            } else {
                endHighlightListen(square)
            }
        }    
    }

    const highlightListen = function(square) {
        square.addEventListener('mouseenter', addHighlight)
        square.addEventListener('mouseout', removeHighlight)
    }

    const endHighlightListen = function(square) {
        square.removeEventListener('mouseenter', addHighlight)
    }

    const addHighlight = function(event) {
        event.target.classList.add("highlight")
    }

    const removeHighlight = function(event) {
        event.target.classList.remove("highlight")
    }

    const win = function(squaresArray) { 
        squaresArray.forEach(squareNumber => {
            square = "square" + squareNumber
            document.getElementById(square).classList.add("green")
        });
    }

    return { 
        gameModeFadeOut, singlePlayerInfoFadeIn, twoPlayerInfoFadeIn, setupFadeOut, boardFadeIn, setHighlight, win 
    }
})();

game.play();

//for testing
module.exports = board
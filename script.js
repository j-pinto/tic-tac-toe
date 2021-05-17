// factory functions for board and game
// used in module pattern (wrapped in IIFE) since only used once
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

    const addSquare = function(square, array) { 
        return array.push(square) 
    }

    const inputValid = function(marker, input) {
        if (badFormat(marker, input)) {
            return false
        } 

        let array = getPlayerArray(marker);
        if ( squareOccupied(input) ) {
            return false;
        } else {
            addSquare(input, array);
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

    return { inputValid, refresh, win }
})();

const game = (function () {
    let turnCount = 0;
    
    const getPlayer = function(turnCount) {
        if (turnCount % 2 == 0) {
            return 'x'
        } else {
            return 'o'
        }
    }

    const mouseListen = function () {
        let squares = document.getElementsByClassName("square")
        for (i = 0; i < squares.length; i++) {
            squares.item(i).addEventListener( 'click', executeMove )
        }
    }

    const endMouseListen = function() {
        let squares = document.getElementsByClassName("square")
        for (i = 0; i < squares.length; i++) {
            squares.item(i).removeEventListener( 'click', executeMove )
        }
    }

    const executeMove = function (event) {
        marker = getPlayer(turnCount)
        squareNumber = parseInt(event.target.id.slice(-1))
    
        if (board.inputValid(marker, squareNumber)) {
            console.log("valid")
            nextTurn();
        } else {
            console.log("invalid")
        }
    }

    const nextTurn = function() {
        board.refresh();
        marker = getPlayer(turnCount)

        if ( board.win(marker) ) {
            endMouseListen();
            winGame(marker);
        } else {
            turnCount++;
            document.getElementById("prompt").innerHTML = movePrompt();
        }
    }

    const winGame = function(marker) {
        marker = marker.toUpperCase()
        winPrompt = `${marker} is the winner!!!`
        document.getElementById("prompt").innerHTML = winPrompt
    }

    const movePrompt = function() {
        if (turnCount % 2 == 0) {
            return "X's turn. Click an empty square to place move"
        } else {
            return "O's turn. Click an empty square to place move"
        }
    }

    const play = function() {
        document.getElementById("prompt").innerHTML = movePrompt();
        mouseListen();
    }

    return { play }

})();

module.exports = board
// factory functions for board and game
// used in module pattern (wrapped in IIFE) since only used once
const board = (function () {
    let xArray = [];
    let oArray = [];

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
            refresh();
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

    return { inputValid }
})();

const game = (function () {
    let turnCount = 0;
    
    /*turn
    - turn count even/odd determines X/O turn
    - activate click event listener
    - only activate listeners for empty squares 
    - move = player marker with clicked square number
    - pass move to board.inputValid, should be added
    - display markers on board
    - determine if win/tie
    - next turn 
    */

    const getPlayer = function(turnCount) {
        if (turnCount % 2 == 0) {
            return 'x'
        } else {
            return 'o'
        }
    }

    const mouseListen = function () {
        //only set event listeners for empty squares

        let squares = document.getElementsByClassName("square")
        for (i = 0; i < squares.length; i++) {
            if (squares.item(i).innerHTML == "") {
                squares.item(i).addEventListener('click', function(e) {
                    executeMove(e.target)
                })
            }
        }
    }

    const executeMove = function (target) {
        marker = getPlayer(turnCount)
        squareNumber = parseInt(target.id.slice(-1))
    
        if (board.inputValid(marker, squareNumber)) {
            console.log("valid")
            turnCount++;
        } else {
            console.log("invalid")
        }
    }

    return { mouseListen }

})();

module.exports = board
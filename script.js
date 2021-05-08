// factory function for board
// used in module pattern (wrapped in IIFE) since only used once
const board = (function () {
    let xArray = [];
    let oArray = [];

    const squareOccupied = function(square) {
        let x = board.xArray;
            o = board.oArray; 
        if ( x.includes(square) || o.includes(square) ) {
            return true
        } else {
            return false
        }
    }

    const getPlayerArray = function(marker) {
        array = marker == 'x' ? board.xArray : board.oArray
        return array
    }

    const addSquare = function(square, array) { return array.push(square) }

    const inputValid = function(playerMarker, input) {
        let array = getPlayerArray(playerMarker);

        if ( squareOccupied(input) ) {
            return false;
        } else {
            addSquare(input, array);
            return true;
        }
    }

    return { xArray, oArray, getPlayerArray, squareOccupied, addSquare, inputValid }
})();

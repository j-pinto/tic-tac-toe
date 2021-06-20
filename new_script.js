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
            singlePlyrBtn = document.getElementById("1-player-button")
            twoPlyrBtn = document.getElementById("2-player-button")
        
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
            xButton = document.getElementById("x-marker-button")
            oButton = document.getElementById("o-marker-button")
            selected = "lightslategrey"
            deselected = "white"
            xButton.style.backgroundColor = selected
        
            xButton.addEventListener('click', () => {
                xButton.style.backgroundColor = selected
                oButton.style.backgroundColor = deselected
            })
            oButton.addEventListener('click', () => {
                xButton.style.backgroundColor = deselected
                oButton.style.backgroundColor = selected
            })
    
            enterBtn = document.getElementById("enter-marker-button")
            enterBtn.addEventListener('click', () => {
                if (xButton.style.backgroundColor == selected) {
                    //createPvCPlayers('x')
                } else {
                    //createPvCPlayers('o')
                }
                resolve()
            })
        })
    }
    
    const enterTwoPlayerInfo = function() {
        return new Promise(function(resolve) {
            p1Name = document.getElementById("p1Name")
            p2Name = document.getElementById("p2Name")
            playBtn = document.getElementById("enter-names-button")
    
            playBtn.addEventListener('click', () => {
                //createPvPPlayers(p1Name.value, p2Name.value)
                resolve()
            })
        })
    }

    return { setupSequence }
})();

const animation = (function() {
    const gameModeFadeOut = function() {
        return new Promise(function(resolve) {
            formBox = document.getElementById("flex-container")
            fadeOut = "fade-in 0.5s ease-in 0s 1 reverse forwards"
            formBox.style.animation = fadeOut
        
            setTimeout(() => {
                buttonDiv = document.getElementById("game-mode-button-div")
                buttonDiv.style.display = "none"
                resolve()
            }, 500)
        })
    }
    
    const singlePlayerInfoFadeIn = function() {
        return new Promise(function(resolve) {
            buttonDiv = document.getElementById("marker-button-div")
            buttonDiv.style.display = "flex"
    
            instructionText = document.getElementById("instruction-text")
            instructionText.innerHTML = "Select Your Marker:"
    
            formBox = document.getElementById("flex-container")
            fadeIn = "fade-in 0.75s ease-out 0s 1 normal forwards"
            formBox.style.animation = fadeIn
    
            resolve()
        })
    }
    
    const twoPlayerInfoFadeIn = function() {
        return new Promise(function(resolve) {
            buttonDiv = document.getElementById("marker-button-div")
            buttonDiv.style.display = "none"
    
            inputDiv = document.getElementById("player-names-div")
            inputDiv.style.display = "flex"
    
            instructionText = document.getElementById("instruction-text")
            instructionText.innerHTML = "Enter Player Names:"
    
            formBox = document.getElementById("flex-container")
            fadeIn = "fade-in 0.75s ease-out 0s 1 normal forwards"
            formBox.style.animation = fadeIn
    
            resolve()
        })
    }

    const setupFadeOut = function() {
        return new Promise(function(resolve) {
            body = document.getElementById("grid-container")
            body.style.transition = "all 0.75s"
            body.style.opacity = 0

            title = document.getElementById("title")
            container = document.getElementById("flex-container")
            setTimeout(() => {
                title.style.display = "none"
                container.style.display = "none"
                resolve()
            }, 750)
        })
    }

    const boardFadeIn = function() {
        return new Promise(function(resolve) {
            body = document.getElementById("grid-container")
            body.style.transition = "all 0s"
            body.style.opacity = 100

            board = document.getElementById("board")
            board.style.display = "grid"

            squares = document.getElementsByClassName("square")
            fadeIn = "fade-in 0.75s ease-out 0s 1 normal forwards"
            for (let i = 0; i < squares.length; i++) {
                squares[i].style.animation = fadeIn
            }

            promptDiv = document.getElementById("prompt-div")
            promptDiv.style.display = "flex"
            promptDiv.style.animation = fadeIn

            setTimeout(() => resolve(), 750)
        })
    }

    return { 
        gameModeFadeOut, singlePlayerInfoFadeIn, twoPlayerInfoFadeIn, setupFadeOut, boardFadeIn 
    }
})();

prompts.setupSequence()
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
            let p1Name = document.getElementById("p1Name")
            let p2Name = document.getElementById("p2Name")
            let playBtn = document.getElementById("enter-names-button")
    
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

    return { 
        gameModeFadeOut, singlePlayerInfoFadeIn, twoPlayerInfoFadeIn, setupFadeOut, boardFadeIn 
    }
})();

prompts.setupSequence()
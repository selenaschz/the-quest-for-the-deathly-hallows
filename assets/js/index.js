window.addEventListener("load", () => {
    changeColor();

    //-- Main Menu --
    const menu = document.getElementById("main-menu");
    const gameTitle = document.getElementById("game-title");

    //--Game container--
    const gameScreen = document.getElementById("canvas-game");

    //-- Menu Options:--
    const storyBt = document.getElementById("story-bt");
    const instructionsBt = document.getElementById("instructions-bt");
    const startTestBt = document.getElementById("start-test-bt");
    const scoresBt = document.getElementById("scores-bt");

    //--Game Story--
    const story = document.getElementById("game-story");
    const closeBts = document.querySelectorAll(".close-bt");

    //--Instructions--
    const instructions = document.getElementById("instructions");
    
    //-- House Test --
    const houseTest = document.getElementById("house-test");
    const braveryBt = document.getElementById("bravery");
    const lealtyBt = document.getElementById("loyalty");
    const intelligenceBt = document.getElementById("intelligence");
    const ambitionBt = document.getElementById("ambition");

    //-- Scores --
    const scores = document.getElementById("scores");

    //-- Event Listeners --
    //Go to the game story screen:
    storyBt.addEventListener("click", () => {
        showSelectedOption(story);
    })

    //Go to the instructions screen:
    instructionsBt.addEventListener("click", () => {
        showSelectedOption(instructions);
    })

    //Go to the house test screen:
    startTestBt.addEventListener("click", () => {
        showSelectedOption(houseTest);
    })
    
    //Go to the Scores:
    scoresBt.addEventListener("click", () => {
        showSelectedOption(scores);
        displayScores();

    })


    //Return to the main menu:
    closeBts.forEach(button => {
        button.addEventListener("click", () => {
            story.classList.add("hidden");
            instructions.classList.add("hidden");
            houseTest.classList.add("hidden");
            scores.classList.add("hidden");
            menu.classList.remove("hidden");
        })
    });

    //Variable to store the chosen house
    let house;
    const houseAudio = new Audio();

    //Event Listeners to select the Hogwarts house
    braveryBt.addEventListener("click", () => {
        house = "gryffindor";
        playHouseSound(house);
        startGame(house);
    })

    lealtyBt.addEventListener("click", () => {
        house = "hufflepuff";
        playHouseSound(house);
        startGame(house);
    })

    intelligenceBt.addEventListener("click", () => {
        house = "ravenclaw";
        playHouseSound(house);
        startGame(house);
    })

    ambitionBt.addEventListener("click", () => {
        house = "slytherin";
        playHouseSound(house);
        startGame(house);
    })

    //Function that plays sound of the house
    function playHouseSound(house){
        houseAudio.src = `assets/audio/houses/${house}.mp3`;
        houseAudio.play();
    }

    //Display Scores:
    function displayScores() {
        const scoresList = document.getElementById("scores-list");

        //Clear list:
        scoresList.innerHTML = '';

        //Get the localStorage:
        const scoresGame = localStorage.getItem("scores") ? JSON.parse(localStorage.getItem("scores")) : [];
    
        let scoreCounter = 1;
        if ( scoresGame.length > 0 ) {
            scoresGame.forEach( score => {
                const li = document.createElement("li");
                
                li.textContent = `${scoreCounter} | ${score.isWinner ? "VICTORY" : "DEFEAT"} | ${score.name} | ${score.points} pts`; //Add the player name and their score
                scoresList.appendChild(li);
                scoreCounter++;
            });
        } else {
            const noScores = document.createElement("li");
            noScores.textContent = "There are no scores yet.";
            scoresList.appendChild(noScores);
        }
    }

    function showSelectedOption(option) {
        menu.classList.add("hidden");
        option.classList.remove("hidden");
    }

    //Function Start Game
    function startGame(house) {
        const game = new Game("canvas-game", house);
        houseTest.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        game.start(); //Start the game

        document.addEventListener("keydown", event => {
            game.onKeyEvent(event);
        } );
    
        document.addEventListener("keyup", event => {
            game.onKeyEvent(event);
        })
    }

    //Function: Change h1 color
    function changeColor() {
        setInterval(() => {
            gameTitle.classList.toggle("navy-blue");
        }, 1000)
        
    }
    
})
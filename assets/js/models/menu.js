class Menu {
    constructor() {
        //-- Main Menu --
        this.menu = document.getElementById("main-menu");

        //-- Game container--
        this.gameScreen = document.getElementById("canvas-game");

        //--Menu Screens--
        this.gameStory = document.getElementById("game-story");
        this.instructions = document.getElementById("instructions");
        this.houseTest = document.getElementById("house-test");
        this.scores = document.getElementById("scores");

        //--Buttons--
        this.storyBt = document.getElementById("story-bt");
        this.instructionsBt = document.getElementById("instructions-bt");
        this.startTestBt = document.getElementById("start-test-bt");
        this.scoresBt = document.getElementById("scores-bt");

        // Close button
        this.closeBts = document.querySelectorAll(".close-bt");

        //--Hogwarts House Buttons--
        this.houseBts = [
            { name: "gryffindor", 
              button: document.getElementById("bravery") 
            },

            { name: "hufflepuff", 
              button: document.getElementById("loyalty") 
            },

            { name: "ravenclaw", 
              button: document.getElementById("intelligence") 
            },

            { name: "slytherin", 
              button: document.getElementById("ambition") 
            }
        ];

        this.houseAudio = new Audio();
    }

    //--Add event Listeners--
    addEventListeners() {
        //Menu options:
        this.storyBt.addEventListener("click", () => {
            this.showSelectedOption( this.gameStory );
        })

        this.instructionsBt.addEventListener("click", () => {
            this.showSelectedOption( this.instructions );
        })

        this.startTestBt.addEventListener("click", () => {
            this.showSelectedOption( this.houseTest );
        })

        this.scoresBt.addEventListener("click", () => {
            this.showSelectedOption( this.scores );
            this.displayScores();

        })

        // Close buttons:
        this.closeBts.forEach(button => {
            button.addEventListener("click", () => {
                this.backToMenu();
            })
        });

        //House options:
        this.houseBts.forEach(house => {
            house.button.addEventListener("click", () => this.onHouseSelection( house.name ));
        });
        
    }

    //--Show Screen--
    showSelectedOption(option) {
        this.menu.classList.add("hidden");
        option.classList.remove("hidden");
    }

    backToMenu() {
        const screens = [this.gameStory, this.instructions, this.houseTest, this.scores];
        
        screens.forEach( screen => {
            screen.classList.add("hidden");
            this.menu.classList.remove("hidden");
        })
    }

    //--Select house, play sound and start game:
    onHouseSelection(house) {
        this.playHouseSound(house);
        this.startGame(house);
    }

    //--Display Scores:---
    displayScores() {
        const scoresList = document.getElementById("scores-list");

        //Clear list:
        scoresList.innerHTML = '';

        //Get the localStorage:
        const scoresGame = localStorage.getItem("scores") ? JSON.parse(localStorage.getItem("scores")) : [];
    
        let scoreCounter = 1;
        if ( scoresGame.length > 0 ) {
            scoresGame.forEach( score => {
                const li = document.createElement("li");
                
                li.textContent = `🏆${scoreCounter}# | ${score.isWinner ? "🧙" : "💀"} | ${score.name} 🎮 | ${score.points} pts✨`; //Add the player name and their score
                scoresList.appendChild(li);
                scoreCounter++;
            });
        } else {
            const noScores = document.createElement("li");
            noScores.textContent = "There are no scores yet.";
            scoresList.appendChild(noScores);
        }
    }

    //--Play sound of the house
    playHouseSound(house){
        this.houseAudio.src = `assets/audio/houses/${house}.mp3`;
        this.houseAudio.play();
    }

    //--Start Game--
    startGame(house) {
        const game = new Game("canvas-game", house);
        this.houseTest.classList.add("hidden");
        this.gameScreen.classList.remove("hidden");
        
        game.start(); //Start the game

        document.addEventListener("keydown", event => {
            game.onKeyEvent(event);
        } );
    
        document.addEventListener("keyup", event => {
            game.onKeyEvent(event);
        })
    }

}


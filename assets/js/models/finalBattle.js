class FinalBattle {
    constructor( ctx, game) {
        this.ctx = ctx;
        this.game = game;

        //Img of the player in battle:
        this.playerImg = new Image();
        this.playerImg.src = "assets/images/player/playerBattle.png"
        this.playerImg.onload = () => {
            this.isLoaded = true;
        }

        //Player:
        this.player = new Player(this.ctx, this.game.player.house);
        this.player.x = this.ctx.canvas.width / 4;
        this.player.y = this.ctx.canvas.height - 200;

        //Voldemort
        this.voldemort = new Voldemort(this.ctx);

        this.started = false;
        this.drawInterval = undefined;
        this.background = new Background (this.ctx, "finalbattle");
        this.background.setImage("finalbattle");

        //Spells:
        this.xSpellPlayer = this.player.x + 112;
        this.spellPlayer = new Spell(this.ctx, this.xSpellPlayer, this.player.y, true, this.player.house)
        this.xSpellVoldemort = this.voldemort.x - 55;
        this.spellVoldemort = new Spell(this.ctx, this.xSpellVoldemort, this.voldemort.y, false, "slytherin");
        this.spellPlayer.width = 300;

        //The player has won or not:
        this.isWin = false;
        this.isGameOver = false;

        //Elder wand:
        this.elderWand = new ElderWand(this.ctx);

        //Spell phrases:
        this.spells = [
            "EXPELLIARMUS",
            "EXPECTO PATRONUM",
            "PROTEGO",
            "PROTEGO MAXIMA",
            "SECTUMSEMPRA",
            "FINITE INCANTATEM",
            "IMPEDIMENTA",
            "STUPEFY",
            "RIDDIKULUS",
            "OBSCURO",
            "INCARCEROUS",
            "LEVICORPUS",
            "REDUCTO",
            "GLACIUS",
            "REPELLO INIMICUM",
            "SALVIO HEXIA",
            "CONFRINGO",
            "EBUBLIO",
            "FIENDFYRE",
            "SERPENSORTIA",
            "DIFFINDO",
            "BOMBARDA",
            "ENTOMORPHIS",
            "DEFODIO",
            "MOBILICORPUS",
          ];

        //Random spell (The player will have to type it)
        this.randomSpellPhrase = "";
        this.indexChar = 0;

        //Max time to type the random spell:
        this.maxTimeToType = 7;
        //Elapsed time:
        this.elapsedTime = 0;
        this.timeInterval = undefined;

        //Store what the player has written:
        this.typedSpell = "";
        //Correctly written spell phrases:
        this.correctSpells = 0;
        //The player have to type 3 spells correctly to win:
        this.spellsToWin = 3;

        this.audio = new Audio("assets/audio/levels/final-battle.mp3");
        this.audio.volume = 0.03;
        this.isMute = false;
    }

    //--Start the final battle:--
    start() {
        this.started = true;

        this.audio.play();
        this.spellPlayer.audio.pause();
        this.spellVoldemort.audio.pause();

        //Start timer:
        if ( this.voldemort.isAlive ) {
            this.getRandomSpellPhrase();
            this.updateElapsedTime();
            this.onKeyPress();
            
        }

        //Final battle Interval:
        if (!this.drawInterval) {
            this.drawInterval = setInterval(() => {
                this.clear();
                this.draw();
                this.move();
            }, this.fps);
        }

    }

    //--Clear--
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    //--Move--
    move() {
        if ( this.correctSpells === this.spellsToWin && this.voldemort.isAlive ) {
            this.spellPlayer.move();
        }

        if(this.voldemort.isAlive ) {
            this.killVoldemort();

        }
        if ( !this.voldemort.isAlive ) {
            this.elderWand.move();
            this.player.move();
        }
    }

    //--DRAW--
    draw() {
        
        this.background.draw();

        this.drawGameElements();
        this.drawGameStatus();
        this.drawSpellPhrases();

        this.gameOver();
        this.win();        
    }

    drawGameElements() {
        if ( this.correctSpells !== this.spellsToWin ) {
            this.voldemort.draw();
            this.spellVoldemort.draw();
            if ( this.isLoaded ) {
                this.ctx.drawImage(
                    this.playerImg,
                    this.player.x,
                    this.ctx.canvas.height - 205
                 )
            }
        } else {
            this.player.draw();
            this.elderWand.draw();
        }

        if ( this.voldemort.isAlive ) {
            this.spellPlayer.draw();
        }
    }

    drawGameStatus() {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "50px 'Harry Potter'";

        //Level:
        this.ctx.fillText(`Level: ${this.game.level}`, this.ctx.canvas.width / 2 - 30, 60)

        //Time:
        this.ctx.fillText(`Time: ${this.elapsedTime}`, 100, this.ctx.canvas.height - 40)

        //Deathly Hallows Collected:
        this.game.imgDeathlyHallows.src = `assets/images/game/${this.game.deathlyHallowsImgStatus}Collected.png`;
        this.ctx.drawImage(
            this.game.imgDeathlyHallows,
            this.ctx.canvas.width - this.game.imgDeathlyHallows.width / 2 -10,
            10,
            this.game.imgDeathlyHallows.width / 2,
            this.game.imgDeathlyHallows.height / 2
        )

        this.ctx.textAlign = "start";
    }

    drawSpellPhrases() {
        //Spell:
        const spellWidth = this.ctx.measureText(this.randomSpellPhrase).width; //Calculate the width of a Spell phrase

        if ( this.voldemort.isAlive ) {
            this.ctx.fillText(this.randomSpellPhrase, this.ctx.canvas.width / 2 - spellWidth / 2, this.ctx.canvas.height / 2);

            //Change color char when it type
            this.ctx.fillStyle = "#b39161";
            this.ctx.fillText(this.typedSpell, this.ctx.canvas.width / 2 - spellWidth / 2, this.ctx.canvas.height / 2);
        }
    }

    //--Get random spell phrases--
    getRandomSpellPhrase() {
        //Get random index:
        const randomIndex = Math.floor( Math.random() * this.spells.length );

        //Get random spell phrase from the array:
        this.randomSpellPhrase = this.spells[ randomIndex ];

        //Remove that spell from the array:
        this.spells = this.spells.filter( spell => spell !== this.randomSpellPhrase );
    }

    //--Game over:--
    gameOver() {
        if ( this.elapsedTime >= this.maxTimeToType && !this.isGameOver ) {
            this.stopElapsedTime();
            
            this.isGameOver = true;
            this.stop();
            this.started = false;
            this.game.gameOver();
            this.game.setEndScreen("game-over");
        } 
    }

    //--Win--
    win() {

        if ( this.player.collides(this.elderWand) ) {
            if ( !this.elderWand.playedAudio ) {
                this.audio.pause();
                this.elderWand.audio.play();
                this.elderWand.playedAudio = true;
            }
            this.elderWand.vx = 0;
            //Changes the elder wand image to the 3 deathly hallows (because the player has already collected them all):
            this.elderWand.image.src = "assets/images/favicon.png";
            this.game.deathlyHallowsImgStatus = "three";
            
                this.isWin = true;
                if ( !this.timeOut ) {
                    this.timeOut = setTimeout(() => {
                        this.game.win();
                        this.restartSettings();
                    }, 1000);
                }
        }
     }

     //--Restar settings--
    restartSettings() {
        this.removeKeyEvent();
        this.audio.pause();
        this.elderWand.audio.pause();
        this.elderWand.playedAudio = false;
        this.elderWand.x = this.ctx.canvas.width - 350;
        this.voldemort.x = this.ctx.canvas.width - 350;
        this.spellPlayer.x = this.player.x + 112;
        this.voldemort.isAlive = true;
        clearInterval(this.timeInterval);
        clearInterval(this.drawInterval);
        clearInterval(this.timeOut);
        this.timeOut = null;
        this.clear();
        this.stopElapsedTime();
        this.stop();
        this.timeInterval = undefined;
        this.drawInterval = undefined;
        this.elapsedTime = 0;
        this.elderWand.isCollected = false;
        this.started = false;
        this.audio.currentTime = 0;
        this.correctSpells = 0;
        this.indexChar = 0;
        this.elderWand.vx = -2;
    }

    //--Update Elapsed time:--
    updateElapsedTime() {
        this.timeInterval = setInterval(() => {
            this.elapsedTime +=1;
        }, 1000);
    }

    //--Stop elapsed time--
    stopElapsedTime (){
        clearInterval(this.timeInterval);
    }

    //--Kill voldemort--
    killVoldemort() {
        if ( this.spellPlayer.collides(this.voldemort) ) {
            this.voldemort.isAlive = false;
            this.elderWand.draw();
            clearInterval(this.timeInterval);
        }
    }


    //New Event Listener (Typed Letters)
    onKeyPress() {
        this.keyDownEvent = (event) => {
            //Store pressed letter:
            const pressedLetter = event.key.toUpperCase();
            //Get the first char from the random spell phrase:
            const char = this.randomSpellPhrase[this.indexChar];

                //If the player has pressed the correct letter:
                if ( pressedLetter === char ) {
                    //Store that letter on typedSpell:
                    this.typedSpell += pressedLetter;
                    this.indexChar++; //Next char
                    //If the typed phrase is the same as the spell phrase (the same length)
                    if ( this.indexChar === this.randomSpellPhrase.length ) {
                        this.correctSpells++; //Spell type correctly
                        this.elapsedTime = 0; //Reset the elapsed time
                        this.getRandomSpellPhrase(); //New spell phrase
                         //Reset typed spell, indexChar and elapsedTime:
                        this.typedSpell = "";
                        this.indexChar = 0;
                        this.game.score += 600;
                    }
                
                }
        }
        document.addEventListener("keydown", this.keyDownEvent);
    }

    //Remove event listener
    removeKeyEvent() {
        document.removeEventListener("keydown", this.keyDownEvent);
    }

    //Stop the final battle:
    stop() {
        this.started = false;
        this.removeKeyEvent();
        this.audio.pause();
        clearInterval(this.drawInterval);
        clearInterval(this.timeInterval);
        clearTimeout(this.timeOut);
    }

}

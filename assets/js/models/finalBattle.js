class FinalBattle {
    constructor( ctx, game) {
        this.ctx = ctx;
        this.game = game;

        //Player:
        this.player = new Player(this.ctx, this.game.player.house);
        this.player.x = this.ctx.canvas.width / 4;
        this.player.y = this.ctx.canvas.height - 200;
        this.player.spell = new Spell(this.ctx, this.player.x + this.player.width, this.player.y, true, this.player.house);
        this.player.spell.isActive = true; //Activate spell of the player

        this.voldemort = new Voldemort(this.ctx);
        this.started = false;
        this.drawInterval = undefined;
        this.background = new Background (this.ctx, "finalBattle");

        //The player has won or not:
        this.isWin = false;
        this.isGameOver = false;

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
            "AVADA KEDAVRA",
            "CRUCIO",
            "IMPERIO",
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

        //Maxime to type the random spell:
        this.maxTimeToType = 5;
        //Elapsed time:
        this.elapsedTime = 0;

        //Store what the player has written:
        this.typedSpell = "";
        //Correctly written spell phrases:
        this.correctSpells = 0;
        //The player have to type 6 spells correctly to win:
        this.spellsToWin = 6;

        //Disable player actions:
        this.player.actionsEnabled= false;
        
    }

    //Start the final battle:
    start() {
        this.started = true;

        this.getRandomSpellPhrase();

        this.onKeyPress();

        //Final battle Interval:
        if (!this.drawInterval) {
            this.drawInterval = setInterval(() => {
                this.clear();
                this.draw();
                
            }, this.fps);
        }

    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw() {
        this.background.draw();
        this.player.draw();
        this.player.spell.draw();
        // this.voldemort.draw();
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "50px serif";

        //Level:
        this.ctx.fillText(`Level: ${this.game.level}`, this.ctx.canvas.width / 2, 30)

        //Time:
        this.ctx.fillText(`Time: ${this.elapsedTime}`, 10, this.ctx.canvas.height - 20)

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
        //Spell:
        const spellWidth = this.ctx.measureText(this.randomSpellPhrase).width; //Calculate the width of a Spell phrase
        this.ctx.fillText(this.randomSpellPhrase, this.ctx.canvas.width / 2 - spellWidth / 2, this.ctx.canvas.height / 2);

        //Change color char when it type
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.typedSpell, this.ctx.canvas.width / 2 - spellWidth / 2, this.ctx.canvas.height / 2);

        this.gameOver();
        this.win();        
    }

    //Get random 
    getRandomSpellPhrase() {
        //Get random index:
        const randomIndex = Math.floor( Math.random() * this.spells.length );

        //Get random spell phrase from the array:
        this.randomSpellPhrase = this.spells[ randomIndex ];

        //Start timer:
        this.updateElapsedTime();

        //Remove that spell from the array:
        this.spells = this.spells.filter( spell => spell !== this.randomSpellPhrase );
    }

    //Game over:
    gameOver() {
        if ( this.elapsedTime >= this.maxTimeToType && !this.isGameOver ) {
            this.stopElapsedTime();
            
            this.isGameOver = true;
            this.game.gameOver();
            this.game.setEndScreen("game-over");
            this.stop();
            this.game.restartSettings();
        } 
    }

    //Elapsed time:
    updateElapsedTime() {
        this.interval = setInterval(() => {
            this.elapsedTime++;
        }, 1000);
    }

    stopElapsedTime (){
        clearInterval(this.interval);
    }

    win() {
        if ( this.correctSpells === this.spellsToWin && !this.isWin ) {
            this.stopElapsedTime();
            this.isWin = true;
            
            this.game.win();
            this.game.setEndScreen("win");
            this.stop();
            this.game.restartSettings();
        }
    }

    onKeyPress() {
        window.addEventListener("keydown", (event) => {
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
                        this.increaseSpellPower(this.player);
                        this.getRandomSpellPhrase(); //New spell phrase
                         //Reset typed spell and indexChar:
                        this.typedSpell = "";
                        this.indexChar = 0;
                    }
                
            }
            
        })
    }

    //Increase the power of spell:
    increaseSpellPower(character){
        character.spell.width += 10;
    }

    //Stop the final battle:
    stop() {
        this.started = false;
        clearInterval(this.drawInterval);
        clearInterval(this.interval);
    }

}

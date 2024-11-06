class Game {
    constructor(canvasId, house) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = 1000;
        this.canvas.height = 533;
        this.ctx = this.canvas.getContext("2d");
        
        //Intervals:
        this.drawIntervalId = undefined;
        this.fps = 1000 / 60; //Frames per second
        this.timeInterval = undefined;

        //Elapsed time:
        this.elapsedTime = 0;

        //Hogwarts house:
        this.house = house,

        this.imgHealth = new Image();
        this.imgHealth.src = `assets/images/menu/${this.house}.png`;
        this.xImgHealth = 20;
        this.yImgHealth = 10;
        this.widthImgHealth = 30;
        this.heightImgHealth = 30;

        this.background = new Background(this.ctx, "background");

        //Characters:
        this.player = new Player( this.ctx, house );
        this.playerName;
        this.enemies = [new Enemy( this.ctx, "dementor" )];

        this.enemyTypes = ["dementor", "troll", "pixies"];
        //Add enemies every 300 ticks:
        this.enemyAddTimer = 300;

        //Score:
        this.score = 0;
        this.imgScore = new Image();
        this.imgScore.src = `assets/images/points.webp`;
        

        //Level:
        this.level = 1;
        this.timeLevel = 60;
        this.elapsedTime = 0;
        
        //Deathly hallows:
        this.resurrectionStone = new ResurrectionStone(this.ctx);
        this.invisibilityCloak = new InvisibilityCloak(this.ctx);
        this.elderWand = new ElderWand(this.ctx);
        this.deathlyHallows = [this.resurrectionStone, this.invisibilityCloak, this.elderWand];
        this.deathlyHallowsImgStatus = "not";
        this.imgDeathlyHallows = new Image();

        //Game status:
        this.started = false;
        this.paused = false;

        this.music = new Audio("assets/audio/levels/level1.mp3");
        this.music.volume = 0.03;

        //Final Battle:
        this.finalBattle = new FinalBattle(this.ctx, this);

        //Result sound (if it is playing or not)
        this.resultSound = false;

        this.chocolateFrog = new ChocolateFrog(this.ctx);
        this.displayPoints = [];
    }

    //--Start game:--
    start() {
        this.started = true;

        this.music.play();

        //Counter to add enemies:
        let tick = 0;

        this.updateElapsedTime();

        if (!this.drawIntervalId) {
            this.drawIntervalId = setInterval(() => {
                if ( !this.paused ) {
                    this.clear();
                    this.move();
                    this.draw();

                    tick++;

                    //Add an enemy every 300 ticks:
                    if ( tick >= this.enemyAddTimer ) {
                        tick = 0;
                        this.addEnemy();
                    }
                }
                
            }, this.fps)
        }
    }

    //--Win or Game over:--
    setEndScreen(result) {
        this.stop();
        this.clear();

        this.canvas.classList.add("hidden");

        if ( !this.resultSound ) {
            const audioResult = new Audio(`assets/audio/${result}.mp3`);
            audioResult.volume = 0.04;
            audioResult.play();
            this.resultSound = true;
        }

        //Win div or Game-over div:
        const resultDiv = document.getElementById("result");
        //Menu div:
        const menu = document.getElementById("main-menu");

        resultDiv.classList.remove("hidden");
        resultDiv.classList.add(result);
        document.getElementById("")

        //End screen options:
        this.askForName(resultDiv, menu);
        this.exitGame(resultDiv, menu);
        this.restart(resultDiv);
    }

    //--Win:--
    win() {
        this.setEndScreen("win");
    }

    //--Game over:--
    gameOver() {
        this.setEndScreen("game-over");
    }


    //--Input player name:--
    askForName(resultDiv, menu) {
        const inputName = document.getElementById("playername");
        const enterBt = document.getElementById("enter-bt");

        enterBt.addEventListener("click", () => {
                this.checkNameInput(inputName);
                resultDiv.classList.add("hidden");
                menu.classList.remove("hidden");

         });
    }

    //--Exit game:--
    exitGame(resultDiv, menu) {
        const exitBt = document.getElementById("exit");

        exitBt.addEventListener("click", () => {
            resultDiv.classList.add("hidden");
            menu.classList.remove("hidden");
            this.restartSettings();
        })
     }

    //--Restart Settings--
    restartSettings() {
        clearInterval(this.drawIntervalId);
        clearInterval(this.timeInterval);

        this.drawIntervalId = null;

        this.score = 0; 
        this.level = 1;
        this.background.setImage("background"); 
        this.elapsedTime = 0; 
        this.enemyAddTimer = 300;
        this.player = new Player (this.ctx, this.house);
        this.enemies = [new Enemy(this.ctx, "dementor")];
        this.music.currentTime = 0;
        this.resultSound = false;
        this.finalBattle.restartSettings();
        this.resurrectionStone.isCollected = false;
        this.invisibilityCloak.isCollected = false;
        this.music.src = "assets/audio/levels/level1.mp3";
        this.chocolateFrog.isCollected = false;
        this.chocolateFrog.isLifeVisible = false;
        this.deathlyHallowsImgStatus = "not";

        //Remove .game-over or .win class
        const resultDiv = document.getElementById("result");
        resultDiv.classList.remove("game-over");
        resultDiv.classList.remove("win");

    }

    //--Restart game:--
    restart(resultDiv) {
        const restartBt = document.getElementById("restart");
        restartBt.addEventListener("click", () => {
            resultDiv.classList.add("hidden");
            this.restartSettings();
            this.start();

            this.canvas.classList.remove("hidden");
            
        })
    }

    //--Check if the input name is not empty:--
    checkNameInput(inputName) {
        const playerName = inputName.value;
        if (playerName) {
            this.playerName = playerName;
            this.addScore(this.playerName); // Call addScore method to add it to players scores
            inputName.value = ""; // Clear input 
        }
    }

    //--Store the scores--
    addScore(playerName) {
        const score = {
            name: playerName,
            points: this.score,
            isWinner: this.finalBattle.isWin
        };

        // Get existing scores
        const scores = localStorage.getItem("scores") ? JSON.parse(localStorage.getItem("scores")) : [];
        scores.push(score);

        //Sort the scores in descending order:
        scores.sort((score1, score2) => score2.points - score1.points);
        //Get the 5 best scores:
        const top5 = scores.slice(0, 5);

        // Store scores in LocalStorage
        localStorage.setItem("scores", JSON.stringify( top5 ));
    }

    //--Player event listener:--
    onKeyEvent(event) {
        this.player.onKeyEvent(event);
    }
    

    //--Draw the game:--
    draw() {
        this.background.draw();
        this.player.draw();

        if ( this.elapsedTime >= 10 && this.elapsedTime <= 15) {
            this.chocolateFrog.draw();
        }
        
        //Image that informs that the player has to wait before casting another spell:
        if ( this.player.spell && this.player.spell.isActive ) {
            const loading = new Image();
            loading.src = "assets/images/magicloading.png";

            this.ctx.drawImage(
                loading, 
                this.player.x, 
                this.player.y -40, 
                loading.width / 2, 
                loading.height / 2);
        }

        //Enemies:
        this.enemies.forEach( enemy => enemy.draw() );
        if ( this.player.spell ) {
            this.player.spell.draw();
        }

        //Get and draw points:
        this.displayPoints = this.displayPoints.filter(point => {
            point.draw();  
            return point.show(); 
        });

        //Draw the corresponding deathly hallow:
        if ( this.timeLevel - this.elapsedTime <= 55) {
            this.deathlyHallows[this.level - 1].draw();
        }

        //Style font:
        this.ctx.font = "30px 'Harry potter', serif";
        this.ctx.fillStyle = "#b39161";

        //Level:
        this.ctx.fillText(`Level: ${this.level}`, this.ctx.canvas.width / 2 - 40, 30)

        //Time:
        this.ctx.fillText(`Time: ${this.elapsedTime}`, 10, this.ctx.canvas.height - 20)

        //Health player. Draw the number of lifes:
        for ( let i = 0; i < this.player.health; i++) {
            this.ctx.drawImage(
                this.imgHealth,
                this.xImgHealth + (i * this.widthImgHealth),
                this.yImgHealth,
                this.widthImgHealth,
                this.heightImgHealth);
        };

        //Score:
        this.ctx.drawImage(this.imgScore, this.ctx.canvas.width / 4 * 3, 10, 30, 30);
        this.ctx.fillText(`${this.score}`, this.ctx.canvas.width / 4 * 3 + 30, 35);

        //Deathly Hallows Collected:
        this.imgDeathlyHallows.src = `assets/images/game/${this.deathlyHallowsImgStatus}Collected.png`;
        this.ctx.drawImage(
            this.imgDeathlyHallows,
            this.ctx.canvas.width - this.imgDeathlyHallows.width / 2 -40,
            10,
            this.imgDeathlyHallows.width / 2,
            this.imgDeathlyHallows.height / 2
        )
    }

    //--Clear:--
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //--Move:--
    move() {
        this.background.move(this.player);
        this.player.move();
        this.chocolateFrog.move();

        this.enemies.forEach( enemy => {
            enemy.move(this.player);
        });
        this.deathlyHallows.forEach( deathlyHallow => deathlyHallow.move());

        //Check collisions:
        this.checkCollisionsItem();
        this.checkCollisionsAttack();
        this.checkCollisionsEnemy();
        this.checkCollisionsDeathly();

        //Remove dead enemies
        this.enemies = this.enemies.filter( enemy => enemy.isAlive || enemy.opacity > 0.7 );
    }

    //--Enemies collisions:--
    checkCollisionsEnemy() {
        this.enemies.forEach(enemy => {
            if (this.player.collides(enemy)) {
                this.player.loseLife();
                
                if (this.player.health === 0) {
                    this.gameOver();
                }
            }
        });
    }

    //--Attack collisions:--
    checkCollisionsAttack() {
        this.enemies = this.enemies.filter(enemy => {
            //If there is a collision with spell, the enemy takes damage
            if (this.player.spell && this.player.spell.collides(enemy)) {
                enemy.audio.pause();
                let eX = enemy.x;
                let eY = enemy.y;
                enemy.takeDamage();
                let points = (enemy.type === "troll") ? 100 : 200;
                this.score += points; //If the player kills an Enemy, get 200 points or 100 points if the enemy is Troll

                const enemyPoint = new Point(this.ctx, enemy);
                this.displayPoints.push(enemyPoint);
                
                return false; //Remove the enemy in the array
            }
            return true; // If there isn't a collision, keep it in the array
        });
    }

    //--Deathly collisions--:
    checkCollisionsDeathly() {
        this.deathlyHallows.forEach( deathlyHallow => {
            if ( this.player.collectDeathlyHallow( deathlyHallow) ) {
                switch ( deathlyHallow.name ) {
                    case "Resurrection Stone":
                        this.deathlyHallowsImgStatus = "one";
                        this.changeLevel();
                        break;
                    case "Invisibility Cloak":
                        this.deathlyHallowsImgStatus = "two";
                        this.levelUp();
                        this.playFinalBattle();
                        break;
                }
            }
        })
    }

    checkCollisionsItem() {
        if (this.player.collides(this.chocolateFrog) ) {
            this.player.collect(this.chocolateFrog);
        }
    }


    //--Stop game:--
    stop() {
        this.music.pause();
        this.enemies.forEach( e => e.audio.pause());
        this.started = false;
        clearInterval(this.drawIntervalId);
        clearInterval(this.timeInterval);
    }

    //--Add enemy:--
    addEnemy() {
        //Random index:
        const indexType = Math.floor( Math.random() * this.enemyTypes.length);
        const newEnemy = new Enemy(this.ctx, this.enemyTypes[indexType]);

        this.enemies.push(newEnemy);
    }

    //--Add item--
    addItem() {
        const indexType = Math.floor( Math.random() * this.enemyTypes.length);
        const newEnemy = new Enemy(this.ctx, this.enemyTypes[indexType]);

        this.enemies.push(newEnemy);
    }

    //--Set time level--
    setTimeLevel(){
        if ( this.elapsedTime >= this.timeLevel ) {
                this.gameOver();
        }
    }

    //--Update elapsed time:--
    updateElapsedTime() {
        this.timeInterval = setInterval(() => {
            this.elapsedTime++;
            this.setTimeLevel();
        }, 1000);
    }
    
    //--Level Up--
    levelUp() {
        this.level++;
        this.music.pause();
        this.enemies.forEach( e => e.audio.pause());
        this.enemies = [];
        this.elapsedTime = 0;
    }

    setImage(src) {
        this.background.src = src;
    }

    changeLevel() {
        if ( this.level === 1 ) {
            //Add an enemy every 200 ticks:
            this.levelUp();
            this.player.x = 20;
            this.music.currentTime = 0;
            this.music.src = "assets/audio/levels/level2.mp3";
            this.music.play();
            this.enemyAddTimer = 200;
            this.background.setImage("background-level2");
        } 
    }

    //--Start the final Battle--
    playFinalBattle() {
        //Stop the main game:
        this.stop();
        this.clear();

        //Start the final battle game
        this.finalBattle.start();
        this.finalBattle.move();
    }
}
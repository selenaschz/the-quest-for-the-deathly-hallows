class Enemy {
    constructor(ctx, type) {
        this.ctx = ctx;

        this.type = type; //Enemy type

        this.x = (this.type === "troll") ? -5 : this.ctx.canvas.width;
        this.y = (this.type === "dementor") ? 340 : 350;

        this.vx = 3; //Velocity

        this.audio = new Audio(`assets/audio/enemies/${type}.mp3`); //Enemy sound
        this.audio.volume = 0.06;

        this.sprite = new Image();
        this.sprite.src = `assets/images/enemies/${type}.png` //Enemy sprite
        
        this.sprite.frameIndex = 0;
        this.sprite.frames = 2;
        this.sprite.frameRate = 30;
        this.drawCount = 0;

        this.isAlive = true; //The enemy is alive or not

        this.isRight = false; //The enemy walks to the right or left

        this.opacity = 1;

        this.sprite.isLoaded = false;
        //If the sprite is loaded:
        this.sprite.onload = () => {
            this.sprite.isLoaded = true;
            this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.frames);
            this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.frames);
            this.width = this.sprite.frameWidth;
            this.height = this.sprite.frameHeight;
        }
    }

    //Change the frame sprite:
    updateAnimation() {
        this.drawCount++;

        if ( this.drawCount > this.sprite.frameRate ) {
            this.sprite.frameIndex++;
            this.drawCount = 0; //Reset the drawCount

            if (this.sprite.frameIndex >= this.sprite.frames) {
                this.sprite.frameIndex = 0; //Reset the frame Index
            }
        }
    }

    draw() {
        this.updateAnimation();

        //If the enemy is dead:
        if( !this.isAlive ) {
            this.fadeOut(); //Decreases the opacity
        }

        //Set the opacity of the enemy:
        this.ctx.globalAlpha = this.opacity;
        
        //Draw sprite:
        if ( this.sprite.isLoaded ) {
            this.ctx.drawImage(
                this.sprite,
                this.sprite.frameIndex * this.width,
                (this.isRigth ? 1 : 0) * this.height,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }

    }

    //Play the enemy sound:
    playSound() {
        if (this.x + this.width > 0 && this.x < this.ctx.canvas.width) {  
            this.audio.play(); }
    }

    //The enemy chases the player:
    move(player) {
        if ( player.x > this.x + this.width -30) {
            this.x += this.vx; 
            this.isRigth = true;
        } else if ( player.x < this.x ) {
            this.x -= this.vx; 
            this.isRigth = false;
        }
        
        //Play sound
        this.playSound();
    }

    //The enemy take damage:
    takeDamage() {
        this.fadeOut(); //Frame decreases the opacity
        this.isAlive = false; //The enemy dies
        this.audio.pause(); 
    }

    fadeOut() {
        this.opacity = Math.max(0, this.opacity - 0.05); //Decrease opacity
    }

}
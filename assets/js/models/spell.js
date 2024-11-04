class Spell {
    constructor(ctx, x, y, isRight, house) {
        this.ctx = ctx;

        this.x = isRight ? x : x - 100 ;
        this.y = y;

        //Velocity
        this.vx = 10;
        // this.vy = 0;

        //Hogwarts house
        this.house = house;

        this.isRight = isRight;

        this.isActive = false;

        this.audio = new Audio("assets/audio/spell.mp3");
        this.audio.volume = 0.12;

        this.sprite = new Image();
        this.sprite.src = `assets/images/spell/spell-${house}.png`;
        
        this.sprite.frameIndex = 0;
        this.sprite.frames = 2;
        this.sprite.frameRate = 30;
        this.drawCount = 0;

        this.sprite.onload = () => {
            this.isLoaded = true;
            this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.frames);
            this.height = this.sprite.height;
            this.width = this.sprite.frameWidth;
        }
    }
    
    //--Update Animation--
    updateAnimation() {
        this.drawCount++; //Counter

        if ( this.drawCount > this.sprite.frameRate ) {
            this.sprite.frameIndex++;
            this.drawCount = 0; //Reset counter

            if (this.sprite.frameIndex >= this.sprite.frames) {
                this.sprite.frameIndex = 0; //Reset frame index
            }
        }
    }

    //--Draw spell--
    draw() {
        this.updateAnimation();
        
        if ( this.isLoaded ) {
            this.ctx.drawImage(
                this.sprite,
                this.sprite.frameIndex * this.width,
                0,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        
    }

    //--Play spell sound--
    playSound() {
        if (this.x > 0 && this.x + this.width < this.ctx.canvas.width) {
            this.audio.play();
        }
    }

    //--Move spell--
    move(){
        if( this.isRight ) {
            this.x += this.vx;
        } else {
            this.x -= this.vx;
        }
    
        this.playSound();
        // this.y += this.vy;
    }

    //--Check collision with enemy:--
    collides(enemy) {
        const collisionX = enemy.x <= this.x + this.width && enemy.x + enemy.width >= this.x;
        const collisionY = enemy.y <= this.y + this.height && enemy.y + enemy.height >= this.y;
        
        return collisionX && collisionY && enemy.isAlive;
    }
}
    
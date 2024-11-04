class MagicItem {
    constructor(ctx, name) {
        this.ctx = ctx;

        this.x = Math.floor(Math.random() * (this.ctx.canvas.width - 100));
        this.y = this.ctx.canvas.height - 100;

        //Type of item:
        this.name = name;

        this.image = new Image();
        this.image.src = `assets/images/magicitems/${name}.png`;

        //The item is collected or not
        this.isCollected = false;

        //Velocity:
        this.vy= 0;
        //Gravity:
        this.g = 1;
        //Item is on the ground:
        this.isGround = true;

         this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
         }

        this.audio = new Audio("assets/audio/item.mp3")
        this.playedAudio = false;
    }

    draw() {
        if( !this.isCollected ) {
            this.ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
           )
        }
    }

    move() {

        //If it is on the ground, it jump:
        if ( this.isGround ) {
            this.vy = -10;
            this.isGround = false;
            
        //Else, apply gravity:
        } else {
            this.vy += this.g;
            this.y += this.vy; 

            this.checkIsGround();
        }
    }

    //Check if the item is on the ground or not
    checkIsGround() {
        if (this.y >= this.ctx.canvas.height - 100) { 
            this.y = this.ctx.canvas.height - 100; 
            this.isGround = true; 
            this.vy = 0;
        }
    }

}
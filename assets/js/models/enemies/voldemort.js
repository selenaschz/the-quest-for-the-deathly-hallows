class Voldemort extends Enemy {
    constructor(ctx) {
        super(ctx, "voldemort");
        this.spell = new Spell()
        this.x = this.ctx.canvas.width - 350;
        this.y = this.ctx.canvas.height - 200;
        this.img = new Image();
        this.img.src = "assets/images/enemies/voldemort.png"

        this.isAlive = true;
        this.img.onload = () => {
            this.isLoaded = true;
        }
    }

    draw() {
        if( this.isLoaded) {
            this.ctx.drawImage(
                this.img,
                this.x,
                this.y
            );
        }
     }
}
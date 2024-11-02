class Background {
    constructor(ctx, type) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;

        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;

        this.vx = 1;

        this.bgImg = new Image();
        this.bgImg.src = `assets/images/${type}.jpg`;
        this.bgImg.width = this.width;
        this.bgImg.height = this.height;
        
    }

    draw() {
        this.ctx.drawImage(this.bgImg, this.x, this.y, this.bgImg.width, this.bgImg.height);
        this.ctx.drawImage(this.bgImg, this.x + this.width, this.y, this.bgImg.width, this.bgImg.height);
    }

    move() {
        this.x -= this.vx;

        if (this.x + this.width <= 0) {
            this.x = 0;
        } 
    }
}
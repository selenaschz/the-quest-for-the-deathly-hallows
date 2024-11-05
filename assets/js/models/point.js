class Point {
    constructor(ctx, enemy) {
        this.ctx = ctx;
        this.x = enemy.x;
        this.y = enemy.y;
        this.points = (enemy.type === "troll") ? 100 : 200;
        this.showTime = 60;

        this.image = new Image();
        this.image.src = `assets/images/points/${this.points}.png`;
        this.isLoaded = false;
        this.image.onload = () => {
            this.isLoaded = true;
        };
    }

    draw() {
        if (this.isLoaded && this.show() ) {
            this.ctx.drawImage(this.image, this.x, this.y);
            this.y -= 1;  
            this.showTime -= 1; 
        }
    }

    //If 
    show() {
        return this.showTime > 0;
    }
}
class ElderWand extends MagicItem {
    constructor(ctx) {
        super(ctx, "Elder Wand");

        this.x = this.ctx.canvas.width - 350;
        this.vx = -2;
        this.isGround = true;
    }

    move() {
        this.x += this.vx;
    }

}
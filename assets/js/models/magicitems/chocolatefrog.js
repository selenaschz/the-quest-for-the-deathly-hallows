class ChocolateFrog extends MagicItem {
    constructor(ctx) {
        super(ctx, "Chocolate Frog");
        this.x = Math.floor(Math.random() * (this.ctx.canvas.width - 100));
    }

    giveLife(player) {
        if (player.health < 3 ) {
            player.health++;
            this.isCollected = true; 
        }
    }
    
}
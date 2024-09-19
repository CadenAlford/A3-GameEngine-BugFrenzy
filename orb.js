export class Orb {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.radius = 10;
        this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
        this.y = Math.random() * (canvas.height - 2 * this.radius) + this.radius;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "yellow";
        this.ctx.fill();
        this.ctx.closePath();
    }

    // Function to detect collision with the ladybug
    checkCollision(ladybug) {
        // Get the center of the ladybug and the orb
        const ladybugCenterX = ladybug.x;
        const ladybugCenterY = ladybug.y;
        const ladybugRadius = ladybug.size / 2; 
    
        const orbCenterX = this.x; 
        const orbCenterY = this.y; 
        const orbRadius = this.radius; 
    
        // Calculate the distance between the centers of the ladybug and the orb
        const distanceX = ladybugCenterX - orbCenterX;
        const distanceY = ladybugCenterY - orbCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
        // Check if the distance is less than the sum of the radii
        if (distance < ladybugRadius + orbRadius) {
            return true; 
        }
    
        return false; 
    }    
}

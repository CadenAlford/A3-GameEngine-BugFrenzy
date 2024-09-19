export class Grasshopper {
    constructor(x, y, width, height, speedX, speedY, canvas, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.jumpFactor = 1.5;
        this.jumpSpeed = 0.01;
        this.rotationAngle = 0;
        this.canvas = canvas;
        this.ctx = ctx;
        this.prevX = this.x; 
        this.prevY = this.y;
    }

    update(deltaTime) {
        this.prevX = this.x;
        this.prevY = this.y;

        this.move(deltaTime);
    }

    draw(interpolationFactor) {
        // Interpolate between the previous and current position
        const interpolatedX = this.prevX + (this.x - this.prevX) * interpolationFactor;
        const interpolatedY = this.prevY + (this.y - this.prevY) * interpolationFactor;

        this.ctx.save();
        this.ctx.translate(interpolatedX, interpolatedY);
        this.ctx.rotate(this.rotationAngle);
        this.ctx.scale(this.jumpFactor, this.jumpFactor);

        this.drawLegs();
        this.drawBody();

        this.ctx.restore();
    }

    move(deltaTime) {
        // Move the grasshopper's position based on its speed
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;

        // Reverse direction if the grasshopper hits the canvas edges
        if (this.x + this.width > this.canvas.width || this.x - this.width < 0) {
            this.speedX *= -1;
        }
        if (this.y + this.height > this.canvas.height || this.y - this.height < 0) {
            this.speedY *= -1;
        }

        this.rotationAngle = Math.atan2(this.speedX, -this.speedY);

        this.jumpFactor += this.jumpSpeed;
        if (this.jumpFactor > 1.5 || this.jumpFactor < 1) {
            this.jumpSpeed *= -1;
        }
    }

    drawLegs() {
        const legLength = this.width;
        const legOffset = this.width * 0.5;
        const legSpacing = this.height * 0.3;

        // Draw legs on the left side
        for (let i = 0; i < 3; i++) {
            const legY = (i - 1) * legSpacing;
            this.ctx.beginPath();
            this.ctx.moveTo(-legOffset, legY);
            this.ctx.lineTo(-legOffset - legLength, legY);
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        // Draw legs on the right side
        for (let i = 0; i < 3; i++) {
            const legY = (i - 1) * legSpacing;
            this.ctx.beginPath();
            this.ctx.moveTo(legOffset, legY);
            this.ctx.lineTo(legOffset + legLength, legY);
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
    }

    drawBody() {
        // Draw Main Body
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, this.width, this.height, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = "green";
        this.ctx.fill();
        this.ctx.stroke();

        // Draw head
        this.ctx.beginPath();
        this.ctx.ellipse(0, -this.height * 0.9, this.height * 0.5, this.width * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = "darkgreen";
        this.ctx.fill();
        this.ctx.stroke();

        // Draw eyes
        const eyeRadius = this.width * 0.2;
        const eyeY = -this.height * 0.95;
        const eyeOffsetX = this.width * 0.5;

        // Left eye
        this.ctx.beginPath();
        this.ctx.arc(-eyeOffsetX, eyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "black";
        this.ctx.fill();

        // Right eye
        this.ctx.beginPath();
        this.ctx.arc(eyeOffsetX, eyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
    }

    getX(){
        return this.x;
    }

    checkCollision(ladybug) {
        // Get the center of the ladybug and the orb
        const ladybugCenterX = ladybug.x;
        const ladybugCenterY = ladybug.y;
        const ladybugRadius = ladybug.size / 2; 
    
        const grassCenterX = this.x; 
        const grassCenterY = this.y; 
    
        // Calculate the distance between the centers of the ladybug and the orb
        const distanceX = ladybugCenterX - grassCenterX;
        const distanceY = ladybugCenterY - grassCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
        // Check if the distance is less than the sum of the radii (indicating a collision)
        if (distance < ladybugRadius + this.width) {
            return true; // Collision detected
        }
    
        return false; // No collision
    }    
}


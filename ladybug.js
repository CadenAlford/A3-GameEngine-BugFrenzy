// Ladybug.js

export class Ladybug {
    constructor(x, y, size, canvas, ctx) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = 500;
        this.wingAngle = 0;
        this.wingFlapSpeed = 0.015;
        this.rotationAngle = 0;
        this.movementX = 0;
        this.movementY = 0;
        this.prevX = this.x; 
        this.prevY = this.y;
        this.canvas = canvas;
        this.ctx = ctx;
    }

    handleInput(keysPressed, deltaTime) {
        let moveX = 0;
        let moveY = 0;
        let move = false;

        if (keysPressed['w']) {
            moveY = -this.speed;
            move = true;
        }
        if (keysPressed['a']) {
            moveX = -this.speed;
            move = true;
        }
        if (keysPressed['s']) {
            moveY = this.speed;
            move = true;
        }
        if (keysPressed['d']) {
            moveX = this.speed;
            move = true;
        }

        // Update movement direction and rotation
        if (moveX !== 0 || moveY !== 0) {
            this.movementX = moveX;
            this.movementY = moveY;

            this.rotationAngle = Math.atan2(this.movementX, -this.movementY);
        }

        
        // Update position based on movement
        if(move == true){
            this.x += this.movementX * deltaTime;
            this.y += this.movementY * deltaTime;
        }

        // Prevent ladybug from going out of bounds
        this.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(this.canvas.height - this.size, this.y));
    }

    drawBody() {
        const legLength = this.size * 1;
        const legOffset = this.size * 0.5;
        const legSpacing = this.size * 0.48;
        const bodyOffset = this.size * 0.38;

        // Draw legs on the left side
        for (let i = 0; i < 3; i++) {
            const legY = (i - 1) * legSpacing + bodyOffset;
            this.ctx.beginPath();
            this.ctx.moveTo(-legOffset, legY);
            this.ctx.lineTo(-legOffset - legLength, legY);
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        // Draw legs on the right side
        for (let i = 0; i < 3; i++) {
            const legY = (i - 1) * legSpacing + bodyOffset;
            this.ctx.beginPath();
            this.ctx.moveTo(legOffset, legY);
            this.ctx.lineTo(legOffset + legLength, legY);
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        // Draw Main Body
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.stroke();

        // Draw black head
        this.ctx.beginPath();
        this.ctx.arc(0, -this.size * 0.15, this.size * 0.4, Math.PI, 0);
        this.ctx.fillStyle = "black";
        this.ctx.fill();

        // Draw dividing white line
        this.ctx.beginPath();
        this.ctx.moveTo(0, -this.size * 0.25 - this.size * 0.8);
        this.ctx.lineTo(0, -this.size * 0.25);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw the white eyes
        const eyeRadius = this.size * 0.1;
        const eyeY = -this.size * 0.55;
        const eyeOffsetX = this.size * 0.6;

        // Left eye
        this.ctx.beginPath();
        this.ctx.arc(-eyeOffsetX, eyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.stroke();

        // Right eye
        this.ctx.beginPath();
        this.ctx.arc(eyeOffsetX, eyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawWings() {
        const wingRadius = this.size * 1.2;
        const wingY = this.size * 0.7;

        this.wingAngle += this.wingFlapSpeed;
        if (this.wingAngle > 1.4 || this.wingAngle < -1.55) {
            this.wingFlapSpeed *= -1;
        }

        // Draw left wing
        this.ctx.save();
        this.ctx.translate(0, wingY);
        this.ctx.rotate(this.wingAngle);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, wingRadius, Math.PI, Math.PI * 2);
        this.ctx.fillStyle = "red";
        this.ctx.strokeStyle = "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();

        // Draw right wing
        this.ctx.save();
        this.ctx.translate(0, wingY);
        this.ctx.rotate(-this.wingAngle);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, wingRadius, Math.PI, 0);
        this.ctx.fillStyle = "red";
        this.ctx.strokeStyle = "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }

    draw(interpolationFactor) {
        // Interpolate between the previous and current position
        let interpolatedX = this.prevX + (this.x - this.prevX) * interpolationFactor;
        let interpolatedY = this.prevY + (this.y - this.prevY) * interpolationFactor;

        this.ctx.save();
        this.ctx.translate(interpolatedX, interpolatedY);
        this.ctx.rotate(this.rotationAngle);

        this.drawBody();
        this.drawWings();

        this.ctx.restore();
    }

    update(keysPressed, deltaTime) {
        this.prevX = this.x;
        this.prevY = this.y;

        // Handle input and update position
        this.handleInput(keysPressed, deltaTime);
    }
}

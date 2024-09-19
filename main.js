import { Ladybug } from './ladybug.js';
import { Grasshopper } from './grasshopper.js';
import { Orb } from './orb.js'; 

window.onload = function() {
    // Canvas Globals
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Event Listeners
    const keysPressed = {};

    // Interpolation Rendering
    const targetFPS = 120; 
    const frameDuration = 1000 / targetFPS; 
    const timeStep = 1000 / 60; 
    let accumulatedTime = 0;
    let lastFrameTime = performance.now();
    let lastRenderTime = 0;
    let fps = 0; 
    let frameCount = 0;
    let framesThisSecond = 0;

    // Game Score and Orbs
    let score = 0; 
    let highscore = 0; 
    const maxOrbs = 6; 
    const orbSpawnInterval = 4000;
    const orbs = []; 

    // Initialize ladybugs and grasshoppers
    let ladybugs = [new Ladybug(100, 100, 30, canvas, ctx)];
    let grasshoppers = [
        new Grasshopper(200, 400, 15, 30, 200, 200, canvas, ctx),
        new Grasshopper(400, 300, 20, 30, 200, 200, canvas, ctx), 
        new Grasshopper(250, 250, 20, 35, 200, 200, canvas, ctx)
    ];

    // Function to spawn orbs periodically
    setInterval(function() {
        if (orbs.length < maxOrbs) {
            spawnOrb();
        }
    }, orbSpawnInterval);

    // Start the main loop
    requestAnimationFrame(mainLoop);

    function mainLoop(timestamp) {
        const frameTime = timestamp - lastFrameTime; 
        lastFrameTime = timestamp;
        accumulatedTime += frameTime;

        // Update the game logic based on fixed simulation steps
        while (accumulatedTime >= timeStep) {
            const deltaTime = timeStep / 1000; 
            update(deltaTime); 
            accumulatedTime -= timeStep;
        }

        // Throttle rendering to target FPS
        if (timestamp >= lastRenderTime + frameDuration) {
            const interpolationFactor = accumulatedTime / timeStep;

            // Clear canvas and render with interpolation
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            render(interpolationFactor);

            // Set the last render time to the current timestamp
            lastRenderTime = timestamp;
            framesThisSecond++;
        }

       
        requestAnimationFrame(mainLoop);
    }

    // Update Bugs
    function update(deltaTime) {
        ladybugs.forEach(ladybug => {
            ladybug.update(keysPressed, deltaTime);
        });

        grasshoppers.forEach(grasshopper => {
            grasshopper.update(deltaTime);
            if (grasshopper.checkCollision(ladybugs[0])) {
                resetGame();
            }
        });

        // Check collision between ladybug and orbs
        orbs.forEach((orb, index) => {
            if (orb.checkCollision(ladybugs[0])) {
                score += 10;
                orbs.splice(index, 1); 
            }
        });
    }


    function render(interpolationFactor) {
        orbs.forEach(orb => {
            orb.draw();
        });

        ladybugs.forEach(ladybug => {
            ladybug.draw(interpolationFactor);
        });

        // Render grasshoppers with interpolation
        grasshoppers.forEach(grasshopper => {
            grasshopper.draw(interpolationFactor);
        });

        // Display score in the center of the canvas
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);

        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(`High Score: ${highscore}`, canvas.width - 100, 30);

        // Display the FPS in the top left corner of the canvas
        ctx.fillText(`FPS: ${fps}`, 50, 20);
    }

    function spawnOrb() {
        const orb = new Orb(canvas, ctx); 
        orbs.push(orb); 
    }

    function resetGame() {
        if (score > highscore) {
            highscore = score; 
        }
        score = 0;
        orbs.length = 0; 
    }

    // Event Listeners
    window.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true;
    });

    
    window.addEventListener('keyup', (e) => {
        keysPressed[e.key] = false;
    });

    //Update FPS
    setInterval(function() {
        fps = framesThisSecond; 
        framesThisSecond = 0; 
    }, 1000); 
};

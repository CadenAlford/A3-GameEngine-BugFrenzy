// Function to spawn new orbs
function spawnOrbs(maxOrbs, orbs, canvasWidth, canvasHeight) {
    if (orbs.length >= maxOrbs) return orbs;

    const newOrb = {
        x: Math.random() * (canvasWidth - 20) + 10,
        y: Math.random() * (canvasHeight - 20) + 10,
        radius: 10
    };

    orbs.push(newOrb);
    return orbs;
}

// Handle messages from the main thread
self.onmessage = function(event) {
    const { action, ladybugs, orbs, maxOrbs, canvasWidth, canvasHeight } = event.data;

    if (action === 'checkCollisions') {
        const collisions = checkCollisions(ladybugs, orbs);
        self.postMessage({ action: 'checkCollisions', collisions });
    }

    if (action === 'spawnOrbs') {
        const newOrbs = spawnOrbs(maxOrbs, orbs, canvasWidth, canvasHeight);
        self.postMessage({ action: 'spawnOrbs', newOrbs });
    }
};

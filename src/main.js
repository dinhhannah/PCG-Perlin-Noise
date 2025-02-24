"use strict" // debug with extreme prejudice

//Game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // Prevent pixel art from getting blurred when scaled
    },
    width: 1280, // Canvas width in pixels
    height: 800, // Canvas height in pixels
    scene: [Load, TinyTown],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the canvas
      },
}

// you can define global variables here
const GAME = new Phaser.Game(config);
const GLOBAL = "I am a global variable :)"
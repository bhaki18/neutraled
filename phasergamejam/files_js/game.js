

import Scene4 from './scene4.js';
import { Scene3 } from './scene3.js';
import Scene2 from './scene2.js';
import Scene1 from './scene1.js';


const config = {
  type: Phaser.AUTO,
  scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x:0, y: 0 }, // o 0 se top-down
            debug: true        // opzionale, utile per vedere collisioni
        }
    },
  width: 800,
  height: 600,
  scene: [Scene1,Scene2,Scene3,Scene4]
};

new Phaser.Game(config);

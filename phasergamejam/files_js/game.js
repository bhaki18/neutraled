import ScenePreload from './scene_preload.js';
import Scene15 from './scene15.js';
import Scene14 from './scene14.js';
import Scene13 from './scene13.js';
import Scene12 from './scene12.js';
import Scene11 from './scene11.js';
import Scene10 from './scene10.js';
import Scene9 from './scene9.js';
import Scene8 from './scene8.js';
import Scene7 from './scene7.js';
import Scene6 from './scene6.js';
import { Scene5 } from './scene5.js';
import Scene4 from './scene4.js';
import { Scene3 } from './scene3.js';
import Scene2 from './scene2.js';
import Scene1 from './scene1.js';
import SceneGameOver from './scene_gameover.js';
import SceneVictory from './scene_victory.js';
import SceneGameWin from './scene_gamewin.js';
import SceneUI from './scene_ui.js';


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
            debug: false        // opzionale, utile per vedere collisioni
        }
    },
  width: 800,
  height: 600,
  scene: [ScenePreload,Scene1,Scene2,Scene3,Scene4,Scene5,Scene6,Scene7,Scene8,Scene9,Scene10,Scene11,Scene12,Scene13,Scene14,Scene15,SceneGameOver,SceneVictory,SceneGameWin,SceneUI],
  fps: {
        target: 60,  // massimo FPS desiderato
        forceSetTimeOut: false // se true, usa setTimeout invece di requestAnimationFrame
    }
};

new Phaser.Game(config);

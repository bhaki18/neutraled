import { Scene5 } from "../scene5.js";
import Scene6 from "../scene6.js";
import Scene7 from "../scene7.js";
import Scene8 from "../scene8.js";
import Scene9 from "../scene9.js";
import Scene10 from "../scene10.js";
import Scene11 from "../scene11.js";
import Scene12 from "../scene12.js";
import Scene13 from "../scene13.js";
import Scene14 from "../scene14.js";
import Scene15 from "../scene15.js";
import SceneUI from "../scene_ui.js";

import ScenePreload from "../scene_preload.js";
import SceneGameOver from "../scene_gameover.js";
import SceneVictory from "../scene_victory.js";
import SceneGameWin from "../scene_gamewin.js";

class SceneTargetTest extends Phaser.Scene {
    constructor() { super('Scene1'); } // Preloader thinks it should start Scene1
    create() { this.scene.start('Scene15'); }
}

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
            debug: false       // opzionale, utile per vedere collisioni
        }
    },
  width: 800,
  height: 600,
  scene: [ScenePreload, Scene15, SceneTargetTest, SceneUI, SceneGameOver, SceneVictory, SceneGameWin]
};

new Phaser.Game(config);

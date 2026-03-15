export default class ScenePreload extends Phaser.Scene {
    constructor() {
        super('ScenePreload');
    }

    preload() {
        // Grafica di caricamento
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(width / 2, height / 2 - 50, 'Caricamento Assets...', {
            fontFamily: '"Press Start 2P", Courier, monospace',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

        const percentText = this.add.text(width / 2, height / 2 + 25, '0%', {
            fontFamily: '"Press Start 2P", Courier, monospace',
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            percentText.destroy();
        });

        // --------------------------------------------------------
        // TUTTI GLI ASSET DEL GIOCO (Estratti da Scene 1 a 15)
        // --------------------------------------------------------

        // === SCENE 1 ===
        this.load.image('background_sky', 'assets/scene1/scene1_background_sky.png');
        for (let i = 1; i <= 10; i++) {
            this.load.image(`background_cloud${i}`, `/assets/scene1/scene1_background_cloud${i}.png`);
        }
        for (let i = 1; i <= 3; i++) {
            this.load.image(`secret_character_frame${i}`, `/assets/scene1/scene1_secret_character_frame${i}.png`);
            this.load.image(`play_button_frame${i}`, `/assets/scene1/scene1_play_button_frame${i}.png`);
            this.load.image(`option_button_frame${i}`, `/assets/scene1/scene1_option_button_frame${i}.png`);
        }
        this.load.image('title', 'assets/scene1/scene1_title.png');

        // === SCENE 2 ===
        this.load.image('space_background_frame1', 'assets/scene2/scene2_space_background_frame1.png');
        this.load.image('space_background_frame2', 'assets/scene2/scene2_space_background_frame2.png');
        this.load.image('secret_character', 'assets/scene2/scene2_secret_character.png');
        this.load.audio('secret_character_talking_sound', 'assets/scene2/scene2_secret_character_talking_sound.mp3');

        // === SCENE 3 ===
        this.load.tilemapTiledJSON('map', 'assets/scene3/tile_map/map.json');
        this.load.image('tiles', 'assets/scene3/tile_map/spritesheet.png');
        this.load.image('player', 'assets/scene3/scene3_player.png');
        this.load.image('npc1', 'assets/scene2/scene2_secret_character.png');
        this.load.image('upwalk_frame1', 'assets/scene3/scene3_upwalking_frame1.png');
        this.load.image('upwalk_frame2', 'assets/scene3/scene3_upwalking_frame2.png');
        this.load.image('upwalk_frame3', 'assets/scene3/scene3_upwalking_frame3.png');
        this.load.image('leftwalk_frame1', 'assets/scene3/scene3_leftwalking_frame1.png');
        this.load.image('leftwalk_frame2', 'assets/scene3/scene3_leftwalking_frame2.png');
        this.load.image('rightwalk_frame1', 'assets/scene3/scene3_rightwalking_frame1.png');
        this.load.image('rightwalk_frame2', 'assets/scene3/scene3_rightwalking_frame2.png');
        this.load.image('downwalk_frame2', 'assets/scene3/scene3_downwalking_frame2.png');
        this.load.image('downwalk_frame3', 'assets/scene3/scene3_downwalking_frame3.png');
        this.load.image('uscita', 'assets/scene3/scene3_uscita.png');
        
        // Monster Player Animations
        this.load.image('monster_player_stand_frame', 'assets/scene8/monster_player.png');
        this.load.image('monster_player_upwalking_frame1', 'assets/scene8/monster_player_upwalking_frame1.png');
        this.load.image('monster_player_upwalking_frame2', 'assets/scene8/monster_player_upwalking_frame2.png');
        this.load.image('monster_player_upwalking_frame3', 'assets/scene8/monster_player_upwalking_frame3.png');
        this.load.image('monster_player_downwalking_frame1', 'assets/scene8/monster_player_downwalking_frame1.png');
        this.load.image('monster_player_downwalking_frame2', 'assets/scene8/monster_player_downwalking_frame2.png');
        this.load.image('monster_player_downwalking_frame3', 'assets/scene8/monster_player_downwalking_frame3.png');
        this.load.image('monster_player_rightwalking_frame1', 'assets/scene8/monster_player_right_frame1.png');
        this.load.image('monster_player_rightwalking_frame2', 'assets/scene8/monster_player_right_frame2.png');
        this.load.image('monster_player_leftwalking_frame1', 'assets/scene8/monster_player_left_frame1.png');
        this.load.image('monster_player_leftwalking_frame2', 'assets/scene8/monster_player_left_frame2.png');

        // Duplicate names to match direct calls in Scene 15:
        this.load.image('monster_player_right_frame1', 'assets/scene8/monster_player_right_frame1.png');
        this.load.image('monster_player_right_frame2', 'assets/scene8/monster_player_right_frame2.png');
        this.load.image('monster_player_left_frame1', 'assets/scene8/monster_player_left_frame1.png');
        this.load.image('monster_player_left_frame2', 'assets/scene8/monster_player_left_frame2.png');

        // === SCENE 4 ===
        this.load.image('bullet1', 'assets/scene4/scene4_bullet1.png');
        this.load.image('player_shield', 'assets/scene4/scene4_player_shield.png');

        // === SCENE 5 ===
        this.load.tilemapTiledJSON('map1', 'assets/scene5/tile_map/map.json');
        this.load.image('tiles1', 'assets/scene5/tile_map/spritesheet.png');
        this.load.spritesheet('enemy1', 'assets/scene5/npc1_animation.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy2', 'assets/scene5/enemy2_animation.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('scene5_audio', 'assets/sounds/scene5_soundtrack.mp3');

        // === SCENE 6 & 7 ===
        this.load.image('bullet', 'assets/scene4/scene4_bullet1.png');
        this.load.image('shield', 'assets/scene4/scene4_player_shield.png');
        this.load.audio('scene6_audio', 'assets/sounds/scene6_fightsoundtrack.mp3');
        this.load.audio('scene7_audio', 'assets/sounds/scene7_fightsoundtrack.mp3');

        // === SCENE 8 ===
        this.load.tilemapTiledJSON('map2', 'assets/scene8/tile_map/map.json');
        this.load.image('tiles2', 'assets/scene8/tile_map/spritesheet.png');
        this.load.image('enemy3_frame1', 'assets/scene8/enemy3_frame1.png');

        // === SCENE 10 ===
        this.load.tilemapTiledJSON('map3', 'assets/scene10/tile_map/map.json');
        this.load.image('tiles3', 'assets/scene10/tile_map/spritesheet.png');
        this.load.spritesheet('enemy4', 'assets/scene10/enemy4_animation.png', { frameWidth: 32, frameHeight: 32 });

        // === SCENE 11 & 13 ===
        this.load.image('attack', 'assets/scene4/scene4_bullet1.png');
        this.load.image('player_slash', 'assets/scene11/player_slash.png');
        this.load.image('player_soul', 'assets/scene4/scene4_player_shield.png');
        
        // === SCENE 12 ===
        this.load.tilemapTiledJSON('map4', 'assets/scene12/tile_map/map.json');
        this.load.image('tiles4', 'assets/scene12/tile_map/spritesheet.png');
        this.load.image('enemy5_frame1', 'assets/scene12/enemy5_frame1.png');

        // === SCENE 14 ===
        this.load.tilemapTiledJSON('map5', 'assets/scene14/tile_map/map.json');
        this.load.image('tiles5', 'assets/scene14/tile_map/spritesheet.png');
        this.load.audio('scene14_audio', 'assets/sounds/scene14_soundtrack.mp3');

        // === SCENE 15 ===
        this.load.image('background', 'assets/scene15/background.png');
        this.load.image('background_wc', 'assets/scene15/background_with_castle.png');
        this.load.image('sky', 'assets/scene1/scene1_background_sky.png');
        this.load.image('tifone_frame1', 'assets/scene15/tifone_frame1.png');
        this.load.image('bullets', 'assets/scene4/scene4_bullet1.png');
        this.load.image('tifone_fulmine', 'assets/scene15/tifone_fulmine.png');
        this.load.image('tifone_laser', 'assets/scene15/tifone_laser.png');
        this.load.spritesheet('tifone_onde_laterali_frame1', 'assets/scene15/onde_laterali_animation.png', { frameWidth: 48, frameHeight: 28 });
        this.load.image('tifone_onda_frontale', 'assets/scene15/tifone_onda_frontale.png');
        this.load.spritesheet('tifone_tornado', 'assets/scene15/tifone_tornado_animation.png', { frameWidth: 36, frameHeight: 50 });
        this.load.audio('scene15_audio', 'assets/sounds/scene15_fight_soundtrack.mp3');

        // === OGGETTI AMBIENTALI ===
        this.load.image('Cespuglio', 'assets/oggetti ambientali/Cespuglio.png');
        this.load.image('ABunchOfFlowers', 'assets/oggetti ambientali/ABunchOfFlowers.png');
        this.load.image('Teschio', 'assets/oggetti ambientali/Teschio.png');
        this.load.image('chebellaLANTERNA', 'assets/oggetti ambientali/chebellaLANTERNA.png');
    }

    create() {
        // Avvia la Scena 1 una volta completato il preloading globalmente
        this.scene.start('Scene1');
    }
}

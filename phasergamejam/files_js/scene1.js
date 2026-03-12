

export default class Scene1 extends Phaser.Scene {
    constructor() {
        super('Scene1');

        // input tasti
        this.keys = null;

        // larghezza e altezza del mondo
        this.worldWidth = 0;
        this.worldHeight = 0;

        // puntatore del mouse
        this.mouse = null;

        // nuvole
        this.cloud1 = null; this.cloud2 = null; this.cloud3 = null;
        this.cloud4 = null; this.cloud5 = null; this.cloud6 = null;
        this.cloud7 = null; this.cloud8 = null; this.cloud9 = null;
        this.cloud10 = null;

        this.cloud1_x = 0; this.cloud2_x = 0; this.cloud3_x = 0;
        this.cloud4_x = 0; this.cloud5_x = 0; this.cloud6_x = 0;
        this.cloud7_x = 0; this.cloud8_x = 0; this.cloud9_x = 0;
        this.cloud10_x = 0;

        this.cloud1_y = 0; this.cloud2_y = 0; this.cloud3_y = 0;
        this.cloud4_y = 0; this.cloud5_y = 0; this.cloud6_y = 0;
        this.cloud7_y = 0; this.cloud8_y = 0; this.cloud9_y = 0;
        this.cloud10_y = 0;

        this.cloud_speed1 = 0; this.cloud_speed2 = 0; this.cloud_speed3 = 0;
        this.cloud_speed4 = 0; this.cloud_speed5 = 0; this.cloud_speed6 = 0;
        this.cloud_speed7 = 0; this.cloud_speed8 = 0; this.cloud_speed9 = 0;
        this.cloud_speed10 = 0;

        // personaggio segreto
        this.secret_character = null;
        this.secret_character_last_add = false;
        this.seconds_frame_waiter = 0;

        // pulsanti
        this.play_button = null;
        this.play_button_x = 0; this.play_button_y = 0; this.is_play_button_pressed = false;

        this.option_button = null;
        this.option_button_x = 0; this.option_button_y = 0; this.is_option_button_pressed = false;

        // titolo
        this.title_x = 0; this.title_y = 0;
    }

    init() {

        // variabili globali
        this.registry.set('is_player_human', true);























        // variabili di questa scenaw

        this.mouse = this.input.activePointer;

        this.worldWidth = 800;
        this.worldHeight = 600;

        this.cloud1_x = (800 / 5 * 1) - 60;
        this.cloud2_x = (800 / 5 * 2) - 60;
        this.cloud3_x = (800 / 5 * 3) - 60;
        this.cloud4_x = (800 / 5 * 4) - 60;
        this.cloud5_x = (800 / 5 * 5) - 60;
        this.cloud6_x = (800 / 5 * 1) - 60;
        this.cloud7_x = (800 / 5 * 1) - 60;
        this.cloud8_x = (800 / 5 * 3) - 60;
        this.cloud9_x = (800 / 5 * 4) - 60;
        this.cloud10_x = (800 / 5 * 5) - 60;

        this.cloud1_y = (600 / 5 * 1) - 60;
        this.cloud2_y = (600 / 5 * 2) - 60;
        this.cloud3_y = (600 / 5 * 3) - 60;
        this.cloud4_y = (600 / 5 * 4) - 60;
        this.cloud5_y = (600 / 5 * 5) - 60;
        this.cloud6_y = (600 / 5 * 3) - 60;
        this.cloud7_y = (600 / 5 * 5) - 60;
        this.cloud8_y = (600 / 5 * 5) - 60;
        this.cloud9_y = (600 / 5 * 1) - 60;
        this.cloud10_y = (600 / 5 * 2) - 60;

        this.cloud_speed1 = 1.5; this.cloud_speed2 = 2; this.cloud_speed3 = 1;
        this.cloud_speed4 = 2; this.cloud_speed5 = 1; this.cloud_speed6 = 2;
        this.cloud_speed7 = 1.5; this.cloud_speed8 = 2; this.cloud_speed9 = 2; this.cloud_speed10 = 2;

        this.secret_character_last_add = false;
        this.seconds_frame_waiter = 60;

        this.play_button_x = this.worldWidth / 2;
        this.play_button_y = this.worldHeight / 2 + 150;
        this.is_play_button_pressed = false;

        this.option_button_x = this.worldWidth / 2;
        this.option_button_y = this.worldHeight / 2 + 220;
        this.is_option_button_pressed = false;

        this.title_x = this.worldWidth / 2;
        this.title_y = this.worldHeight / 5;
    }

    preload() {
        this.load.image('background_sky', '/assets/scene1/scene1_background_sky.png');

        for (let i = 1; i <= 10; i++) {
            this.load.image(`background_cloud${i}`, `/assets/scene1/scene1_background_cloud${i}.png`);
        }

        for (let i = 1; i <= 3; i++) {
            this.load.image(`secret_character_frame${i}`, `/assets/scene1/scene1_secret_character_frame${i}.png`);
            this.load.image(`play_button_frame${i}`, `/assets/scene1/scene1_play_button_frame${i}.png`);
            this.load.image(`option_button_frame${i}`, `/assets/scene1/scene1_option_button_frame${i}.png`);
        }

        this.load.image('title', '/assets/scene1/scene1_title.png');
    }

    create() {
        this.keys = this.input.keyboard.addKeys({ lmb: Phaser.Input.Keyboard.KeyCodes.LEFT });

        this.add.image(0, 0, 'background_sky').setScale(1.6).setDepth(1);

        for (let i = 1; i <= 10; i++) {
            this[`cloud${i}`] = this.add.image(this[`cloud${i}_x`], this[`cloud${i}_y`], `background_cloud${i}`).setDepth(2).setScale(i >= 8 ? 2 : 1.5).setOrigin(0);
        }

        this.anims.create({
            key: 'flymoving',
            frames: [
                { key: 'secret_character_frame1' },
                { key: 'secret_character_frame2' },
                { key: 'secret_character_frame3' },
                { key: 'secret_character_frame2' }
            ],
            frameRate: 6,
            repeat: -1
        });

        this.secret_character = this.add.sprite(this.worldWidth / 2, this.worldHeight / 2, 'secret_character_frame1').setDepth(3).setScale(4).setFlipX(true);
        this.secret_character.anims.play('flymoving');

        this.play_button = this.add.sprite(this.play_button_x, this.play_button_y, 'play_button_frame1').setDepth(3).setOrigin(0.5);

        this.anims.create({
            key: 'play_button_pressed',
            frames: [
                { key: 'play_button_frame1' },
                { key: 'play_button_frame2' },
                { key: 'play_button_frame3' }
            ],
            frameRate: 4,
            repeat: 0
        });

        this.anims.create({
            key: 'play_button_depressed',
            frames: [
                { key: 'play_button_frame3' },
                { key: 'play_button_frame2' },
                { key: 'play_button_frame1' }
            ],
            frameRate: 4,
            repeat: 0
        });

        this.option_button = this.add.sprite(this.option_button_x, this.option_button_y, 'option_button_frame1').setDepth(3).setOrigin(0.5).setScale(1);

        this.anims.create({
            key: 'option_button_pressed',
            frames: [
                { key: 'option_button_frame1' },
                { key: 'option_button_frame2' },
                { key: 'option_button_frame3' }
            ],
            frameRate: 4,
            repeat: 0
        });

        this.anims.create({
            key: 'option_button_depressed',
            frames: [
                { key: 'option_button_frame3' },
                { key: 'option_button_frame2' },
                { key: 'option_button_frame1' }
            ],
            frameRate: 4,
            repeat: 0
        });

        this.add.image(this.title_x, this.title_y, 'title').setOrigin(0.5).setDepth(5).setScale(0.5);
    }

    update() {
        for (let i = 1; i <= 10; i++) {
            this[`cloud${i}`].x += this[`cloud_speed${i}`];
            this[`cloud${i}`].y += this[`cloud_speed${i}`];

            if (this[`cloud${i}`].x > 900) this[`cloud${i}`].x = -200 - (i * 20);
            if (this[`cloud${i}`].y > 600) this[`cloud${i}`].y = -200 - (i * 20);
        }

        if (this.seconds_frame_waiter === 30 && !this.secret_character_last_add) {
            this.secret_character.y += 5;
            this.secret_character_last_add = true;
            this.seconds_frame_waiter = 60;
        } else if (this.seconds_frame_waiter === 30 && this.secret_character_last_add) {
            this.secret_character.y -= 5;
            this.secret_character_last_add = false;
            this.seconds_frame_waiter = 60;
        } else {
            this.seconds_frame_waiter -= 1;
        }

        // logica pulsante Play
        if (
            this.mouse.x > this.play_button.x - this.play_button.width / 2 &&
            this.mouse.x < this.play_button.x + this.play_button.width / 2 &&
            this.mouse.y > this.play_button.y - this.play_button.height / 2 &&
            this.mouse.y < this.play_button.y + this.play_button.height / 2 &&
            !this.is_play_button_pressed
        ) {
            this.play_button.anims.play('play_button_pressed', true);
            this.is_play_button_pressed = true;
        } else if (
            (this.mouse.x < this.play_button.x - this.play_button.width / 2 ||
            this.mouse.x > this.play_button.x + this.play_button.width / 2 ||
            this.mouse.y < this.play_button.y - this.play_button.height / 2 ||
            this.mouse.y > this.play_button.y + this.play_button.height / 2) &&
            this.is_play_button_pressed
        ) {
            this.play_button.anims.play('play_button_depressed', true);
            this.is_play_button_pressed = false;
        }

        // logica pulsante Option
        if (
            this.mouse.x > this.option_button.x - this.option_button.width / 2 &&
            this.mouse.x < this.option_button.x + this.option_button.width / 2 &&
            this.mouse.y > this.option_button.y - this.option_button.height / 2 &&
            this.mouse.y < this.option_button.y + this.option_button.height / 2 &&
            !this.is_option_button_pressed
        ) {
            this.option_button.anims.play('option_button_pressed', true);
            this.is_option_button_pressed = true;
        } else if (
            (this.mouse.x < this.option_button.x - this.option_button.width / 2 ||
            this.mouse.x > this.option_button.x + this.option_button.width / 2 ||
            this.mouse.y < this.option_button.y - this.option_button.height / 2 ||
            this.mouse.y > this.option_button.y + this.option_button.height / 2) &&
            this.is_option_button_pressed
        ) {
            this.option_button.anims.play('option_button_depressed', true);
            this.is_option_button_pressed = false;
        }

        // clicca Play per andare alla scena 2
        if (
            this.mouse.x > this.play_button.x - this.play_button.width / 2 &&
            this.mouse.x < this.play_button.x + this.play_button.width / 2 &&
            this.mouse.y > this.play_button.y - this.play_button.height / 2 &&
            this.mouse.y < this.play_button.y + this.play_button.height / 2 &&
            this.mouse.isDown
        ) {
            this.scene.start('Scene2');
        }
    }
}
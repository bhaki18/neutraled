
export class Scene3 extends Phaser.Scene {

    constructor() {
        super('Scene3');

        this.map = null;
        this.tileset = null;
        this.groundLayer = null;
        this.wallsLayer = null;
        this.player = null;
        this.keys = null;
        this.playerspeed = 120;
        this.guide_text = null;
        this.guide_obj = null;
        this.npc1 = null;
        this.npc1_x = null;
        this.npc1_y = null;
        this.rect_for_textbox = null;
        this.rect_for_textbox_border = null;
        this.is_camera_moving = true;
        this.guide_text_string = [
            "eccoti qui,il tanto atteso eroe",
            "è l'ora di passare all'azione",
            "come primo passo di questa avventura ti insegnerò a neutralizzare i mostri",
            "devi sapere che ogni mostro tenterà di attaccare la tua anima",
            "il tuo obbiettivo è quello di parare i loro colpi e neutralizzarli",
            "adesso facciamo pratica"
        ];



    }

    preload() {
        this.load.setBaseURL('phasergamejam/');
        this.load.tilemapTiledJSON('map', 'assets/scene3/tile_map/map.json');
        this.load.image('tiles', 'assets/scene3/tile_map/spritesheet.png');
        this.load.image('player', 'assets/scene3/scene3_player.png');
        this.load.image('npc1', 'assets/scene3/player.png');
    }

    create() {


        // input
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            interact: 'ENTER'
        });

        // tilemap
        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('spritefusion', 'tiles');

        this.groundLayer = this.map.createLayer('ground', this.tileset, 0, 0);
        this.wallsLayer = this.map.createLayer('walls', this.tileset, 0, 0);




        // player con fisica arcade
        const spawnX = this.map.widthInPixels / 2 - 1210; // esempio posizione spawn
        const spawnY = this.map.heightInPixels / 2 + 700;

        this.player = this.physics.add.sprite(spawnX, spawnY, 'player');

        this.player.setCollideWorldBounds(false);


         if (this.registry.get('tutorial_done')){
        this.player.x = this.registry.get('player_x');
        this.player.y = this.registry.get('player_y');
         }


        // camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);

        const width = Math.max(this.groundLayer.width, this.wallsLayer.width);
        const height = Math.max(this.groundLayer.height, this.wallsLayer.height);
        this.cameras.main.setBounds(0, 0, width, height);

        // NPC

        this.npc1_x = 16 * 20;
        this.npc1_y = 16 * 79;
        this.npc1 = this.physics.add.staticSprite(this.npc1_x, this.npc1_y, 'npc1');

        this.physics.add.collider(this.player, this.npc1);


    }

    update() {


        if (this.registry.get('tutorial_done')) {
            this.playerspeed = 120;
            this.npc1.destroy();


        }

        this.moving_script();


        if (this.player.x > 16 * 12 && !this.registry.get('tutorial_done')) {

            this.playerspeed = 0;

            this.animation_script();

        }



    }



    moving_script() {

        this.player.setVelocity(0);

        if (this.keys.left.isDown) {
            this.player.setVelocityX(-this.playerspeed);
        }
        if (this.keys.right.isDown) {
            this.player.setVelocityX(this.playerspeed);
        }
        if (this.keys.up.isDown) {
            this.player.setVelocityY(-this.playerspeed);
        }
        if (this.keys.down.isDown) {
            this.player.setVelocityY(this.playerspeed);
        }

        const width = Math.max(this.groundLayer.width, this.wallsLayer.width);
        const height = Math.max(this.groundLayer.height, this.wallsLayer.height);
        const realheight = height - 957;


        if (this.player.x < 16 * 11) {
            this.player.y = Phaser.Math.Clamp(
                this.player.y,
                16 * 70 + 12,
                16 * 97 - 12
            );

            this.player.x = Phaser.Math.Clamp(
                this.player.x,
                16 * 7 + 12,
                16 * 94 - 12
            );
        }

        if (this.player.y > 16 * 88) {
            this.player.x = Phaser.Math.Clamp(
                this.player.x,
                16 * 7 + 12,
                16 * 11 - 12
            );
        }

        if (this.player.x > 16 * 11 && this.player.x < 16 * 80) {
            this.player.y = Phaser.Math.Clamp(
                this.player.y,
                16 * 70 + 12,
                16 * 88 - 12
            );
        }
        if (this.player.y > 16 * 70 && this.player.y < 16 * 88) {
            this.player.x = Phaser.Math.Clamp(
                this.player.x,
                16 * 7 + 12,
                16 * 94 - 12
            );
        }

        if (this.player.x > 16 * 94 && this.player.x < 16 * 145 && this.player.y > 16 * 42) {
            this.player.y = Phaser.Math.Clamp(
                this.player.y,
                16 * 42 + 12,
                16 * 56 - 12
            );
        }

        if (this.player.x > 16 * 80 && this.player.x < 16 * 94) {
            this.player.y = Phaser.Math.Clamp(
                this.player.y,
                16 * 42 + 12,
                16 * 88 - 12
            )
        }

        if (this.player.y < 16 * 70 && this.player.y > 16 * 56) {
            this.player.x = Phaser.Math.Clamp(
                this.player.x,
                16 * 80 + 12,
                16 * 94 - 12
            );
        }

        if (this.player.y < 16 * 56 && this.player.y > 16 * 42) {
            this.player.x = Phaser.Math.Clamp(
                this.player.x,
                16 * 80 + 12,
                16 * 157 - 12
            );
        }

        if (this.player.y > 16 * 15 && this.player.y < 16 * 42) {
            this.player.x = Phaser.Math.Clamp(
                this.player.x,
                16 * 145 + 12,
                16 * 157 - 12
            );

        }



        if (this.player.y < 16 * 15) {
            this.player.x = Phaser.Math.Clamp(
                this.player.x,
                16 * 137 + 12,
                16 * 165 - 12
            );
        }

        if (this.player.x > 16 * 145 && this.player.x < 16 * 157) {
            this.player.y = Phaser.Math.Clamp(
                this.player.y,
                16 * 4 + 12,
                16 * 56 - 12
            );
        }

        if (this.player.x > 16 * 137 && this.player.x < 16 * 145 && this.player.y < 16 * 15) {
            this.player.y = Phaser.Math.Clamp(
                this.player.y,
                16 * 4 + 12,
                16 * 15 - 12
            );
        }

        if (this.player.x > 16 * 157 && this.player.x < 16 * 165 && this.player.y < 16 * 15) {
            this.player.y = Phaser.Math.Clamp(
                this.player.y,
                16 * 4 + 12,
                16 * 15 - 12
            );
        }



    }

    animation_script() {
        this.cameras.main.stopFollow();

        this.cameras.main.pan(
            this.npc1.x,
            this.npc1.y,
            1000,          // durata in millisecondi
            'Sine.easeInOut'
        );

        if (this.is_camera_moving) {
            this.time.delayedCall(1000, () => {


                this.rect_for_textbox = this.add.rectangle(
                    this.npc1_x,
                    this.npc1_y + 100,
                    300,
                    50,
                    0x000000
                ).setOrigin(0.5).setStrokeStyle(
                    2,
                    0xffffff
                );

                this.guide_text = this.add.text(
                    this.rect_for_textbox.x,
                    this.rect_for_textbox.y,
                    this.guide_text_string[0],
                    {
                        fontSize: '20px',         // dimensione iniziale
                        color: '#ffffff',
                        align: 'center',
                        wordWrap: { width: this.rect_for_textbox.width - 20 } // padding interno
                    }
                ).setOrigin(0.5);

                this.time.delayedCall(5000, () => {
                    this.guide_text.setText(this.guide_text_string[1]);
                    this.time.delayedCall(5000, () => {
                        this.guide_text.setText(this.guide_text_string[2]).setFontSize(14);
                        this.time.delayedCall(5000, () => {
                            this.guide_text.setText(this.guide_text_string[3]);
                            this.time.delayedCall(5000, () => {
                                this.guide_text.setText(this.guide_text_string[4]);
                                this.time.delayedCall(5000, () => {
                                    this.guide_text.setText(this.guide_text_string[5]).setFontSize(20);

                                    this.time.delayedCall(5000, () => {
                                        this.registry.set('player_x', this.player.x);
                                        this.registry.set('player_y', this.player.y);
                                        this.scene.start('Scene4');
                                    });

                                });
                            });
                        });
                    });
                });




            });

        }



        this.is_camera_moving = false;




    }



}


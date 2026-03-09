export default class Scene10 extends Phaser.Scene{
    constructor(){
        super('Scene10');

        this.enterKey = null;
        this.map3 = null;
        this.tileset3 = null;
        this.groundLayer3 = null;
        this.wallsLayer3 = null;
        this.nonbody_obj_layer1 = null;
        this.player = null;
        this.playerspeed = 120;
        this.is_camera_moving = true;

    }


    preload(){

        // TILEMAP (un solo file con ground + walls)
        this.load.tilemapTiledJSON('map3', '/assets/scene10/tile_map/map.json');

        // TILESET
        this.load.image('tiles3', '/assets/scene10/tile_map/spritesheet.png');


        // PLAYER + SPRITES
        this.load.image('player', '/assets/scene3/scene3_player.png');

        this.load.image('upwalk_frame1', '/assets/scene3/scene3_upwalking_frame1.png');
        this.load.image('upwalk_frame2', '/assets/scene3/scene3_upwalking_frame2.png');
        this.load.image('upwalk_frame3', '/assets/scene3/scene3_upwalking_frame3.png');

        this.load.image('leftwalk_frame1', '/assets/scene3/scene3_leftwalking_frame1.png');
        this.load.image('leftwalk_frame2', '/assets/scene3/scene3_leftwalking_frame2.png');

        this.load.image('rightwalk_frame1', '/assets/scene3/scene3_rightwalking_frame1.png');
        this.load.image('rightwalk_frame2', '/assets/scene3/scene3_rightwalking_frame2.png');

        this.load.image('downwalk_frame2', '/assets/scene3/scene3_downwalking_frame2.png');
        this.load.image('downwalk_frame3', '/assets/scene3/scene3_downwalking_frame3.png');
    }

    create(){

        //INPUT
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });

        this.enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );

        // ===== TILEMAP =====
        this.map3 = this.make.tilemap({ key: 'map3' });

        this.tileset3 = this.map3.addTilesetImage('spritefusion', 'tiles3');

        this.groundLayer3 = this.map3.createLayer('ground', this.tileset3, 0, 0);
        this.wallsLayer3 = this.map3.createLayer('walls', this.tileset3, 0, 0);
        this.nonbody_obj_layer1 = this.map3.createLayer('nonbody_obj', this.tileset3, 0, 0);

        // ===== PLAYER =====
        const spawnX = 18 * 16 - 12;
        const spawnY = 21 * 16;

        this.player = this.physics.add.sprite(spawnX, spawnY, 'player');
        this.physics.add.collider(this.player, this.wallsLayer3);
        this.wallsLayer3.setCollisionByExclusion([-1]);
        

        // CAMERA
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, 111*16,22*16);




        // ===== ANIMAZIONI =====

        this.anims.create({
            key: 'upwalk',
            frames: [
                { key: 'upwalk_frame1' },
                { key: 'upwalk_frame2' },
                { key: 'upwalk_frame1' },
                { key: 'upwalk_frame3' }
            ],
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'leftwalk',
            frames: [
                { key: 'leftwalk_frame1' },
                { key: 'leftwalk_frame2' }
            ],
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'rightwalk',
            frames: [
                { key: 'rightwalk_frame1' },
                { key: 'rightwalk_frame2' }
            ],
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'player' },
                { key: 'downwalk_frame2' },
                { key: 'downwalk_frame3' }
            ],
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'stand',
            frames: [{ key: 'player' }],
            frameRate: 6,
            repeat: -1
        });

    }

    update(){


        this.handleMovement();
    }


    handleMovement() {

        
        if(this.player.x < 16 * 19 ){
            this.player.y = Phaser.Math.Clamp(
            this.player.y,
            18 * 16-15,
            22*16,
        )
        }else{
            this.player.y = Phaser.Math.Clamp(
            this.player.y,
            18 * 16-15,
            18 * 16 - 15,
            )
            
        }
       

        

        this.player.setVelocity(0);

        let anim = null;

        if (this.keys.up.isDown && this.is_camera_moving) {
            this.player.setVelocityY(-this.playerspeed);
            anim = 'upwalk';
        }

        if (this.keys.down.isDown && this.is_camera_moving) {
            this.player.setVelocityY(this.playerspeed);
            anim = 'walk';
        }

        if (this.keys.left.isDown && this.is_camera_moving) {
            this.player.setVelocityX(-this.playerspeed);
            anim = 'leftwalk';
        }

        if (this.keys.right.isDown && this.is_camera_moving) {
            this.player.setVelocityX(this.playerspeed);
            anim = 'rightwalk';
        }


        if (anim) {
            if (this.player.anims.currentAnim?.key !== anim) {
                this.player.anims.play(anim);
            }
        } else {
            this.player.anims.play('stand', true);
        }

        
    }
}

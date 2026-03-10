class anim extends Phaser.Scene{
    constructor(){
        super('nada')


    }



    preload(){

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




        /// ============== ANIMAZIONI PLAYER MOSTRO =========================== ////

        this.create({
            key:'monster_walk',
            frames:[
                {key:''},
            ]
        })

    }



    update(){

    }

}
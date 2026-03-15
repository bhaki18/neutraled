const fs = require('fs');

const files = [
    'c:\\Users\\angel\\Desktop\\phasergamejam\\files_js\\scene15.js',
    'c:\\Users\\angel\\Desktop\\phasergamejam\\files_js\\test and demos\\test_scene15.js'
];

for(const f of files) {
    if(!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    // 1. Change bar instantiation to setOrigin(0, 0.5) and x position
    const redBarSetup = /this\.player_hp_red_bar\s*=\s*this\.add\.rectangle\([\s\S]*?setVisible\(false\);/;
    const greenBarSetup = /this\.player_hp_green_bar\s*=\s*this\.add\.rectangle\([\s\S]*?setVisible\(false\);/;

    if (content.match(redBarSetup)) {
        content = content.replace(redBarSetup, `this.player_hp_red_bar = this.add.rectangle(
            this.player.x - (this.max_hp * 4) / 2,
            this.player.y - 20,
            this.max_hp * 4,
            5,
            0xff0000
        ).setDepth(10 - 2).setOrigin(0, 0.5).setVisible(false);`);
        changed = true;
    }

    if (content.match(greenBarSetup)) {
        content = content.replace(greenBarSetup, `this.player_hp_green_bar = this.add.rectangle(
            this.player.x - (this.max_hp * 4) / 2,
            this.player.y - 20,
            this.max_hp * 4,
            5,
            0x00ff00
        ).setDepth(10 - 2).setOrigin(0, 0.5).setVisible(false);`);
        changed = true;
    }

    // 2. Change the update logic to respect the new origin offset
    const hpBarsUpdate = /this\.player_hp_green_bar\.x\s*=\s*this\.player\.x;\s*this\.player_hp_red_bar\.x\s*=\s*this\.player\.x;/;
    if (content.match(hpBarsUpdate)) {
        content = content.replace(hpBarsUpdate, `this.player_hp_green_bar.x = this.player.x - (this.max_hp * 4) / 2;
        this.player_hp_red_bar.x = this.player.x - (this.max_hp * 4) / 2;`);
        changed = true;
    }
    
    // Tifone also needs fixed Origin so it scales from left to right correctly.
    const tGreenUpdate = /this\.tifone_hp_green_bar\.width\s*=\s*this\.tifone_hp\s*\*\s*2;/;
    if (content.match(tGreenUpdate)) {
        content = content.replace(tGreenUpdate, `this.tifone_hp_green_bar.width = this.tifone_hp * 2;
        this.tifone_hp_green_bar.geom.width = this.tifone_hp * 2;
        this.tifone_hp_green_bar.setSize(this.tifone_hp * 2, 30);
        this.tifone_hp_green_bar.updateDisplayOrigin();`);
    }

    // Tifone setup logic
    const tRedSetup = /this\.tifone_hp_red_bar\s*=\s*this\.add\.rectangle\([\s\S]*?setVisible\(false\);/;
    const tGreenSetup = /this\.tifone_hp_green_bar\s*=\s*this\.add\.rectangle\([\s\S]*?setVisible\(false\);/;
    
    if (content.match(tRedSetup)) {
        content = content.replace(tRedSetup, `this.tifone_hp_red_bar = this.add.rectangle(
            this.tifone.x - 100, // 200 hp * 2 width = 400 total. Wait, max hp is 100 for tifone, but 200 health text. Let's make it shift by 100.
            this.tifone.y,
            200,
            30,
            0xff0000
        ).setDepth(10 - 2).setOrigin(0, 0.5).setVisible(false);`);
    }

    if (content.match(tGreenSetup)) {
        content = content.replace(tGreenSetup, `this.tifone_hp_green_bar = this.add.rectangle(
            this.tifone.x - 100,
            this.tifone.y,
            200,
            30,
            0x00ff00
        ).setDepth(10 - 2).setOrigin(0, 0.5).setVisible(false);`);
    }
    
    const tBarsUpdate = /this\.tifone_hp_red_bar\.y\s*=\s*this\.tifone\.y\s*-\s*200;\s*this\.tifone_hp_green_bar\.y\s*=\s*this\.tifone\.y\s*-\s*200;/;
    if (content.match(tBarsUpdate)) {
        content = content.replace(tBarsUpdate, `this.tifone_hp_red_bar.y = this.tifone.y - 200;
        this.tifone_hp_green_bar.y = this.tifone.y - 200;
        this.tifone_hp_red_bar.x = this.tifone.x - 100;
        this.tifone_hp_green_bar.x = this.tifone.x - 100;`);
    }

    if (changed) {
        fs.writeFileSync(f, content, 'utf8');
        console.log("Patched Origin constraints in: " + f);
    }
}

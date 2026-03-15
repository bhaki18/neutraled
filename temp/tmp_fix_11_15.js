const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');
const assetsDir = path.join(__dirname, 'assets', 'sounds');

// Rename the mpeg file to mp3 to ensure Phaser audio loader doesn't drop it from cache
const oldAudio = path.join(assetsDir, 'scene15_fight_soundtrack.mpeg');
const newAudio = path.join(assetsDir, 'scene15_fight_soundtrack.mp3');
if (fs.existsSync(oldAudio)) {
    fs.renameSync(oldAudio, newAudio);
    console.log("Renamed scene15_fight_soundtrack.mpeg to .mp3");
}

function patchPreloader(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    if(content.includes('.mpeg')) {
        content = content.replace('.mpeg', '.mp3');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated Preloader .mpeg to .mp3");
    }
}
patchPreloader(path.join(dirPath, 'scene_preload.js'));

function patchScene11(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix NPC HP string to / 70
    const regex100 = /\/\s*100/g;
    content = content.replace(regex100, '/ 70');
    
    // Inject player death check in update()
    if (!content.includes("this.scene.start('SceneGameOver', { returnScene: 'Scene11' });")) {
        // find update method roughly
        const updateRegex = /update\(\s*time\s*\)\s*\{|update\(\s*\)\s*\{/g;
        content = content.replace(updateRegex, (match) => {
            return match + "\n        if (this.player_hp <= 0) {\n            this.scene.stop();\n            this.scene.start('SceneGameOver', { returnScene: 'Scene11' });\n            return;\n        }\n";
        });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Patched Scene 11 HP UI & Game Over in:", path.basename(filePath));
}

patchScene11(path.join(dirPath, 'scene11.js'));
patchScene11(path.join(testsDir, 'test_scene11.js'));

function patchScene15(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Wrap anims.create with if(!this.anims.exists)
    // There are multiple anims.create like:
    // this.anims.create({
    //     key: 'upwalk',
    // ...
    // find all this.anims.create({ key: '...', ... }) and wrap them.
    // Standardizing is easier via string replacements.
    const keys = ['upwalk', 'leftwalk', 'rightwalk', 'walk', 'stand', 'monster_upwalk', 'monster_walk', 'monster_leftwalk', 'monster_rightwalk', 'monster_stand'];
    
    for (const key of keys) {
        // Look for: this.anims.create({ \n key: 'upwalk'
        const regexCreate = new RegExp(`this\\.anims\\.create\\(\\{\\s*key:\\s*'${key}'`, 'g');
        content = content.replace(regexCreate, `if(!this.anims.exists('${key}')) this.anims.create({ key: '${key}'`);
    }

    // Fix monster_null
    // In Scene 15 update: this.player.anims.play('monster_' + String(dir) ...
    // Actually we can just do a regex for 'monster_' + String(dir)
    const regexMonsterNull = /'monster_'\s*\+\s*String\((.*?)\)/g;
    content = content.replace(regexMonsterNull, "( ($1) ? 'monster_' + String($1) : 'monster_stand' )");

    // Let's also ensure to catch standard play calls if they are direct
    const regexMonsterNull2 = /'monster_'\s*\+\s*(.*?)(?=[,)])/g;
    content = content.replace(regexMonsterNull2, "( ($1) ? 'monster_' + String($1) : 'monster_stand' )");
    
    // Quick fix for generic `dir` issues in scene 15 where dir is null
    // If there is any `if (dir !== null)` that was missed, we will just globally replace `monster_null` strings.
    // Wait, Phaser throws the error inside anims.play when the key is evaluated.
    // A better way is: replace `this.player.anims.play('monster_null', true);` (this is dynamic)
    // I am modifying the source string: `this.player.anims.play('monster_' + dir, true)`
    // to `if(dir) { this.player.anims.play('monster_' + dir, true); } else { this.player.anims.play('monster_stand', true); }`
    const regexPlayMonster = /this\.player\.anims\.play\(\s*'monster_'\s*\+\s*([^,]+),\s*true\s*\);/g;
    content = content.replace(regexPlayMonster, "if ($1) { this.player.anims.play('monster_' + $1, true); } else { this.player.anims.play('monster_stand', true); }");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Patched Scene 15 Anim Errors in:", path.basename(filePath));
}

patchScene15(path.join(dirPath, 'scene15.js'));
patchScene15(path.join(testsDir, 'test_scene15.js'));

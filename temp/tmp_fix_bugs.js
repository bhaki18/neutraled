const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function patchScene4(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // In scene 4 there is: this.guide_sprite = this.add.sprite(..., 'npc')...
    // We must replace 'npc' with 'secret_character' for that specific adding block.
    // Replace:\n            'npc'\n        ).setOrigin -> \n            'secret_character'\n        ).setOrigin
    const regex = /'npc'(\s*\)\.setOrigin)/g;
    if(content.match(regex)) {
        content = content.replace(regex, `'secret_character'$1`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched Scene 4 NPC Key in:", path.basename(filePath));
    }
}

function patchScene7(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the hardcoded hp reset: this.hp = 20; right before closed brace of create()
    const regexHpReset = /this\.hp\s*=\s*20;\s*\n\s*\}/g;
    if(content.match(regexHpReset)) {
        content = content.replace(regexHpReset, '\n    }');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Removed hardcoded HP reset in:", path.basename(filePath));
    }

    // Change damage formula from 2 * level to 4 * level
    const damageRegex = /this\.hp\s*-=\s*\(\s*2\s*\*\s*\(this\.registry\.get\('player_level'\)\s*\|\|\s*1\)/g;
    if(content.match(damageRegex)) {
        content = content.replace(damageRegex, "this.hp -= (4 * (this.registry.get('player_level') || 1)");
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Adjusted damage multiplier to 4 in:", path.basename(filePath));
    }
}

patchScene4(path.join(dirPath, 'scene4.js'));
patchScene4(path.join(testsDir, 'test_scene4.js'));

patchScene7(path.join(dirPath, 'scene7.js'));
patchScene7(path.join(testsDir, 'test_scene7.js'));

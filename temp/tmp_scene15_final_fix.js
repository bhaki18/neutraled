const fs = require('fs');
const path = require('path');

const dirs = [
    path.join(__dirname, 'files_js'),
    path.join(__dirname, 'files_js', 'test and demos')
];

function patchFile(filePath) {
    if(!fs.existsSync(filePath)) return;
    if(!filePath.endsWith('.js')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Fix global "AnimationManager key already exists" error by guarding all .create() calls
    const animRegex = /this\.anims\.create\(\s*\{\s*key:\s*'([^']+)'/g;
    if (content.match(animRegex)) {
        content = content.replace(animRegex, (match, keyStr) => {
            if (content.includes(`if(!this.anims.exists('${keyStr}'))`) || content.includes(`if (!this.anims.exists('${keyStr}'))`)) {
                return match; 
            }
            return `if (!this.anims.exists('${keyStr}')) ${match}`;
        });
        changed = true;
    }

    if (filePath.includes('scene15') || filePath.includes('Scene15')) {
        // 2. Fix Scene 15 missing Player and Boss HP Bars
        const canMoveRegex = /this\.can_player_move\s*=\s*true;/g;
        if (content.match(canMoveRegex) && !content.includes("this.player_hp_green_bar.setVisible(true);")) {
            content = content.replace(canMoveRegex, `this.can_player_move = true;
                if(this.player_hp_green_bar) this.player_hp_green_bar.setVisible(true);
                if(this.player_hp_red_bar) this.player_hp_red_bar.setVisible(true);
                if(this.tifone_hp_green_bar) this.tifone_hp_green_bar.setVisible(true);
                if(this.tifone_hp_red_bar) this.tifone_hp_red_bar.setVisible(true);`);
            changed = true;
        }

        // 3. Fix TypeError: Cannot read properties of undefined (reading 'isPlaying')
        const isPlayingRegex = /if\s*\(\s*!b\.anims\.isPlaying\s*\)/g;
        if (content.match(isPlayingRegex) && !content.includes("b.active && b.anims")) {
             content = content.replace(isPlayingRegex, `if (b && b.active && b.anims && !b.anims.isPlaying)`);
             changed = true;
        }

        // 4. Inject missing base_max_hp into the constructor
        if (!content.includes("this.base_max_hp") && content.includes("this.player_hp_max = 10;")) {
             content = content.replace("this.player_hp_max = 10;", "this.player_hp_max = 10;\n        this.base_max_hp = 10;\n        this.max_hp = 10;");
             changed = true;
        }
        
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched file via Node:", path.basename(filePath));
    }
}

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        patchFile(path.join(dir, file));
    });
});

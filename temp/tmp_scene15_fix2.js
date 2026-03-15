const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function patchScene15WidthFix(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const workingWidth = `
        const pct = this.player_hp / this.max_hp;
        let cWidth = (20 * this.base_max_hp) * pct;
        if(cWidth < 0) cWidth = 0;
        this.player_hp_green_bar.width = cWidth;
        if(this.hpTextUI) this.hpTextUI.setText(\`\${(this.player_hp>0?this.player_hp:0).toFixed(0)} / \${this.max_hp}\`);
    `;

    // The actual code is: this.player_hp_green_bar.width = this.player_hp * 4;
    const imgWidthUIUpdateRegex = /this\.player_hp_green_bar\.width\s*=\s*this\.player_hp\s*\*\s*4;/g; 
    
    if(content.match(imgWidthUIUpdateRegex)) {
        content = content.replace(imgWidthUIUpdateRegex, workingWidth);
        modified = true;
    }

    if(modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Fixed Scene 15 (* 4) width UI:", path.basename(filePath));
    }
}

patchScene15WidthFix(path.join(dirPath, 'scene15.js'));
patchScene15WidthFix(path.join(testsDir, 'test_scene15.js'));

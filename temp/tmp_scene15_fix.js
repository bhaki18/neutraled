const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function patchScene15WidthFix(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Trova l'update loop difettoso della scena 15 `this.tifone_hp_green_bar.width = this.tifone_hp * 2;`
    // e `this.player_hp_green_bar.width = this.player_hp * 20;` e li trasforma in % corretti calcolando il max
    // Nello step di prima avevo solo matchato `this.player_hp * 20` ma la scena 15 usa image width quindi non usa rect size.

    const brokenWidthRegex = /this\.player_hp_green_bar\.width\s*=\s*this\.player_hp\s*\*\s*20;/g;
    const workingWidth = `
        const pct = this.player_hp / this.max_hp;
        let cWidth = (20 * this.base_max_hp) * pct;
        if(cWidth < 0) cWidth = 0;
        this.player_hp_green_bar.width = cWidth;
        if(this.hpTextUI) this.hpTextUI.setText(\`\${this.player_hp>0?this.player_hp:0} / \${this.max_hp}\`);
    `;

    // Sblocca la win condition per scalare l'HP update!
    // Se non lo becca, la barra verde si distrugge visivamente perchè l'image .width si adatta allo scale!
    const imgWidthUIUpdateRegex = /this\.player_hp_green_bar\.width\s*=\s*this\.player_hp\s*\*\s*2;/g; // Era this.player_hp * 2 nel sorgente?
    
    if(content.match(brokenWidthRegex)) {
        content = content.replace(brokenWidthRegex, workingWidth);
        modified = true;
    }

    if(content.match(imgWidthUIUpdateRegex)) {
        content = content.replace(imgWidthUIUpdateRegex, workingWidth);
        modified = true;
    }

    if(modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Fixed Scene 15 width UI:", path.basename(filePath));
    }
}

patchScene15WidthFix(path.join(dirPath, 'scene15.js'));
patchScene15WidthFix(path.join(testsDir, 'test_scene15.js'));

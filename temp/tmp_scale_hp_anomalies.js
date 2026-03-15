const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function patchScene4(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Constructor
    if(content.match(/this\.hp\s*=\s*20;/)) {
        content = content.replace(/this\.hp\s*=\s*20;/, `this.base_max_hp = 20;\n        this.max_hp = 20;\n        this.hp = 20;`);
        modified = true;
    }

    // 2. Create (Red bar)
    const redBarRegex = /(this\.hp_bar_red\s*=\s*this\.add\.rectangle\([\s\S]*?\.setDepth\(\d+\)\.setOrigin\(0\);)/;
    const createInjection = `
        const pLevel = this.registry.get('player_level') || 1;
        this.max_hp = this.base_max_hp * pLevel;
        this.hp = this.max_hp;

        this.hpTextUI = this.add.text(
            this.hp_bar_x + 200, 
            this.hp_bar_y + 15,
            \`\${this.max_hp} / \${this.max_hp}\`,
            {
                fontFamily: 'Courier, monospace',
                fontSize: '18px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(4);
    `;
    if(content.match(redBarRegex)) {
        content = content.replace(redBarRegex, `$1\n\n${createInjection}`);
        modified = true;
    }

    // 3. Damage (hp -= 2)
    const dmgRegex = /this\.hp\s*-=\s*2;/g;
    if(content.match(dmgRegex)) {
        content = content.replace(dmgRegex, `this.hp -= (2 * (this.registry.get('player_level') || 1));`);
        modified = true;
    }

    // 4. Bar Size (setSize)
    const barRegex = /this\.hp_bar_green\.setSize\(20\s*\*\s*this\.hp,\s*30\);/g;
    const barUpdate = `
        const pct = this.hp / this.max_hp;
        let cWidth = (20 * this.base_max_hp) * pct;
        if(cWidth < 0) cWidth = 0;
        this.hp_bar_green.setSize(cWidth, 30);
        if(this.hpTextUI) this.hpTextUI.setText(\`\${this.hp>0?this.hp:0} / \${this.max_hp}\`);
    `;
    if(content.match(barRegex)) {
        content = content.replace(barRegex, barUpdate);
        modified = true;
    }

    if(modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched Scene 4:", path.basename(filePath));
    }
}

function patchScene15(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Constructor
    if(content.match(/this\.player_hp\s*=\s*20;/)) {
        content = content.replace(/this\.player_hp\s*=\s*20;/, `this.base_max_hp = 20;\n        this.max_hp = 20;\n        this.player_hp = 20;`);
        modified = true;
    }

    // 2. Create (Red bar)
    const redBarRegex = /(this\.player_hp_red_bar\s*=\s*this\.add\.image\([\s\S]*?;\s*this\.player_hp_red_bar\.setOrigin\(0,\s*0\.5\);)/;
    const createInjection = `
        const pLevel = this.registry.get('player_level') || 1;
        this.max_hp = this.base_max_hp * pLevel;
        this.player_hp = this.max_hp;

        this.hpTextUI = this.add.text(
            this.player_hp_red_bar.x + 200, 
            this.player_hp_red_bar.y,
            \`\${this.max_hp} / \${this.max_hp}\`,
            {
                fontFamily: 'Courier, monospace',
                fontSize: '18px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(4);
    `;
    if(content.match(redBarRegex)) {
        content = content.replace(redBarRegex, `$1\n\n${createInjection}`);
        modified = true;
    }

    // 3. Damage (hp -= 1)
    const dmgRegex = /this\.player_hp\s*-=\s*1;/g;
    if(content.match(dmgRegex)) {
        content = content.replace(dmgRegex, `this.player_hp -= (1 * (this.registry.get('player_level') || 1));`);
        modified = true;
    }

    // 4. UI Update
    // Trova this.player_hp_green_bar.width = this.player_hp * 20; (scene 15 usa image width)
    const uiUpdateRegex = /this\.player_hp_green_bar\.width\s*=\s*this\.player_hp\s*\*\s*20;/g;
    const uiUpdate = `
        const pct = this.player_hp / this.max_hp;
        let cWidth = (20 * this.base_max_hp) * pct;
        if(cWidth < 0) cWidth = 0;
        this.player_hp_green_bar.width = cWidth;
        if(this.hpTextUI) this.hpTextUI.setText(\`\${this.player_hp>0?this.player_hp:0} / \${this.max_hp}\`);
    `;
    if(content.match(uiUpdateRegex)) {
        content = content.replace(uiUpdateRegex, uiUpdate);
        modified = true;
    }

    if(modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched Scene 15:", path.basename(filePath));
    }
}


patchScene4(path.join(dirPath, 'scene4.js'));
patchScene4(path.join(testsDir, 'test_scene4.js'));

patchScene15(path.join(dirPath, 'scene15.js'));
patchScene15(path.join(testsDir, 'test_scene15.js'));

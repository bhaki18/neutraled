const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

// 1. RIMUOVERE LA UI DALLE SCENE 1 E 2
function removeUIFromScene(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    const uiLaunchRegex1 = /if \(!this\.scene\.isActive\('SceneUI'\)\) \{\s*this\.scene\.launch\('SceneUI'\);\s*\}\s*this\.scene\.bringToTop\('SceneUI'\);/g;
    const uiLaunchRegex2 = /if \(!this\.scene\.isActive\('SceneUI'\) && !this\.scene\.isVisible\('SceneUI'\)\) \{\s*this\.scene\.launch\('SceneUI'\);\s*\}\s*this\.scene\.bringToTop\('SceneUI'\);/g;
    
    let modified = false;
    if(content.match(uiLaunchRegex1)) {
        content = content.replace(uiLaunchRegex1, '');
        modified = true;
    }
    if(content.match(uiLaunchRegex2)) {
         content = content.replace(uiLaunchRegex2, '');
         modified = true;
    }

    if(modified) {
        // Just be safe and turn it off explicitly on Boot.
        const createRegex = /create\(\)\s*\{/;
        content = content.replace(createRegex, `create() {\n        this.scene.stop('SceneUI');\n`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Removed UI from:", path.basename(filePath));
    }
}

removeUIFromScene(path.join(dirPath, 'scene1.js'));
removeUIFromScene(path.join(dirPath, 'scene2.js'));


// 2. AGGIUNGERE GLI HP VISIVI AI NEMICI 
function addEnemyHPText(filePath, sceneNum) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Per Scene 6, 7, 9 -> nemico = 10 hit (max 20 di solito ma scende veloce). Identifichiamo la loro max hit count.
    // In scene 6: this.npc1_hp = 30;  ecc... non ce l'hanno l'hp del nemico. Muore con this.guideText...
    // Aspetta, scene 6 e 7 le win_conditions sono dettate dal timer di win_script(), non hanno HP del nemico visibile o calcolato internamente se non tramite tempo o colpi precisi!
    
    // Nelle scene 11 e 13 c'è this.npc_hp !
    if(sceneNum === '11' || sceneNum === '13') {
        // INJECTION CREATE
        const createInjection = `
        this.npcHpTextUI = this.add.text(
            this.npc_hp_bar_x + 200, 
            this.npc_hp_bar_y + 15,
            \`\${this.npc_hp} / \${this.npc_hp}\`,
            {
                fontFamily: 'Courier, monospace',
                fontSize: '18px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(4);
        `;
        const redBarRegex = /(this\.npc_hp_bar_red\s*=\s*this\.add\.rectangle\([\s\S]*?\.setDepth\(\d+\)\.setOrigin\(0\);)/;
        if(content.match(redBarRegex) && !content.includes('this.npcHpTextUI')) {
             content = content.replace(redBarRegex, `$1\n\n${createInjection}`);
             modified = true;
        }

        // INJECTION UPDATE (Damage)
        // Cerca this.npc_hp_bar_green.setSize
        const updateRegex = /(this\.npc_hp_bar_green\.setSize\(.*?,\s*30\);)/g;
        if(content.match(updateRegex) && !content.includes('npcHpTextUI.setText')) {
             content = content.replace(updateRegex, `$1\n                if(this.npcHpTextUI) this.npcHpTextUI.setText(\`\${this.npc_hp>0?this.npc_hp:0} / 100\`);`); // Assume MAX 100 as seen in scene13 constructor
             modified = true;
        }
    }

    if(sceneNum === '15') {
        const createInjection = `
        this.npcHpTextUI = this.add.text(
            this.tifone_hp_red_bar.x + 200, 
            this.tifone_hp_red_bar.y,
            \`\${this.tifone_hp} / \${this.tifone_hp}\`,
            {
                fontFamily: 'Courier, monospace',
                fontSize: '18px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(4);
        `;
        const redBarRegex = /(this\.tifone_hp_red_bar\s*=\s*this\.add\.image\([\s\S]*?this\.tifone_hp_red_bar\.setOrigin\(0,\s*0\.5\);)/;
        if(content.match(redBarRegex) && !content.includes('this.npcHpTextUI')) {
             content = content.replace(redBarRegex, `$1\n\n${createInjection}`);
             modified = true;
        }

        const updateRegex = /this\.tifone_hp_green_bar\.width\s*=\s*this\.tifone_hp\s*\*\s*2;/g;
        if(content.match(updateRegex) && !content.includes('npcHpTextUI.setText')) {
             content = content.replace(updateRegex, `$1\n        if(this.npcHpTextUI) this.npcHpTextUI.setText(\`\${this.tifone_hp>0?this.tifone_hp:0} / 200\`);`);
             modified = true;
        }
    }

    if(modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched Enemy HP UI on Scene ${sceneNum}`);
    }
}

// Applies Enemy HP UI Texts
const hpScenes = ['11', '13', '15'];
hpScenes.forEach(s => {
    addEnemyHPText(path.join(dirPath, `scene${s}.js`), s);
    addEnemyHPText(path.join(testsDir, `test_scene${s}.js`), s);
});

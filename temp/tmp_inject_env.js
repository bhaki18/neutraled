const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'files_js');
const testDir = path.join(jsDir, 'test and demos');

const forestScenes = ['scene1', 'scene2', 'scene3', 'scene4', 'scene5', 'scene12', 'scene14'];
const arenaScenes = ['scene6', 'scene7', 'scene8', 'scene9', 'scene10', 'scene11', 'scene13', 'scene15'];

function getInjectionCode(isForest) {
    if (isForest) {
        return `
        // === ENVIRONMENTAL ASSETS (FOREST) ===
        const envDepth = (this.player && this.player.depth) ? this.player.depth - 0.5 : 1;
        for (let i = 0; i < 6; i++) {
            let rx = Phaser.Math.Between(50, 750);
            let ry = Phaser.Math.Between(100, 550);
            this.add.image(rx, ry, 'Cespuglio').setDepth(envDepth).setScale(2);
        }
        for (let i = 0; i < 8; i++) {
            let rx = Phaser.Math.Between(50, 750);
            let ry = Phaser.Math.Between(100, 550);
            this.add.image(rx, ry, 'ABunchOfFlowers').setDepth(envDepth).setScale(1.5);
        }
`;
    } else {
        return `
        // === ENVIRONMENTAL ASSETS (ARENA) ===
        const envDepth = (this.player && this.player.depth) ? this.player.depth - 0.5 : 1;
        for (let i = 0; i < 5; i++) {
            let rx = Phaser.Math.Between(50, 750);
            let ry = Phaser.Math.Between(200, 550);
            this.add.image(rx, ry, 'Teschio').setDepth(envDepth).setScale(1.5);
        }
        for (let i = 0; i < 2; i++) {
            let rx = Phaser.Math.Between(100, 700);
            let ry = Phaser.Math.Between(50, 150);
            this.add.image(rx, ry, 'chebellaLANTERNA').setDepth(envDepth).setScale(2);
        }
`;
    }
}

function processFiles(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        if (!file.endsWith('.js') || file === 'game.js' || file === 'scene_gameover.js' || file === 'scene_ui.js' || file === 'scene_preload.js') continue;
        
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        
        let isForest = false;
        let isArena = false;
        
        let normalizedName = file.replace('test_', '').replace('.js', '');
        if (forestScenes.includes(normalizedName)) isForest = true;
        if (arenaScenes.includes(normalizedName)) isArena = true;
        
        if (!isForest && !isArena) continue;
        
        // 1. Inject Preloads so individual direct testing works
        const preloadRegex = /preload\(\)\s*\{/;
        if (content.match(preloadRegex) && !content.includes("load.image('Cespuglio'")) {
            const preloads = `
        this.load.image('Cespuglio', '/assets/oggetti ambientali/Cespuglio.png');
        this.load.image('ABunchOfFlowers', '/assets/oggetti ambientali/ABunchOfFlowers.png');
        this.load.image('Teschio', '/assets/oggetti ambientali/Teschio.png');
        this.load.image('chebellaLANTERNA', '/assets/oggetti ambientali/chebellaLANTERNA.png');
`;
            content = content.replace(preloadRegex, `preload() {` + preloads);
            changed = true;
        }

        // 2. Inject creation logic before update() loop
        const updateRegex = /\n\s+update\(\)\s*\{/;
        if (content.match(updateRegex) && !content.includes('ENVIRONMENTAL ASSETS')) {
            const injection = getInjectionCode(isForest);
            content = content.replace(updateRegex, injection + '\n    update() {');
            changed = true;
        }

        if(changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Injected environment logic into: ' + file);
        }
    }
}

processFiles(jsDir);
processFiles(testDir);

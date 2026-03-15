const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function patchScene7Damage(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert 4 back to 2 (2 * level 2 = 4 total damage)
    const damageRegex = /this\.hp\s*-=\s*\(\s*4\s*\*\s*\(this\.registry\.get\('player_level'\)\s*\|\|\s*1\)\s*\);/g;
    if(content.match(damageRegex)) {
        content = content.replace(damageRegex, "this.hp -= (2 * (this.registry.get('player_level') || 1));");
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Reverted Scene 7 Damage to 2 multiplier in:", path.basename(filePath));
    }
}

// Fight scenes with level ups: 6, 7, 9, 11, 13
const transitions = {
    '6': 'Scene7',
    '7': 'Scene8',
    '9': 'Scene10',
    '11': 'Scene12',
    '13': 'Scene14'
};

function injectVictoryScene(filePath, sceneNum) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let targetObj = sceneNum === '7' || sceneNum === '6' || sceneNum === '9' ? "this.scene.start" : "this.scene.start";
    const nextScene = transitions[sceneNum];
    
    // In every win_script, it typically does: this.scene.start('SceneX');
    // We want to replace it with: this.scene.start('SceneVictory', { nextScene: 'SceneX' })
    const startRegex = new RegExp(`this\\.scene\\.start\\('${nextScene}'\\);`, 'g');
    
    if(content.match(startRegex)) {
        content = content.replace(startRegex, `this.scene.start('SceneVictory', { nextScene: '${nextScene}' });`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Injected SceneVictory transition into: ${path.basename(filePath)}`);
    }
}


patchScene7Damage(path.join(dirPath, 'scene7.js'));
patchScene7Damage(path.join(testsDir, 'test_scene7.js'));

for (const [s, nextS] of Object.entries(transitions)) {
    injectVictoryScene(path.join(dirPath, `scene${s}.js`), s);
    injectVictoryScene(path.join(testsDir, `test_scene${s}.js`), s);
}

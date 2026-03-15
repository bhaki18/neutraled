const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const filesJsDir = path.join(rootDir, 'files_js');
const testsDir = path.join(filesJsDir, 'test and demos');

function processGameJs(filePath, prefix) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // add import
    if (!content.includes('import SceneUI')) {
        content = content.replace(/import SceneGameOver from .*;/g, `$& \nimport SceneUI from '${prefix}scene_ui.js';`);
    }
    
    // add to scene array
    if (!content.includes('SceneUI')) {
        content = content.replace(/SceneGameOver\]/g, "SceneGameOver, SceneUI]");
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated", filePath);
}

processGameJs(path.join(filesJsDir, 'game.js'), './');
processGameJs(path.join(testsDir, 'test_game.js'), '../');

// scene1.js
let s1Path = path.join(filesJsDir, 'scene1.js');
if (fs.existsSync(s1Path)) {
    let s1Content = fs.readFileSync(s1Path, 'utf8');
    if (!s1Content.includes("this.registry.set('player_level'")) {
        s1Content = s1Content.replace("this.registry.set('is_player_human', true);", "this.registry.set('is_player_human', true);\n        this.registry.set('player_level', 1);");
        fs.writeFileSync(s1Path, s1Content, 'utf8');
        console.log("Updated scene1.js");
    }
}

// scene3.js
let s3Path = path.join(filesJsDir, 'scene3.js');
if (fs.existsSync(s3Path)) {
    let s3Content = fs.readFileSync(s3Path, 'utf8');
    if (!s3Content.includes("this.scene.launch('SceneUI')")) {
        s3Content = s3Content.replace(/this\.player\.setTexture\('monster_player_downwalking_frame1'\);\n\s*\}/g, "$&\n\n        this.scene.launch('SceneUI');");
        fs.writeFileSync(s3Path, s3Content, 'utf8');
        console.log("Updated scene3.js");
    }
}

function updateWinScript(dir, filePrefix) {
    const scenesWithEnemies = ['6', '7', '9']; 
    
    for (const num of scenesWithEnemies) {
        const filePath = path.join(dir, `${filePrefix}${num}.js`);
        if (!fs.existsSync(filePath)) continue;
        let content = fs.readFileSync(filePath, 'utf8');
        
        let targetRegex;
        if (num === '6') targetRegex = /this\.registry\.set\('enemy1_defeated'\s*,\s*true\);/g;
        if (num === '7') targetRegex = /this\.registry\.set\('enemy2_defeated'\s*,\s*true\);/g;
        if (num === '9') targetRegex = /this\.registry\.set\('enemy3_defeated'\s*,\s*true\);/g;

        if (content.match(targetRegex) && !content.includes("this.registry.get('player_level')")) {
             content = content.replace(targetRegex, `$& \n        this.registry.set('player_level', (this.registry.get('player_level') || 1) + 1);`);
             fs.writeFileSync(filePath, content, 'utf8');
             console.log("Updated", filePath);
        }
    }
    
    const scenesOther = ['11', '13'];
    for (const num of scenesOther) {
        const filePath = path.join(dir, `${filePrefix}${num}.js`);
        if (!fs.existsSync(filePath)) continue;
        let content = fs.readFileSync(filePath, 'utf8');
        
        let targetRegex;
        if (num === '11') targetRegex = /this\.registry\.set\('scene11_npc_defeated'\s*,\s*true\);/g;
        if (num === '13') targetRegex = /this\.registry\.set\('scene13_npc_defeated'\s*,\s*true\);/g;

        if (content.match(targetRegex) && !content.includes("this.registry.get('player_level')")) {
             content = content.replace(targetRegex, `$& \n            this.registry.set('player_level', (this.registry.get('player_level') || 1) + 1);`);
             fs.writeFileSync(filePath, content, 'utf8');
             console.log("Updated", filePath);
        }
    }
}

updateWinScript(filesJsDir, 'scene');
updateWinScript(testsDir, 'test_scene');

console.log("Done.");

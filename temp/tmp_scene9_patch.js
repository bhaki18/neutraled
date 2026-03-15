const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function patchScene9Create(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // In scene 9 create() there's:
    // create() {
    //
    //     
    //     if (!this.scene.isActive('SceneUI')) {
    
    const regex = /create\(\)\s*\{/g;
    if(content.match(regex)) {
        content = content.replace(regex, `create() {\n\n        this.isBattleActive = true;\n        this.currentPhase = 0;\n        this.gravityEnabled = false;`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched Scene 9 reset variables in:", path.basename(filePath));
    }
}

patchScene9Create(path.join(dirPath, 'scene9.js'));
patchScene9Create(path.join(testsDir, 'test_scene9.js'));

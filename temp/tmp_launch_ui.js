const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function injectLaunchUI(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to insert it at the end of create() or dynamically inside create.
    // Easiest robust way using regex: 
    // Find "create() {" and insert right after.
    
    if(content.includes('this.scene.launch("SceneUI")') || content.includes("this.scene.launch('SceneUI')")) {
        return; // Already has it
    }

    const createRegex = /create\(\)\s*\{/;
    const injection = `
        if (!this.scene.isActive('SceneUI') && !this.scene.isVisible('SceneUI')) {
            this.scene.launch('SceneUI');
        }
    `;

    if(content.match(createRegex)) {
        content = content.replace(createRegex, `create() {\n${injection}\n`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Injected SceneUI launch into:", path.basename(filePath));
    }
}

const mainScenes = ['3','4','5','6','7','8','9','10','11','12','13','14','15'];
mainScenes.forEach(s => {
    injectLaunchUI(path.join(dirPath, `scene${s}.js`));
    injectLaunchUI(path.join(testsDir, `test_scene${s}.js`));
});

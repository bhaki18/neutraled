const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function patchLaunchUI(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    const oldInjection = /if \(!this\.scene\.isActive\('SceneUI'\) && !this\.scene\.isVisible\('SceneUI'\)\) \{\s*this\.scene\.launch\('SceneUI'\);\s*\}/;
    const newInjection = `
        if (!this.scene.isActive('SceneUI')) {
            this.scene.launch('SceneUI');
        }
        this.scene.bringToTop('SceneUI');
    `;

    let modified = false;

    // Se troviamo la vecchia iniezione, la rimpiazziamo
    if(content.match(oldInjection)) {
        content = content.replace(oldInjection, newInjection);
        modified = true;
    } else {
        // Se non c'è, magari l'avevamo messa diversamente? 
        // Cerchiamo la funzione create() {
        const createRegex = /create\(\)\s*\{/;
        if(content.match(createRegex) && !content.includes("bringToTop('SceneUI')")) {
             content = content.replace(createRegex, `create() {\n${newInjection}\n`);
             modified = true;
        }
    }

    if(modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched bringToTop in:", path.basename(filePath));
    }
}

const mainScenes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];
mainScenes.forEach(s => {
    patchLaunchUI(path.join(dirPath, `scene${s}.js`));
    patchLaunchUI(path.join(testsDir, `test_scene${s}.js`));
});

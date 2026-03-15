const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'files_js');

function stripPreloads(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        if (!file.endsWith('.js') || file.includes('game.js') || file.includes('scene_ui.js') || file.includes('scene_gameover.js') || file.includes('scene_preload.js') || file.includes('scene_victory.js') || file.includes('scene_gamewin.js')) {
            continue;
        }
        
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // Strip the entire preload block from the main game scenes
        // We look for preload() { ... } before create()
        
        // A robust but simple regex to find the preload method and everything inside it up until create()
        // Note: JS regex dotall flag (s) allows . to match newlines
        const preloadBlockRegex = /\n\s+preload\(\)\s*\{[\s\S]*?(?=\n\s+create\(\)\s*\{)/g;
        
        if (content.match(preloadBlockRegex)) {
            content = content.replace(preloadBlockRegex, '\n\n    ');
            changed = true;
        }

        if(changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Stripped legacy preload block from: ' + file);
        }
    }
}

// We only strip from main live game files (files_js) to ensure index.html runs cleanly out of scene_preload.js
// Test scenes (in files_js/test and demos) will keep their local preload() routines because 
// they are booted completely independently without scene_preload attached to test.html.
stripPreloads(jsDir);

// Actually, wait, test.html uses test_game.js. 
// We should update game.js to explicitly ensure 'ScenePreload' is the first scene.
const gameJSPath = path.join(jsDir, 'game.js');
let gameContent = fs.readFileSync(gameJSPath, 'utf8');
if (!gameContent.includes("import ScenePreload")) {
    gameContent = `import ScenePreload from './scene_preload.js';\n` + gameContent;
    
    // Inject ScenePreload at the very start of the array
    gameContent = gameContent.replace(/scene:\s*\[/, "scene: [\n        ScenePreload,");
    fs.writeFileSync(gameJSPath, gameContent, 'utf8');
    console.log("Injected ScenePreload into game.js boot array.");
}

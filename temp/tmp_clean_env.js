const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'files_js');
const testDir = path.join(__dirname, 'files_js', 'test and demos');

// Targets identified by the user to be cleaned:
const targets = [
    'scene4.js', 'scene6.js', 'scene7.js', 'scene9.js', 'scene11.js', 'scene13.js',
    'test_scene4.js', 'test_scene6.js', 'test_scene7.js', 'test_scene9.js', 'test_scene11.js', 'test_scene13.js'
];

function cleanseEnvironment(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        if (!targets.includes(file)) continue;
        
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // Regex to capture the environmental assets block (either FOREST or ARENA)
        // Format: // === ENVIRONMENTAL ASSETS... through the closing bracket of the loops.
        // It's usually placed right at the end of create()
        const envBlockRegex = /\s*\/\/\s*===\s*ENVIRONMENTAL ASSETS[\s\S]*?(?=\n\s+update\(\)\s*\{|\s*\}\s*update\(\)\s*\{)/g;
        
        if (content.match(envBlockRegex)) {
            content = content.replace(envBlockRegex, '');
            changed = true;
        }

        // Just in case the block was trapped right at the end of create
        const envBlockAlternative = /\s*\/\/\s*===\s*ENVIRONMENTAL ASSETS[\s\S]*?(?=\s*\n\s*\})/g;
        if(content.match(envBlockAlternative)) {
             content = content.replace(envBlockAlternative, '');
             changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Cleansed environmental assets from: ' + file);
        } else {
            console.log('No environmental assets found in: ' + file);
        }
    }
}

cleanseEnvironment(jsDir);
cleanseEnvironment(testDir);

const fs = require('fs');
const path = require('path');

const dir1 = path.join(__dirname, 'files_js');
const dir2 = path.join(__dirname, 'files_js', 'test and demos');

function purgeEnvironment(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        if (!file.endsWith('.js')) continue;
        
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // Strip the block dynamically parsing between the comment and the next method declaration (usually update())
        const envBlockRegex = /\s*\/\/\s*===\s*ENVIRONMENTAL ASSETS[\s\S]*?(?=\n\s+update\(\)\s*\{|\s*\}\s*update\(\)\s*\{)/g;
        if (content.match(envBlockRegex)) {
            content = content.replace(envBlockRegex, '');
            changed = true;
        }

        // Just in case it was trapped right at the end of the file/class body without an update method nearby
        const envBlockAlternative = /\s*\/\/\s*===\s*ENVIRONMENTAL ASSETS[\s\S]*?(?=\s*\n\s*\})/g;
        if(content.match(envBlockAlternative)) {
             content = content.replace(envBlockAlternative, '');
             changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('PURGED environmental assets from: ' + file);
        }
    }
}

purgeEnvironment(dir1);
purgeEnvironment(dir2);
console.log('Sweep Complete.');

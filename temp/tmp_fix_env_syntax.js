const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'files_js');
const testDir = path.join(__dirname, 'files_js', 'test and demos');

function fixSyntax(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        if (!file.endsWith('.js')) continue;
        
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // The faulty injection placed the ENVIRONMENTAL ASSETS block *after* the closing brace of create()
        // Example:
        //    }
        //        // === ENVIRONMENTAL ASSETS...
        //        ... code ...
        //    update() {
        
        // We capture the closing brace `}` and the entire ENVIRONMENTAL block until `update() {`
        // Then we move the environmental block *inside* the create function, placing the `}` after it.
        const syntaxRegex = /\}\s*(\/\/\s*===\s*ENVIRONMENTAL ASSETS[\s\S]*?)(?=\s+update\(\)\s*\{)/g;
        
        if (content.match(syntaxRegex)) {
            content = content.replace(syntaxRegex, "$1\n    }");
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed syntax error in: ' + file);
        }
    }
}

fixSyntax(jsDir);
fixSyntax(testDir);

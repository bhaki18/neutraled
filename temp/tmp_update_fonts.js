const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const filesJsDir = path.join(rootDir, 'files_js');

function processFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processFiles(fullPath);
        } else if (fullPath.endsWith('.js') && file !== 'scene_gameover.js') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Dobbiamo iniettare stroke: e fontFamily: in ogni add.text(..., { config })
            // Siccome alcuni non hanno `{ config }` (es. dialogueBox o roba del genere), cerchiamo solo le graffe dei config
            
            // Per beccare strutture come:
            // {
            //      fontSize: '16px',
            //      color: '#ffffff',
            // Dobbiamo inserire dopo color o fontSize.  
            
            // Semplicemente, troviamo pattern "color:" o "fontSize:" nei file js e aggiungiamo le nostre linee

            const regexColor = /(color:\s*['"][#\w]+['"],?)/g;
            if (regexColor.test(content)) {
                content = content.replace(regexColor, `$1 \n            fontFamily: 'Courier, monospace',\n            stroke: '#000000',\n            strokeThickness: 4,`);
                modified = true;
            } else {
                const regexFontSize = /(fontSize:\s*['"]\d+px['"],?)/g;
                if (regexFontSize.test(content)) {
                    content = content.replace(regexFontSize, `$1 \n            fontFamily: 'Courier, monospace',\n            stroke: '#000000',\n            strokeThickness: 4,`);
                    modified = true;
                }
            }
            
            // Attenzione alla classe test_scene15 che magari ha stringhe senza style object. 
            // In quei casi Phaser usa il default. Non modificherò scene.js se non c'è config object

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated fonts in ${file}`);
            }
        }
    }
}

processFiles(filesJsDir);


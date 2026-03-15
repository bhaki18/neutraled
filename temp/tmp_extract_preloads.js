const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');

// Helper to extract the content inside preload() { ... }
function extractPreloads(filepath) {
    if (!fs.existsSync(filepath)) return "";
    const content = fs.readFileSync(filepath, 'utf8');
    
    // We try to match: preload() { ... }
    const preloadRegex = /preload\(\)\s*\{([\s\S]*?)\n\s*create\(\)\s*\{/i;
    const match = content.match(preloadRegex);
    if (match && match[1]) {
        return `// From ${path.basename(filepath)}\n${match[1].trim()}`;
    }
    return "";
}

let allPreloads = "";
const mainfiles = fs.readdirSync(dirPath).filter(f => f.startsWith('scene') && f.endsWith('.js'));
for(const f of mainfiles) {
    const extracted = extractPreloads(path.join(dirPath, f));
    if(extracted) {
        allPreloads += extracted + "\n\n";
    }
}

// Write the aggregated preloads to a preview file
fs.writeFileSync(path.join(__dirname, 'tmp_extracted_preloads.txt'), allPreloads, 'utf8');
console.log("Extracted all preloads to tmp_extracted_preloads.txt");

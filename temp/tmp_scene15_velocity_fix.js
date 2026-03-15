const fs = require('fs');

const files = [
    'c:\\Users\\angel\\Desktop\\phasergamejam\\files_js\\scene15.js',
    'c:\\Users\\angel\\Desktop\\phasergamejam\\files_js\\test and demos\\test_scene15.js'
];

for(const f of files) {
    if(!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    const tifoneRegex = /this\.tifone\.setVelocityY\(30\);\s*if\s*\(\s*this\.tifone\.y\s*>\s*600\s*\)\s*\{\s*this\.tifone\.destroy\(\);\s*\}/;

    if (content.match(tifoneRegex)) {
        content = content.replace(tifoneRegex, `if (this.tifone && this.tifone.active) {
            this.tifone.setVelocityY(30);
            if (this.tifone.y > 600) {
                this.tifone.destroy();
                this.tifone = null;
            }
        }`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(f, content, 'utf8');
        console.log("Patched setVelocityY crash in: " + f);
    } else {
        console.log("No match found in: " + f);
    }
}

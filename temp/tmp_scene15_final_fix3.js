const fs = require('fs');

const files = [
    'c:\\Users\\angel\\Desktop\\phasergamejam\\files_js\\scene15.js',
    'c:\\Users\\angel\\Desktop\\phasergamejam\\files_js\\test and demos\\test_scene15.js'
];

for(const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    const regex = /this\.player_hp\s*=\s*this\.player_hp_max;\s*this\.tifone_hp\s*=\s*this\.tifone_hp_max;/;
    
    if (content.match(regex)) {
        content = content.replace(regex, `const pLevel = this.registry.get('player_level') || 1;
        this.base_max_hp = 10;
        this.max_hp = this.base_max_hp * pLevel;
        this.player_hp = this.max_hp;
        this.tifone_hp = this.tifone_hp_max;`);
        fs.writeFileSync(f, content, 'utf8');
        console.log("Patched " + f);
    } else {
        console.log("Regex did not match in " + f);
    }
}

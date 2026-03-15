const fs = require('fs');
const path = require('path');

const filePaths = [
    path.join(__dirname, 'files_js', 'scene15.js'),
    path.join(__dirname, 'files_js', 'test and demos', 'test_scene15.js')
];

for (const filePath of filePaths) {
    if(!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Inject HP scaling variables properly
    const hpMaxRegex = /this\.player_hp_max\s*=\s*10;/;
    if (content.match(hpMaxRegex) && !content.includes("this.base_max_hp")) {
        content = content.replace(hpMaxRegex, `this.player_hp_max = 10;
        this.base_max_hp = 10;
        this.max_hp = 10;`);
    }

    // Replace the HP scaling logic to correctly use setSize for Phase 3 Rectangles
    // Find:
    // const pct = this.player_hp / this.max_hp;
    // let cWidth = (20 * this.base_max_hp) * pct;
    // if(cWidth < 0) cWidth = 0;
    // this.player_hp_green_bar.width = cWidth;
    const hpLogicRegex = /const pct = this\.player_hp \/ this\.max_hp;\s*let cWidth = \([\s\S]*?this\.player_hp_green_bar\.width = cWidth;/g;
    if (content.match(hpLogicRegex)) {
        content = content.replace(hpLogicRegex, `
        const pLevel = this.registry.get('player_level') || 1;
        this.max_hp = this.base_max_hp * pLevel;

        const pct = this.player_hp / this.max_hp;
        let cWidth = (4 * this.max_hp) * pct; // Match constructor multiplier (this.player_hp * 4)
        if(cWidth < 0) cWidth = 0;
        this.player_hp_green_bar.width = cWidth; 
        this.player_hp_green_bar.geom.width = cWidth;
        this.player_hp_green_bar.setSize(cWidth, 5);
        this.player_hp_green_bar.updateDisplayOrigin();`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Patched valid HP bounds and setSize rendering in:", path.basename(filePath));
}

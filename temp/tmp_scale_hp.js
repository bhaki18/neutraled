const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const filesJsDir = path.join(rootDir, 'files_js');
const testsDir = path.join(filesJsDir, 'test and demos');

function processScene(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Modifica la logica del constructor
    // Convertiamo this.hp = 20; in this.base_max_hp = 20; this.max_hp = 20; this.hp = 20;
    // (Oppure this.player_hp = 20;)
    if (content.match(/this\.hp\s*=\s*20;/)) {
        content = content.replace(/this\.hp\s*=\s*20;/, `this.base_max_hp = 20;\n        this.max_hp = 20;\n        this.hp = 20;`);
        modified = true;
    } else if (content.match(/this\.player_hp\s*=\s*20;/)) {
        content = content.replace(/this\.player_hp\s*=\s*20;/, `this.base_max_hp = 20;\n        this.max_hp = 20;\n        this.player_hp = 20;`);
        modified = true;
    }

    // 2. Modifica la logica nel create()
    // Troviamo dove viene creato this.hpBarGreen e la modifichiamo
    // Assumiamo che abbia una struct tipica: this.hpBarGreen = this.add.rectangle(...) o this.player_hp_bar_green

    const createInjection = `
        const pLevel = this.registry.get('player_level') || 1;
        this.max_hp = this.base_max_hp * pLevel;
        if(typeof this.hp !== 'undefined') this.hp = this.max_hp;
        if(typeof this.player_hp !== 'undefined') this.player_hp = this.max_hp;

        this.hpTextUI = this.add.text(
            200 + (20 * this.base_max_hp)/2, 
            550 + 15,
            \`\${this.max_hp} / \${this.max_hp}\`,
            {
                fontFamily: 'Courier, monospace',
                fontSize: '18px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(4);
    `;

    // Cerchiamo la creazione del rettangolo verde. Es: "this.hpBarGreen = this.add.rectangle(...);"
    // O "this.hp_bar_green = ..." 
    // O "this.player_hp_bar_green = ..."
    // E inseriamo il payload subito sotto al red bar (cosi siamo sicuri)
    const redBarRegex1 = /(this\.hpBarRed\s*=\s*this\.add\.rectangle\([\s\S]*?\.setDepth\(\d+\);)/;
    const redBarRegex2 = /(this\.hp_bar_red\s*=\s*this\.add\.rectangle\([\s\S]*?\.setDepth\(\d+\)\.setOrigin\(0\);)/;
    const redBarRegex3 = /(this\.player_hp_bar_red\s*=\s*this\.add\.rectangle\([\s\S]*?\.setDepth\(\d+\)\.setOrigin\(0\);)/;

    if (content.match(redBarRegex1)) {
        content = content.replace(redBarRegex1, `$1\n\n${createInjection}`);
        modified = true;
    } else if (content.match(redBarRegex2)) {
        content = content.replace(redBarRegex2, `$1\n\n${createInjection}`);
        modified = true;
    } else if (content.match(redBarRegex3)) {
         content = content.replace(redBarRegex3, `$1\n\n${createInjection}`);
         modified = true;
    }

    // 3. Modifica la logica del Damage (-= 2)
    // Sostituiamo tutte le istanze con proporzioni e percentuali

    const damageRegexHP = /this\.hp\s*-=\s*2;/g;
    const damageRegexPHP = /this\.player_hp\s*-=\s*2;/g;

    const barRegexGreen = /this\.hpBarGreen\.setSize\(20\s*\*\s*this\.hp,\s*30\);/g;
    const barRegexGreen2 = /this\.hp_bar_green\.setSize\(20\s*\*\s*this\.hp,\s*30\);/g;
    const barRegexPGreen = /this\.player_hp_bar_green\.setSize\(20\s*\*\s*this\.player_hp,\s*30\);/g;


    if (content.match(damageRegexHP)) {
        content = content.replace(damageRegexHP, `this.hp -= (2 * (this.registry.get('player_level') || 1));`);
        modified = true;
    }
    if (content.match(damageRegexPHP)) {
        content = content.replace(damageRegexPHP, `this.player_hp -= (2 * (this.registry.get('player_level') || 1));`);
        modified = true;
    }

    // SOSTITUZIONE LARGHEZZA BARRA VERDE (400px maximum)
    const barUpdateInjectionHP1 = `
        const pct = this.hp / this.max_hp;
        let cWidth = (20 * this.base_max_hp) * pct;
        if(cWidth < 0) cWidth = 0;
        this.hpBarGreen.setSize(cWidth, 30);
        if(this.hpTextUI) this.hpTextUI.setText(\`\${this.hp>0?this.hp:0} / \${this.max_hp}\`);
    `;

    const barUpdateInjectionHP2 = `
        const pct = this.hp / this.max_hp;
        let cWidth = (20 * this.base_max_hp) * pct;
        if(cWidth < 0) cWidth = 0;
        this.hp_bar_green.setSize(cWidth, 30);
        if(this.hpTextUI) this.hpTextUI.setText(\`\${this.hp>0?this.hp:0} / \${this.max_hp}\`);
    `;

    const barUpdateInjectionPHP = `
        const pct = this.player_hp / this.max_hp;
        let cWidth = (20 * this.base_max_hp) * pct;
        if(cWidth < 0) cWidth = 0;
        this.player_hp_bar_green.setSize(cWidth, 30);
        if(this.hpTextUI) this.hpTextUI.setText(\`\${this.player_hp>0?this.player_hp:0} / \${this.max_hp}\`);
    `;


    if (content.match(barRegexGreen)) {
        content = content.replace(barRegexGreen, barUpdateInjectionHP1);
        modified = true;
    }
    if (content.match(barRegexGreen2)) {
         content = content.replace(barRegexGreen2, barUpdateInjectionHP2);
         modified = true;
    }
    if (content.match(barRegexPGreen)) {
         content = content.replace(barRegexPGreen, barUpdateInjectionPHP);
         modified = true;
    }


    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Scaled UI on:", path.basename(filePath));
    }
}

const scenes = ['4','6','7','8','9','11','13'];
for(const s of scenes) {
    processScene(path.join(filesJsDir, `scene${s}.js`));
    processScene(path.join(testsDir, `test_scene${s}.js`));
}

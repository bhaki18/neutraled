const fs = require('fs');

const file = 'c:\\Users\\angel\\Desktop\\phasergamejam\\files_js\\scene1.js';
let content = fs.readFileSync(file, 'utf8');

const target = /this\.scene\.start\('Scene2'\);\s*\}/g;

const injection = `this.scene.start('Scene2');
        }

        // clicca Option per lanciare la Multiplayer Arena
        if (
            this.mouse.x > this.option_button.x - this.option_button.width / 2 &&
            this.mouse.x < this.option_button.x + this.option_button.width / 2 &&
            this.mouse.y > this.option_button.y - this.option_button.height / 2 &&
            this.mouse.y < this.option_button.y + this.option_button.height / 2 &&
            this.mouse.isDown
        ) {
            window.location.href = 'http://localhost:5173';
        }`;

if (content.match(target)) {
    content = content.replace(target, injection);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully injected multiplayer redirect logic into scene1.js');
} else {
    console.log('Target not found in scene1.js');
}

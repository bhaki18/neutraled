const fs = require('fs');
const files = [
    './files_js/scene_preload.js',
    './files_js/test and demos/animation_sprites.js'
];
files.forEach(file => {
    try {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            content = content.replace(/'\/assets\//g, "'assets/");
            content = content.replace(/"\/assets\//g, '"assets/');
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(e);
    }
});

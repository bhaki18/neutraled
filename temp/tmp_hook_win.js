const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files_js');
const testsDir = path.join(dirPath, 'test and demos');

function patchSceneWin(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the abruptly ending dialogue loop with the state-managed listener
    const regex = /const dialogueBox = this\.add\.rectangle\(400,300,700,200,0x000000\)\.setOrigin\(0\.5\);[\s\S]*const dialogue_text_obj = this\.add\.text\(400,300,dialogue_text\[index_dialogue\]\);/g;
    
    const replacement = `if (!this.dialogueStarted) {
                    this.dialogueStarted = true;
                    
                    const dialogueBox = this.add.rectangle(400,300,700,200,0x000000).setOrigin(0.5).setDepth(15);
                    const dialogueBox_border = this.add.rectangle(400,300,680,180).setStrokeStyle(2, 0xffffff).setOrigin(0.5).setDepth(16);
                    const dialogue_text = [
                        'oh mio eroe',
                        'sei troppo aura',
                        'menomale che ci sei tu',
                        'ti amo',
                        ...((this.registry.get('is_player_human') === false) ? ['(sei un mostro ma per me sei okay)'] : [])
                    ];

                    let index_dialogue = 0;
                    
                    const dialogue_text_obj = this.add.text(400,300,dialogue_text[index_dialogue], {
                        fontFamily: 'Courier, monospace',
                        fontSize: '32px',
                        color: '#ffffff',
                        stroke: '#000000',
                        strokeThickness: 4,
                        align: 'center'
                    }).setOrigin(0.5).setDepth(17);
                    
                    this.input.keyboard.on('keydown-ENTER', () => {
                        index_dialogue++;
                        if (index_dialogue < dialogue_text.length) {
                            dialogue_text_obj.setText(dialogue_text[index_dialogue]);
                        } else {
                            this.scene.start('SceneGameWin');
                        }
                    });
                }`;

    if(content.match(regex)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched Scene 15 dialogue trigger to SceneGameWin in:", path.basename(filePath));
    } else {
        console.log("Regex did not match for:", path.basename(filePath));
    }
}

// Add import block for SceneGameWin into game.config files
function patchGameConfig(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Add import statement natively
    if(!content.includes('SceneGameWin')) {
        let importString = "import SceneGameWin from './scene_gamewin.js';\nimport SceneUI from './scene_ui.js';";
        if (filePath.includes('test_game')) {
            importString = "import SceneGameWin from '../scene_gamewin.js';\nimport SceneUI from '../scene_ui.js';";
        }
        
        let targetImport = "import SceneUI from './scene_ui.js';";
        if (filePath.includes('test_game')) {
            targetImport = "import SceneUI from '../scene_ui.js';";
        }
        
        content = content.replace(targetImport, importString);

        // Inject SceneGameWin directly BEFORE SceneUI in the Scene configs array
        content = content.replace(/SceneUI\]/g, "SceneGameWin,SceneUI]");
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Injected SceneGameWin array configs into:", path.basename(filePath));
    }
}

patchSceneWin(path.join(dirPath, 'scene15.js'));
patchSceneWin(path.join(testsDir, 'test_scene15.js'));

patchGameConfig(path.join(dirPath, 'game.js'));
patchGameConfig(path.join(testsDir, 'test_game.js'));

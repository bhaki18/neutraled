const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, 'files_js', 'scene15.js'),
    path.join(__dirname, 'files_js', 'test and demos', 'test_scene15.js')
];

for(const f of files) {
    if(!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    // 1. Clear all attacks in is_ending_animation
    const endingAnimRegex = /is_ending_animation\(\)\s*\{\s*this\.tifone\.setVelocityY\(30\);/g;
    if (content.match(endingAnimRegex)) {
        content = content.replace(endingAnimRegex, `is_ending_animation() {
        if(this.tifone_fireball_attacks) this.tifone_fireball_attacks.clear(true, true);
        if(this.tifone_wind_attacks) this.tifone_wind_attacks.clear(true, true);
        if(this.tifone_wave_attack) this.tifone_wave_attack.clear(true, true);
        if(this.tifone_wave2_attack) this.tifone_wave2_attack.clear(true, true);
        if(this.tifone_lighting_attack) this.tifone_lighting_attack.clear(true, true);
        if(this.tifone_laser_attack) this.tifone_laser_attack.clear(true, true);
        if(this.tifone_lateral_wave_attack) this.tifone_lateral_wave_attack.clear(true, true);
        if(this.tifone_falling_clouds_attack) this.tifone_falling_clouds_attack.clear(true, true);
        this.tifone.setVelocityY(30);`);
        changed = true;
    }

    // 2. Reduce hitboxes (add setSize chains)
    // fireball
    const fireballRegex = /this\.tifone_fireball_attacks\.create\(([^)]*)\)(?!.*?setSize)/g;
    if (content.match(fireballRegex)) {
        content = content.replace(fireballRegex, `this.tifone_fireball_attacks.create($1).setSize(15, 15)`);
        changed = true;
    }

    // wind
    const windRegex = /this\.tifone_wind_attacks\.create\(([^)]*)\)(?!.*?setSize)/g;
    if (content.match(windRegex)) {
        content = content.replace(windRegex, `this.tifone_wind_attacks.create($1).setSize(20, 20)`);
        changed = true;
    }

    // waves (1 and 2)
    const waveRegex = /this\.tifone_wave_attack\.create\(([^)]*)\)(?!.*?setSize)/g;
    if (content.match(waveRegex)) {
        content = content.replace(waveRegex, `this.tifone_wave_attack.create($1).setSize(30, 30)`);
        changed = true;
    }
    const wave2Regex = /this\.tifone_wave2_attack\.create\(([^)]*)\)(?!.*?setSize)/g;
    if (content.match(wave2Regex)) {
        content = content.replace(wave2Regex, `this.tifone_wave2_attack.create($1).setSize(30, 30)`);
        changed = true;
    }

    // lighting
    const lightingRegex = /this\.tifone_lighting_attack\.create\(([^)]*)\)(?!.*?setSize)/g;
    if (content.match(lightingRegex)) {
        content = content.replace(lightingRegex, `this.tifone_lighting_attack.create($1).setSize(10, 40)`);
        changed = true;
    }

    // laser
    const laserRegex = /this\.tifone_laser_attack\.create\(([^)]*)\)(?!.*?setSize)/g;
    if (content.match(laserRegex)) {
        content = content.replace(laserRegex, `this.tifone_laser_attack.create($1).setSize(20, 10)`);
        changed = true;
    }
    
    // lateral wave
    const lateralRegex = /this\.tifone_lateral_wave_attack\.create\(([^)]*)\)(?!.*?setSize)/g;
    if (content.match(lateralRegex)) {
        content = content.replace(lateralRegex, `this.tifone_lateral_wave_attack.create($1).setSize(25, 25)`);
        changed = true;
    }

    // falling clouds
    const cloudsRegex = /this\.tifone_falling_clouds_attack\.create\(([^)]*)\)(?!.*?setSize)/g;
    if (content.match(cloudsRegex)) {
        content = content.replace(cloudsRegex, `this.tifone_falling_clouds_attack.create($1).setSize(20, 20)`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(f, content, 'utf8');
        console.log("Patched Hitboxes and Clear Animations for:", path.basename(f));
    }
}

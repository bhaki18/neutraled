const fs = require('fs');

const files = [
    'c:\\Users\\angel\\Desktop\\phasergamejam\\assets\\scene10\\enemy4_frame1.png',
    'c:\\Users\\angel\\Desktop\\phasergamejam\\assets\\scene15\\tifone_onde_laterali_frame1.png',
    'c:\\Users\\angel\\Desktop\\phasergamejam\\assets\\scene15\\tifone_tornado.png',
    'c:\\Users\\angel\\Desktop\\phasergamejam\\assets\\scene5\\enemy2_frame1.png',
    'c:\\Users\\angel\\Desktop\\phasergamejam\\assets\\scene5\\npc1_frame1.png'
];

files.forEach(file => {
    try {
        const data = fs.readFileSync(file);
        // IHDR chunk
        const width = data.readUInt32BE(16);
        const height = data.readUInt32BE(20);
        console.log(`${file}: ${width}x${height}`);
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

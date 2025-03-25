const fs = require('fs');

const content = fs.readFileSync('style.css').toString();
const css = content.split('@layer components{')[1].split('}}')[0] + '}';

fs.existsSync('dist') || fs.mkdirSync('dist');
fs.writeFileSync('dist/style.min.css', css);
fs.rmSync('style.css');

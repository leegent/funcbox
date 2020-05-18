const fs = require('fs');

console.log('Start processing html...');
const distHtml = fs.readFileSync('./dist/index.html', {encoding: 'utf8'});
const processedHtml = distHtml
    .replace('<title>function-box</title>', '<title>Function Box</title>')
    .replace(/href=\//g, 'href=')
    .replace(/src=\//g, 'src=');

fs.writeFileSync('./dist/index.html', processedHtml, {encoding: 'utf8'});

console.log('Done.');

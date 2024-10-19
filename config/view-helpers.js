const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            return '/' + filePath;
        }
        const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')));
        const hashedFilePath = manifest[filePath];
        if (hashedFilePath) {
            return '/assets/' + hashedFilePath;
        } else {
            console.error('File not found', filePath);
            return filePath;
        }
    }
}
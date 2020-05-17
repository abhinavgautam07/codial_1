const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = function(app) {

    app.locals.asset_path = function(filePath) {
        console.log(filePath);
        console.log(path.join(__dirname, '../public/assets/rev-manifest.json'))
        if (env.name == 'development') {
            return filePath;
        }
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}
var path = require('path');
var rootPath = path.normalize(__dirname + './../../../');

module.exports = function() {
    let client = 'src/client/';

    return {
        development: {
            db: 'mongodb://localhost/blog',
            rootPath: rootPath + 'src/',
            client: rootPath + client,
            port: process.env.PORT || 7203,
            photosFolder: 'photos/'
        },
        build: {
            db: 'mongodb://localhost/blog',
            rootPath: rootPath + 'build/',
            client: rootPath + 'build/',
            port: process.env.PORT || 3000,
            photosFolder: 'photos/'
        }
    }
}
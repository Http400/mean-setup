const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

const config = require('./config/config')()[environment];
const port = config.port;

app.use(favicon(__dirname + '/favicon.ico'));
console.log('favicon: ' + __dirname + '/favicon.ico');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());
app.use(morgan('dev'));
app.use(cors());

require('./config/mongoose')(config);
require('./config/routes')(app, config);

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});

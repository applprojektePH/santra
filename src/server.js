let path = require('path');
let express = require('express');
let app = express();
let server = require('http').Server(app);
let CONSTANTS = require("./libs/constants");
let models = null;
const helmet = require('helmet');
app.set('port', CONSTANTS.SETTINGS.WEB.PORT);
//// template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.pretty = true; // force pretty html output
app.use('/jquery', express.static(path.join(__dirname, CONSTANTS.PATHS.JQUERY)));
app.use('/d3', express.static(path.join(__dirname, CONSTANTS.PATHS.D3)));
app.use('/bootstrap', express.static(path.join(__dirname, CONSTANTS.PATHS.BOOTSTRAP)));
app.use('/static',express.static(path.join(__dirname, CONSTANTS.PATHS.STATIC)));
app.use(helmet({contentSecurityPolicy: false}));

// load routes last!
require('./routes')(app, models);

server.listen(app.get('port'));
console.log('server listening on port ' + app.get('port'));

let path = require('path');
let express = require('express');
let app = express();
let server = require('http').Server(app);
let CONSTANTS = require("./libs/constants");
let models = null;
const helmet = require('helmet');
/*
const { Shibboleth } = require("shibboleth");

const shib = new Shibboleth(process.env.SHIBBOLETHURL);
console.log(shib.hasShibSessionInfo(req, headers));
const {
    passport,
} = require('./config');
//setup environment
// port

var SamlStrategy = require('passport-saml').Strategy;
passport.use(new SamlStrategy(
    {
        path: '/login/callback',
        entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
        issuer: 'passport-saml',
        cert: 'MIID/DCCAmSgAwIBAgIUddb9lD8CxrTt7qC8hoJAeY6IpFAwDQYJKoZIhvcNAQEL\n' +
            'BQAwGTEXMBUGA1UEAxMOc2FudHJhLnBoLmZobncwHhcNMjExMTE3MTQ0NDQ2WhcN\n' +
            'MzExMTE1MTQ0NDQ2WjAZMRcwFQYDVQQDEw5zYW50cmEucGguZmhudzCCAaIwDQYJ\n' +
            'KoZIhvcNAQEBBQADggGPADCCAYoCggGBAKh1lz31kQpbUF5R7g6NEEqPM1pvJm0J\n' +
            '1QqYuZzG2ILCgJmc9VZMPbNwDST42tA9zpVdpczk2bg0szNpr4Mnif13o2rs+9fn\n' +
            '9R2at8WBpgd0T/wukdZh14UrlHyrH5EN4zu41KLspAvsDmRvHr2STfqZUaKQeeuZ\n' +
            'HXkz6G/S4JEzOKTRub/Om6mBIZFgMKGTn9Fk+8jYm6PyHqis1WrgZY0OeQn1FEif\n' +
            '2oXbCaNO8Bg31wpvdRtGvOFjeJOJkpIHU6b7+p6+Q3MWcLfchK59FlrAIUT1zGm7\n' +
            'MGL+zHG+wBb/2iOCKyG3g5iX6bk5YuU9lJzh+6Syurm+4As5VzjgHmtb+PI6FhT8\n' +
            'xmxhoAxx+Ux/fqOn0ERNgpS/iKZu/tJy9DK1iIwfRBVoBEyrciKl0DjaoeJWSlG8\n' +
            'fpfbgWERlfMlDHEfBz6gd93P/0IHXk3E/qBop54lyQEAcOp7joozGW4a+d19QtFx\n' +
            'Y1Ej7aS+Hb5mDfwopVPXK9PMmc8pKx7FcwIDAQABozwwOjAZBgNVHREEEjAQgg5z\n' +
            'YW50cmEucGguZmhudzAdBgNVHQ4EFgQUaaAXJJjWoMOzmJ4+sopZ2x0q8EUwDQYJ\n' +
            'KoZIhvcNAQELBQADggGBACpcKUMBDd4GqCbgD2OHSq9p+ZbVcbTQBLzd7zZbdOEn\n' +
            'UzqI7RHtCYiJ1AnTWOQygbb+PEcpQbvPM89DZHvNCHy5D/Z+Fgzehof3qvlr4Yce\n' +
            'j5hx6tR6YIUEvafSL5JtMfMW+AA0qa9PwrqnPPfDliy9jOTyrUmQUk/aG7zzvTDe\n' +
            'zWQFtjFXm94cWSNzBSKIw+wBsUtkcwmUm00e036hPaNIQSVIjv9mMnzVvalAPaZt\n' +
            'MmHAuvQGsEow3UIRgsGI27313aSoSViMxEBlOLJscSQuzxED7p+EJ+AtANkl5pDi\n' +
            'VjI5i0i7OUkL+9hxFeiul1aKtn7raoGYpacJiMmogOYzzbywjYBFdTyD0XEcY5cZ\n' +
            'oXWnPX9bbG/XRZVMq0OYrZQFW+dqv3vWWiM8LKoWtorl44pBSJ+JeoDkZOPwYriD\n' +
            'fjmRz1PGA1fvtwUDIaG0aEFMYbnwgsuYRH6BQF3Y0U9n0Xl1ovhhZEH/Wrex82OH\n' +
            'QBSgdddDujlUl6Qx+OyVUA==', // cert must be provided
    },
    function(profile, done) {
        findByEmail(profile.email, function(err, user) {
            if (err) {
                return done(err);
            }
            return done(null, user);
        });
    })
);

*/

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


// initialize persistence layer
//models = require('./models/');

require('./printpdf')(app, models);
// load routes last!
require('./routes')(app, models);

server.listen(app.get('port'));
console.log('server listening on port ' + app.get('port'));

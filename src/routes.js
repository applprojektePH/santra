var path        = require('path');
var express     = require('express');
const bodyParser = require('body-parser');
const controllers = require("./controllers/");
const passport = require("passport");
var jsonParser = bodyParser.json();
var SamlStrategy = require('passport-saml').Strategy;
const { Shibboleth } = require("shibboleth");
//const shib = new Shibboleth(process.env.SHIBBOLETHURL);

module.exports = function (app, models) {
  app.use(bodyParser.urlencoded({ extended: false }));
  // const { Shibboleth } = require("shibboleth");
  //
  // const shib = new Shibboleth(process.env.SHIBBOLETHURL);
  // console.log(shib);
  // app.disable("view cache");
  //let test = shib.hasShibSessionInfo(req, headers);

  let controllers = require('./controllers/');
  controllers = new controllers(models);
  app.get('/', controllers.mainController.main);
  //app.get('/Shibboleth.sso/Login', controllers.mainController.main);
  //app.get('/Shibboleth.sso/Session', controllers.mainController.main);
  app.get('/main', controllers.mainController.main);
  app.get('/form', controllers.formController.main);
  app.get('/user', controllers.userController.main);
  app.post('/user', controllers.removeController.main);
  app.get('/info', controllers.infoController.main);
  app.get('/details', controllers.detailsController.main);
  app.post('/details', controllers.detailsController.main);
  //app.get('/remove', controllers.removeController.main);
  app.get('/edit', controllers.editController.main);
  app.post('/edit', controllers.editedController.main);
  app.post('/submit-form', controllers.userController.main);
  app.get('/history', controllers.historyController.main);

};

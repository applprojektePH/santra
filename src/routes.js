var path        = require('path');
var express     = require('express');
const bodyParser = require('body-parser');
const controllers = require("./controllers/");
const passport = require("passport");
var jsonParser = bodyParser.json();
var SamlStrategy = require('passport-saml').Strategy;

module.exports = function (app, models) {
  // app.post(
  //     "/login/callback",
  //     bodyParser.urlencoded({ extended: false }),
  //     passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  //     function (req, res) {
  //       res.redirect("/");
  //     }
  // );
  // app.get('/SSOLogin',
  //     passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  //     function(req, res) {
  //       res.redirect('/');
  //     }
  // );
  app.use(bodyParser.urlencoded({ extended: false }));
  //app.disable("view cache");
  let controllers = require('./controllers/');
  controllers = new controllers(models);
  app.get('/', controllers.mainController.main);
  app.get('/form', controllers.formController.main);
  app.get('/user', controllers.userController.main);
  app.post('/user', controllers.removeController.main);
  app.get('/info', controllers.infoController.main);
  app.get('/details', controllers.detailsController.main);
  //app.post('/details', controllers.detailsController.main);
  //app.get('/remove', controllers.removeController.main);
  app.get('/edit', controllers.editController.main);
  app.post('/edit', controllers.editedController.main);
  app.post('/submit-form', controllers.userController.main);
  app.get('/history', controllers.historyController.main);
 // app.get('/db', controllers.dbController.getOrders);

  // app.get('/getAllNodes', controllers.dbController.getAllNodes);
  //
  // app.get('/getGraph', controllers.dbController.getGraph);
  //
  // app.get('/getAllTags', controllers.dbController.getAllTags);
  //
  // app.get('/getNodesByTag/:tag', controllers.dbController.getNodesByTag);
  //
  // app.get('/getNode/:id', controllers.dbController.getNode);
  //
  // app.get('/getThemes', controllers.dbController.getThemes);
  //
  // app.get('/searchNodes/:searchString', controllers.dbController.searchNodes);
  //
  // app.get('/xls/:fileName', controllers.xlsController.truncateAll, controllers.xlsController.read);
  //
};

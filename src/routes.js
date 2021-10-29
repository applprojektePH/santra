var path        = require('path');
var express     = require('express');
const bodyParser = require('body-parser');
const controllers = require("./controllers/");
var jsonParser = bodyParser.json();

module.exports = function (app, models) {
  app.use(bodyParser.urlencoded({ extended: false }));
  var controllers = require('./controllers/');
  controllers = new controllers(models);
  app.get('/', controllers.mainController.main);
  app.get('/form', controllers.formController.main);
  app.get('/user', controllers.userController.main);
  app.get('/info', controllers.infoController.main);
  app.get('/details', controllers.detailsController.main);
  app.get('/remove', controllers.removeController.main);
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

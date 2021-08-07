var path        = require('path');
var express     = require('express');

module.exports = function (app, models) {
  var controllers = require('./controllers/');
  controllers = new controllers(models);

  app.get('/AA', controllers.storyController.main);

  app.get('/', controllers.mainController.main);

  app.get('/Themen', controllers.topicController.main);

  app.get('/getRandomNode', controllers.dbController.getRandomNode);

  app.get('/getAllNodes', controllers.dbController.getAllNodes);

  app.get('/getGraph', controllers.dbController.getGraph);

  app.get('/getAllTags', controllers.dbController.getAllTags);

  app.get('/getNodesByTag/:tag', controllers.dbController.getNodesByTag);

  app.get('/getNode/:id', controllers.dbController.getNode);

  app.get('/getThemes', controllers.dbController.getThemes);

  app.get('/searchNodes/:searchString', controllers.dbController.searchNodes);

  /*app.get('/xls/:fileName', controllers.xlsController.truncateAll, controllers.xlsController.read);

  app.get('/updateNodes/:fileName', controllers.xlsController.truncateNodes, controllers.xlsController.read);

  app.get('/updateResolve', controllers.xlsController.update, controllers.xlsController.printOut);*/


};

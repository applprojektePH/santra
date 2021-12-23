var path = require('path');
var express = require('express');
const bodyParser = require('body-parser');
const controllers = require("./controllers/");

module.exports = function (app, models) {

    app.use(bodyParser.urlencoded({extended: false}));

    let controllers = require('./controllers/');
    controllers = new controllers(models);
    app.get('/', controllers.mainController.main);
    app.get('/main', controllers.mainController.main);
    app.get('/form', controllers.formController.main);
    app.get('/user', controllers.userController.main);
    app.post('/user', controllers.removeController.main);
    app.get('/info', controllers.infoController.main);
    app.get('/details', controllers.detailsController.main);
    app.post('/details', controllers.detailsController.main);
    app.get('/edit', controllers.editController.main);
    app.post('/edit', controllers.editedController.main);
    app.post('/submit-form', controllers.userController.main);
    app.get('/history', controllers.historyController.main);
    app.get('/datenschutz', controllers.datenschutzController.main);
    app.get('/impressum', controllers.impressumController.main);
    app.get('/document.pdf',controllers.pdfController.main);
};

var path = require('path');
var express = require('express');


var fs = require('fs');
var controllers = require('./controllers/');

module.exports = function (app, models) {
    controllers = new controllers(models);
    app.get('/document.pdf',controllers.pdfController.main)
    {
    }
};

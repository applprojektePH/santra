module.exports = function (models) {

	let page = {};
	let CONSTANTS = require("../libs/constants");

	this.main = function (req, res, next) {
		console.log(new Date().toLocaleString() + " - rendering main");

		page.title = "Santra - Softwareantrag\n" +
			"Pädagogische Hochschule FHNW";
		if(CONSTANTS.SETTINGS.WEB.SUB_PATH)
			page.path = "/"+CONSTANTS.SETTINGS.WEB.PATH_STRING;
		else
			page.path = "";
    
    if(Object.keys(req.query).length === 0)
      req.query.start = "";
  
		page.query = req.query;

		res.render('layout', {
			page: page
		});
	};

};

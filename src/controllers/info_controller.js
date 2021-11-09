module.exports = function (models) {

	let page = {};
	let CONSTANTS = require("../libs/constants");

	this.main = function (req, res, next) {
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
		res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
		res.setHeader("Expires", "0"); // Proxies.

		page.title = "Santra - Softwareantrag\n" +
			"Pädagogische Hochschule FHNW";
		if(CONSTANTS.SETTINGS.WEB.SUB_PATH)
			page.path = "/"+CONSTANTS.SETTINGS.WEB.PATH_STRING;
		else
			page.path = "";

		res.render('layout_info', {
			page: page
		});
	};

};

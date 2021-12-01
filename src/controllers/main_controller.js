const LOGIN = require("../login");
module.exports = function (models) {

	let page = {};
	let CONSTANTS = require("../libs/constants");

	this.main = function (req, res, next) {
		console.log(new Date().toLocaleString() + " - rendering main");
		let obj_user = {};
		req.rawHeaders.forEach(function(val, i) {
			if (i % 2 === 1) return;
			obj_user[val] = req.rawHeaders[i + 1];
		});
		JSON.stringify(obj_user);
		console.log(obj_user.mail);
		console.log(obj_user.givenName);
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
			"vornamelog": obj_user.givenName,
			"nachnamelog": obj_user.surname,
			"emaillog": obj_user.mail,
			"titlelog": LOGIN.titlelog,
			"namelog": LOGIN.namelog,
		});
	};

};

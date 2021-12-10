let CONSTANTS = require("../libs/constants");
module.exports = function (models) {
    let page = {};
    this.main = function (req, res, next) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
        res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
        res.setHeader("Expires", "0"); // Proxies.

        /* USER start */
        let obj_user = {};
        req.rawHeaders.forEach(function (val, i) {
            if (i % 2 === 1) return;
            obj_user[val] = req.rawHeaders[i + 1];
        });
        JSON.stringify(obj_user);

        /* USER end */
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if (CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/" + CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";
            setTimeout(
                function () {
                    res.render('layout_datenschutz', {
                        "vornamelog": obj_user.givenName,
                        "nachnamelog": obj_user.surname
                    });
                }, 500);

    };
};

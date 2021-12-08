const LOGIN = require("../login");
const mysql = require("mysql");
const CONSTANTS = require("../libs/constants");
module.exports = function (models) {
    let page = {};
    let CONSTANTS = require("../libs/constants");
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: CONSTANTS.SETTINGS.DB.HOST,
        user: CONSTANTS.SETTINGS.DB.USERNAME,
        password: CONSTANTS.SETTINGS.DB.PASSWORD,
        database: CONSTANTS.SETTINGS.DBNAME.NAME
    })
    this.main = function (req, res, next) {
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if (CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/" + CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";
        /* USER start */
        let obj_user = {};
        let adminlog;
        req.rawHeaders.forEach(function (val, i) {
            if (i % 2 === 1) return;
            obj_user[val] = req.rawHeaders[i + 1];
        });
        JSON.stringify(obj_user);
        adminlog = LOGIN.admins.includes(obj_user.mail)
        /* USER end */
        setTimeout(
            function () {
                res.render('layout_form', {
                    "vornamelog": obj_user.givenName,
                    "nachnamelog": obj_user.surname,
                    "emaillog": obj_user.mail,
                    "admin": adminlog
                });
            }, 100);
    };

};

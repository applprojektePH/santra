const mysql = require('mysql');
let CONSTANTS = require("../libs/constants");
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : CONSTANTS.SETTINGS.DB.HOST,
    user            : CONSTANTS.SETTINGS.DB.USERNAME,
    password        : CONSTANTS.SETTINGS.DB.PASSWORD,
    database        : CONSTANTS.SETTINGS.DBNAME.NAME
})
module.exports = function (models) {
    let page = {};
    let CONSTANTS = require("../libs/constants");
    this.main = function (req, res) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
        res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
        res.setHeader("Expires", "0"); // Proxies.
        let tsID = req.body;
        let ts = parseInt(tsID.str);
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if(CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/"+CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";

        pool.getConnection((err, connection) => {
            if (err) throw err
            sql4 = 'DELETE FROM orders WHERE orderid IN (SELECT '+ts+' FROM orders)';
            connection.query(""+sql4+"",
                (err, rows) => {
                    connection.release();
                })
            setTimeout(
                function () {
                    res.render('layout_user');
                }, 500);
        })
    };
};


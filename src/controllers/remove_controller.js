let db = require('../libs/db');
var async = require('async');
const mysql = require('mysql');
let CONSTANTS = require("../libs/constants");
let nodemailer = require('nodemailer');

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
        let url = req.url;
        let softwareList = [];
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if(CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/"+CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";

        pool.getConnection((err, connection) => {
            if (err) throw err
            console.log('connected as id ' + connection.threadId)
            let tsID = parseInt(req.query.tsid);
            sql4 = 'DELETE FROM orders WHERE orderid IN (SELECT '+tsID+' FROM orders)';
            connection.query(""+sql4+"",
                (err, rows) => {
                })
            setTimeout(
                function () {
                    res.render('layout_remove', {
                        "orderid": tsID
                    });
                });
        })
    };
};


let db = require('../libs/db');
const mysql = require('mysql');
let CONSTANTS = require("../libs/constants");
let nodemailer = require('nodemailer');
let LOGIN = require('../login');
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : CONSTANTS.SETTINGS.DB.HOST,
    user            : CONSTANTS.SETTINGS.DB.USERNAME,
    password        : CONSTANTS.SETTINGS.DB.PASSWORD,
    database        : CONSTANTS.SETTINGS.DBNAME.NAME
})
module.exports = function (models) {
    let page = {};
    this.main = function (req, res, next) {
        /* USER start */
        let obj_user = {};
        let adminlog;
        req.rawHeaders.forEach(function(val, i) {
            if (i % 2 === 1) return;
            obj_user[val] = req.rawHeaders[i + 1];
        });
        JSON.stringify(obj_user);
        adminlog=LOGIN.admins.includes(obj_user.mail)
        /* USER end */
        let tsID = parseInt(req.query.tsid);
        let status = req.query.st;
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if(CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/"+CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";
        pool.getConnection((err, connection) => {
            if(err) throw err
            let softwareListHistory = [];
            sql1 = 'SELECT * FROM history WHERE (orderid = "'+tsID+'")';
            connection.query(""+sql1+"", (err, rows) => {
                //connection.release() // return the connection to pool
                if (!err) {
                    function convertDate(inputFormat) {
                        function pad(s) { return (s < 10) ? '0' + s : s; }
                        var d = new Date(inputFormat)
                        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('.')
                    }
                    for (let i = 0; i < rows.length; i++) {
                        // Create an object to save current row's data
                        let mailtypecurrent;
                        switch (rows[i].orderstatus) {
                            case 1:
                                mailtypecurrent = 'Antrag genehmigt';
                                break;
                            case 2:
                                mailtypecurrent = 'Antrag abgelehnt';
                                break;
                            case 3:
                                mailtypecurrent = 'Antrag zu Gremium';
                                break;
                            case 4:
                                mailtypecurrent = 'Antrag vom Gremium genehmigt';
                                break;
                            case 5:
                                mailtypecurrent = 'Antrag vom Gremium abgelehnt';
                                break;
                        }
                        let order = {
                            'orderid':rows[i].orderid,
                            'datetime':rows[i].datetime,
                            'mailuser':rows[i].mailuser,
                            'mailtext':rows[i].mailtext,
                            'mailtype':mailtypecurrent,
                            'orderstatus':rows[i].orderstatus
                        }
                        softwareListHistory.push(order);
                    }
                }
                else {
                    console.log(err)
                }
            })

            setTimeout(
                function(){
                    res.render('layout_history', {
                        "softwareListHistory": softwareListHistory, "orderid": tsID, "orderstatus":status,
                        "vornamelog": obj_user.givenName,
                        "nachnamelog": obj_user.surname,
                        "emaillog": obj_user.mail,
                        "admin": adminlog,
                        "useridlog": LOGIN.useridlog
                    });
                }, 500);

        })

    };
};

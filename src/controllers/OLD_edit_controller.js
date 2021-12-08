let db = require('../libs/db');
const mysql = require('mysql');
let CONSTANTS = require("../libs/constants");
const LOGIN = require("../login");
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
    this.main = function (req, res, next) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
        res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
        res.setHeader("Expires", "0"); // Proxies.
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
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        pool.getConnection((err, connection) => {
            let tsID = parseInt(req.query.tsid);
            let softwareListDetails = [];
            console.log(req.body);
            connection.query('SELECT * FROM orders WHERE ("'+obj_user.mail+'" IN (SELECT email FROM users) AND orderid IN (SELECT '+tsID+' FROM orders))', (err, rows) => {
                connection.release() // return the connection to pool
                if (!err) {
                    for (let i = 0; i < rows.length; i++) {
                        // Create an object to save current row's data
                        let order = {
                            'notizen': rows[i].notizen,
                            'orderid':rows[i].orderid,
                            'institut':rows[i].institut,
                            'professur':rows[i].professur,
                            'anrede':rows[i].anrede,
                            'vorname':rows[i].vorname,
                            'nachname':rows[i].nachname,
                            'email':rows[i].email,
                            'funktion':rows[i].funktion,
                            'studiengang':rows[i].studiengang,
                            'modulanlass':rows[i].modulanlass,
                            'szenario':rows[i].szenario,
                            'softwarename':rows[i].softwarename,
                            'softwarewebseite':rows[i].softwarewebseite,
                            'softwareupdate': rows[i].softwareupdate,
                            'softwareupdatewelches': rows[i].softwareupdatewelches,
                            'softwareversion':rows[i].softwareversion,
                            'lizenzenanzahl':rows[i].lizenzenanzahl,
                            'nutzeranzahl':rows[i].nutzeranzahl,
                            'nutzungsdauer':rows[i].nutzungsdauer,
                            'nutzungsdauertext':rows[i].nutzungsdauertext,
                            'betriebssystem':rows[i].betriebssystem,
                            'browser':rows[i].browser,
                            'softwareverfuegung':rows[i].softwareverfuegung,
                            'softwareinteresse':rows[i].softwareinteresse,
                            'softwareinstitut':rows[i].softwareinstitut,
                            'softwarehochschinteresse':rows[i].softwarehochschinteresse,
                            'softwarehochschule':rows[i].softwarehochschule,
                            'lizenzinstitution':rows[i].lizenzinstitution,
                            'lizenzart':rows[i].lizenzart,
                            'lizenzkosten':rows[i].lizenzkosten,
                            'vergleichbarkeit':rows[i].vergleichbarkeit,
                            'support':rows[i].support,
                            'cloud':rows[i].cloud,
                            'cloudwo':rows[i].cloudwo,
                            'productowner':rows[i].productowner,
                            'bemerkungen':rows[i].bemerkungen,
                            'datumantrag': rows[i].datumantrag,
                            'status':rows[i].status
                        }
                        // Add object into array
                        softwareListDetails.push(order);
                    } }
                else {
                    console.log(err)
                }
            })
            setTimeout(
                function(){
                    res.render('layout_form-filled', {
                        "vornamelog": obj_user.givenName,
                        "nachnamelog": obj_user.surname,
                        "emaillog": obj_user.mail,
                        "admin": adminlog,
                        "softwareListDetails": softwareListDetails
                    });
                }, 500);
        })
    };
};

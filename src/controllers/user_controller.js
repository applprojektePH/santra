let db = require('../libs/db');
const mysql = require('mysql');
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'admin',
    password        : 'mysecretpassword',
    database        : 'santra'
})
module.exports = function (models) {

    let page = {};
    let CONSTANTS = require("../libs/constants");

    this.main = function (req, res, next) {
        let softwareList = [];
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if(CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/"+CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";
        pool.getConnection((err, connection) => {
            if(err) throw err
            console.log('connected as id ' + connection.threadId)
            connection.query('SELECT * FROM software WHERE userid IN \n' +
                '(SELECT id FROM users)', (err, rows) => {
                connection.release() // return the connection to pool
                console.log(rows);
                if (!err) {
                    function convertDate(inputFormat) {
                        function pad(s) { return (s < 10) ? '0' + s : s; }
                        var d = new Date(inputFormat)
                        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('.')
                    }

                    for (let i = 0; i < rows.length; i++) {
                        // Create an object to save current row's data
                        let order = {
                            'orderid':rows[i].orderid,
                            'institut':rows[i].institut,
                            'professur':rows[i].professur,
                            'vorname':rows[i].vorname,
                            'nachname':rows[i].nachname,
                            'email':rows[i].email,
                            'funktion':rows[i].funktion,
                            'studiengang':rows[i].studiengang,
                            'modulanlass':rows[i].modulanlass,
                            'szenario':rows[i].szenario,
                            'softwarename':rows[i].softwarename,
                            'softwarewebseite':rows[i].softwarewebseite,
                            'softwareupdate':rows[i].softwareupdate,
                            'softwareupdatewelches':rows[i].softwareupdatewelches,
                            'softwareversion':rows[i].softwareversion,
                            'lizenzenanzahl':rows[i].lizenzenanzahl,
                            'nutzeranzahl':rows[i].nutzeranzahl,
                            'nutzungsdauer':rows[i].nutzungsdauer,
                            'betriebssystem':rows[i].betriebssystem,
                            'browser':rows[i].browser,
                            'softwareverfuegung':rows[i].softwareverfuegung,
                            'softwareinstinteresse':rows[i].softwareinstinteresse,
                            'softwareinstitut':rows[i].softwareinstitut,
                            'softwarehochschinteresse':rows[i].softwarehochschinteresse,
                            'softwarehochschule':rows[i].softwarehochschule,
                            'lizenzinstitution':rows[i].lizenzinstitution,
                            'lizenzart':rows[i].lizenzart,
                            'lizenzkosten':rows[i].lizenzkosten,
                            'vergleichbarkeit':rows[i].vergleichbarkeit,
                            'support':rows[i].support,
                            'cloud':rows[i].cloud,
                            'productowner':rows[i].roductowner,
                            'bemerkungen':rows[i].bemerkungen,
                            'datum': convertDate(rows[i].datum),
                            'userid':rows[i].userid,
                            'status':rows[i].status
                        }
                        // Add object into array
                        softwareList.push(order);
                } }
                else {
                    console.log(err)
                }
            })
            setTimeout(
                function(){
                    res.render('layout_user', {
                        "softwareList": softwareList
                    });
                }, 100);
        })

    };

};

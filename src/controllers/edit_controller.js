let db = require('../libs/db');
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
    this.main = function (req, res, next) {
        var tsID = parseInt(req.query.tsid);
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if(CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/"+CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";
        pool.getConnection((err, connection) => {
            let tsID = parseInt(req.query.tsid);
            let status = parseInt(req.query.currenturlParam);
            let userid = '123';
            let orderidmail;
            let institut = req.body.institut;
            let professur = req.body.professur;
            let anrede = req.body.anrede;
            let vorname = req.body.vorname;
            let nachname = req.body.nachname;
            let email = req.body.email;
            let funktion = req.body.funktion;
            let studiengang = req.body.studiengang;
            let modulanlass = req.body.modulanlass;
            let szenario = req.body.szenario;
            let softwarename = req.body.softwarename;
            let softwarewebseite = req.body.softwarewebseite;
            let softwareupdate = req.body.softwareupdate;
            let softwareupdatewelches = req.body.softwareupdatewelches;
            let lizenzenanzahl = req.body.lizenzenanzahl;
            let nutzeranzahl = req.body.nutzeranzahl;
            let nutzungsdauer = req.body.nutzungsdauer;
            let betriebssystem = req.body.betriebssystem;
            let browser = req.body.browser;
            let softwareverfuegung = req.body.softwareverfuegung;
            let softwareinteresse = req.body.softwareinteresse;
            let softwareinstitut = req.body.softwareinstitut;
            let softwarehochschinteresse = req.body.softwarehochschinteresse;
            let softwarehochschule = req.body.softwarehochschule;
            let lizenzinstitution = req.body.lizenzinstitution;
            let lizenzart = req.body.lizenzart;
            let lizenzkosten = req.body.lizenzkosten;
            let vergleichbarkeit = req.body.vergleichbarkeit;
            let support = req.body.support;
            let cloud = req.body.cloud;
            let cloudwo = req.body.cloudwo;
            let productowner = req.body.productowner;
            let bemerkungen = req.body.bemerkungen;
            let datum = req.body.datum;
            let datumantrag = req.body.datumantrag;
            //hier status unterscheiden
            let notizen = req.body.notizen;
            let softwareList = [];

            let softwareListDetails = [];
            connection.query('SELECT * FROM orders WHERE (userid IN (SELECT id FROM users) AND orderid IN (SELECT '+tsID+' FROM orders))', (err, rows) => {
                connection.release() // return the connection to pool
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
                            'anrede':rows[i].anrede,
                            'vorname':rows[i].vorname,
                            'nachname':rows[i].nachname,
                            'email':rows[i].email,
                            'funktion':rows[i].funktion,
                            'anrede2':rows[i].anrede2,
                            'vorname2':rows[i].vorname2,
                            'nachname2':rows[i].nachname2,
                            'email2':rows[i].email2,
                            'funktion2':rows[i].funktion2,
                            'studiengang':rows[i].studiengang,
                            'modulanlass':rows[i].modulanlass,
                            'szenario':rows[i].szenario,
                            'softwarename':rows[i].softwarename,
                            'softwarewebseite':rows[i].softwarewebseite,
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
                            'notizen': rows[i].notizen,
                            'userid':rows[i].userid,
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
                    // res.send(req.params.tsid);
                    res.render('layout_form-filled', {
                        "softwareListDetails": softwareListDetails
                    });
                }, 100);
        })
    };
};

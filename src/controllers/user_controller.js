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
            let orderid = '';
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
            let userid = req.body.userid;
            //hier status unterscheiden
	    let notizen = req.body.notizen;
            let status = '1';
 	    let softwareList = [];
                sql1 = 'SELECT * FROM orders WHERE userid IN (SELECT id FROM users)';
 sql2 = "INSERT INTO orders ( institut, professur, anrede, vorname, nachname, email, funktion, studiengang, modulanlass, szenario, softwarename, softwarewebseite, softwareupdate, softwareupdatewelches, lizenzenanzahl, nutzeranzahl, nutzungsdauer, betriebssystem, browser, softwareverfuegung, softwareinteresse, softwareinstitut, softwarehochschinteresse, softwarehochschule, lizenzinstitution, lizenzart, lizenzkosten, vergleichbarkeit, support, cloud, cloudwo, productowner, bemerkungen, datum, userid, notizen, status) VALUES ( '"+institut+"', '"+professur+"','"+anrede+"', '"+vorname+"','"+nachname+"', '"+email+"', '"+funktion+"', '"+studiengang+"', '"+modulanlass+"', '"+szenario+"', '"+softwarename+"', '"+softwarewebseite+"', '"+softwareupdate+"', '"+softwareupdatewelches+"', '"+lizenzenanzahl+"', '"+nutzeranzahl+"', '"+nutzungsdauer+"', '"+betriebssystem+"', '"+browser+"', '"+softwareverfuegung+"', '"+softwareinteresse+"', '"+softwareinstitut+"', '"+softwarehochschinteresse+"', '"+softwarehochschule+"', '"+lizenzinstitution+"', '"+lizenzart+"', '"+lizenzkosten+"', '"+vergleichbarkeit+"', '"+support+"', '"+cloud+"', '"+cloudwo+"', '"+productowner+"', '"+bemerkungen+"', '"+datum+"', '"+userid+"', '"+notizen+"', '"+status+"')";

if (url=="/submit-form"){
  
    connection.query(""+sql2+"",
        (err, rows) => {
            //  connection.release() // return the connection to pool

            connection.query(""+sql1+"",
                (err, rows) => {
                    //    connection.release() // return the connection to pool

                    if (!err) {
                        function convertDate(inputFormat) {
                            function pad(s) {
                                return (s < 10) ? '0' + s : s;
                            }

                            var d = new Date(inputFormat)
                            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('.')
                        }

                        for (let i = 0; i < rows.length; i++) {
                            // Create an object to save current row's data
                            let order = {
                                'orderid': rows[i].orderid,
                                'orderidmail': rows[i].orderid,
                                'institut': rows[i].institut,
                                'professur': rows[i].professur,
                                'anrede': rows[i].anrede,
                                'vorname': rows[i].vorname,
                                'nachname': rows[i].nachname,
                                'email': rows[i].email,
                                'funktion': rows[i].funktion,
                                'studiengang': rows[i].studiengang,
                                'modulanlass': rows[i].modulanlass,
                                'szenario': rows[i].szenario,
                                'softwarename': rows[i].softwarename,
                                'softwarewebseite': rows[i].softwarewebseite,
                                'softwareupdate': rows[i].softwareupdate,
                                'softwareupdatewelches': rows[i].softwareupdatewelches,
                                'softwareversion': rows[i].softwareversion,
                                'lizenzenanzahl': rows[i].lizenzenanzahl,
                                'nutzeranzahl': rows[i].nutzeranzahl,
                                'nutzungsdauer': rows[i].nutzungsdauer,
                                'betriebssystem': rows[i].betriebssystem,
                                'browser': rows[i].browser,
                                'softwareverfuegung': rows[i].softwareverfuegung,
                                'softwareinstinteresse': rows[i].softwareinstinteresse,
                                'softwareinstitut': rows[i].softwareinstitut,
                                'softwarehochschinteresse': rows[i].softwarehochschinteresse,
                                'softwarehochschule': rows[i].softwarehochschule,
                                'lizenzinstitution': rows[i].lizenzinstitution,
                                'lizenzart': rows[i].lizenzart,
                                'lizenzkosten': rows[i].lizenzkosten,
                                'vergleichbarkeit': rows[i].vergleichbarkeit,
                                'support': rows[i].support,
                                'cloud': rows[i].cloud,
                                'productowner': rows[i].roductowner,
                                'bemerkungen': rows[i].bemerkungen,
                                'datum': convertDate(rows[i].datum),
                                'userid': rows[i].userid,
                                'status': rows[i].status
                            }
                            // Add object into array
                            softwareList.push(order);
                        }
                    } else {
                        console.log(err)
                    }
                    let transport = nodemailer.createTransport("SMTP", {
                        host: "lmailer.fhnw.ch",
                        port: 25
                    });

                    console.log('SMTP Configured');

// Message object
                    let messageSender = {

                        // sender info
                        from: 'Santra <applprojekte.ph@fhnw.ch>',

                        // Comma separated list of recipients
                        to: '+nachname+ <'+email+'>',

                        // Subject of the message
                        subject: 'Santra: Antrag Nummer XY',

                        // plaintext body
                        text: 'Guten Tag '+anrede+' '+nachname+', Ihr Antrag wurde von unserem System entgegengenommen und zur Bearbeitung an das entsprechende Team weitergeleitet. Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung. \n' +
                            '\n' +
                            'Vielen Dank und freundliche Grüsse \n' +
                            'Ihr ApplProjekte Supportteam \n' +
                            'n|w\n',

                        // HTML body
                        html:'<p><span>Guten Tag '+anrede+' '+nachname+'</span><p>Ihr Antrag wurde von unserem System entgegengenommen und zur Bearbeitung an das entsprechende Team weitergeleitet.' +
                            '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch '+orderidmail+' nach der Anmeldung.' +
                            '</br>Vielen Dank und freundliche Grüsse' +
                            '</br>Ihr ApplProjekte Supportteam ' +
                            '</br>n|w</p>'
                    };
                    let messageSupport = {
                        // sender info
                        from: 'Santra <applprojekte.ph@fhnw.ch>',

                        // Comma separated list of recipients
                        //to: 'Applprojekte Team <applprojekte.ph@fhnw.ch>',
                        to: '<alesya.heymann@fhnw.ch>',
                        // Subject of the message
                        subject: 'Santra: Antrag Nummer XY ✔',

                        // plaintext body
                        text: ''+orderid+'Liebes Applprojekte Team, neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung. \n' +
                            '\n' +
                            'freundliche Grüsse \n' +
                            'Santra Softwareantrag Software \n' +
                            'n|w\n',

                        // HTML body
                        html:'<p><span>Liebes Applprojekte Team</span><p>neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung.' +
                            '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                            '</br>Vielen Dank und freundliche Grüsse' +
                            '</br>Ihr ApplProjekte Supportteam ' +
                            '</br>n|w</p>'
                    };
//console.log('Sending Mail');
                    transport.sendMail(messageSender, function(error){

                    });
                    transport.sendMail(messageSupport, function(error){

                    });
            })
        })

}
else if (url == "/user"){
    connection.query(""+sql1+"",
        (err, rows) => {
            //    connection.release() // return the connection to pool

            if (!err) {
                function convertDate(inputFormat) {
                    function pad(s) {
                        return (s < 10) ? '0' + s : s;
                    }
                    var d = new Date(inputFormat)
                    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('.')
                }
                for (let i = 0; i < rows.length; i++) {
                    // Create an object to save current row's data
                    let statuscurrent;
                    switch (rows[i].status) {
                        case 1:
                            statuscurrent = 'Antrag in Bearbeitung';
                            break;
                        case 2:
                            statuscurrent = 'Antrag in Prüfung';
                            break;
                        case 3:
                            statuscurrent = 'Antrag bei Gremium';
                            break;
                        case 4:
                            statuscurrent = 'Antrag Entscheid';
                            break;
                        case 5:
                            statuscurrent = 'Antrag abgeschlossen';
                            break;
                    }
                    let order = {
                        'orderid': rows[i].orderid,
                        'institut': rows[i].institut,
                        'professur': rows[i].professur,
                        'anrede': rows[i].anrede,
                        'vorname': rows[i].vorname,
                        'nachname': rows[i].nachname,
                         'email': rows[i].email,
                        'funktion': rows[i].funktion,
                        'studiengang': rows[i].studiengang,
                        'modulanlass': rows[i].modulanlass,
                        'szenario': rows[i].szenario,
                        'softwarename': rows[i].softwarename,
                        'softwarewebseite': rows[i].softwarewebseite,
                        'softwareupdate': rows[i].softwareupdate,
                        'softwareupdatewelches': rows[i].softwareupdatewelches,
                        'softwareversion': rows[i].softwareversion,
                        'lizenzenanzahl': rows[i].lizenzenanzahl,
                        'nutzeranzahl': rows[i].nutzeranzahl,
                        'nutzungsdauer': rows[i].nutzungsdauer,
                        'betriebssystem': rows[i].betriebssystem,
                        'browser': rows[i].browser,
                        'softwareverfuegung': rows[i].softwareverfuegung,
                        'softwareinstinteresse': rows[i].softwareinstinteresse,
                        'softwareinstitut': rows[i].softwareinstitut,
                        'softwarehochschinteresse': rows[i].softwarehochschinteresse,
                        'softwarehochschule': rows[i].softwarehochschule,
                        'lizenzinstitution': rows[i].lizenzinstitution,
                        'lizenzart': rows[i].lizenzart,
                        'lizenzkosten': rows[i].lizenzkosten,
                        'vergleichbarkeit': rows[i].vergleichbarkeit,
                        'support': rows[i].support,
                        'cloud': rows[i].cloud,
                        'productowner': rows[i].productowner,
                        'bemerkungen': rows[i].bemerkungen,
                        'datum': convertDate(rows[i].datum),
                        'userid': rows[i].userid,
                        'status': statuscurrent
                    }
                    // Add object into array
                    softwareList.push(order);
                }
            } else {
                console.log(err)
            }
        })
}
            setTimeout(
                function () {
                    res.render('layout_user', {
                        "softwareList": softwareList
                    });
                }, 500);

        })
    };
};


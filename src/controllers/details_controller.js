let db = require('../libs/db');
const mysql = require('mysql');
let CONSTANTS = require("../libs/constants");
let nodemailer = require('nodemailer');
let LOGIN = require("../login");
const pool = mysql.createPool({
    connectionLimit: 10,
    host: CONSTANTS.SETTINGS.DB.HOST,
    user: CONSTANTS.SETTINGS.DB.USERNAME,
    password: CONSTANTS.SETTINGS.DB.PASSWORD,
    database: CONSTANTS.SETTINGS.DBNAME.NAME
})
module.exports = function (models) {
    let page = {};
    this.main = function (req, res, next) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
        res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
        res.setHeader("Expires", "0"); // Proxies.

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

        let tsID = parseInt(req.query.tsid);
        let status = parseInt(req.query.status);
        let anrede;
        let nachname;
        let email;
        let orderid;
        let reqBody = req.body;
        let softwarename;
        let statuschange;
        let mailtext;
        let datetime;
        let mailtype;
        let orderstatus;
        let statuscurrent;
        if(reqBody !=='undefined'){
           statuschange = reqBody.statuschange;
           mailtext = reqBody.mailtext;
           datetime = reqBody.datetime;
           mailtype = reqBody.mailtype;
           orderstatus = reqBody.orderstatus;
        }
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if (CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/" + CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";
        pool.getConnection((err, connection) => {
            if (err) throw err
            let softwareListDetails = [];
            sql1 = 'SELECT * FROM orders WHERE ("' + obj_user.mail + '" IN (SELECT email FROM users) AND orderid IN (SELECT ' + tsID + ' FROM orders))';
            if ((!isNaN(statuschange))) {
                sql4 = 'UPDATE orders SET status=' + statuschange + ' WHERE orderid IN (SELECT ' + tsID + ' FROM orders)';
                connection.query("" + sql4 + "",
                    (err, rows) => {
                    })
            }
            //nur für Entwurf einreichen
            if ((!isNaN(status))) {
                sql4 = 'UPDATE orders SET status=' + status + ' WHERE orderid IN (SELECT ' + tsID + ' FROM orders)';
                connection.query("" + sql4 + "",
                    (err, rows) => {
                    })
            }
            if ((!isNaN(orderid)) || (!isNaN(datetime)) || (!isNaN(mailtype)) || (!isNaN(mailtext) || (!isNaN(orderstatus)))) {
                sql3 = "INSERT INTO history (orderid, datetime, mailuser, mailtype, mailtext, orderstatus) VALUES ( '" + tsID + "', '" + datetime + "', '" + obj_user.mail + "', '" + mailtype + "', '" + mailtext + "', '" + orderstatus + "')";
                connection.query("" + sql3 + "",
                    (err, rows) => {
                    })
            }
            connection.query("" + sql1 + "", (err, rows) => {
                connection.release() // return the connection to pool
                if (!err) {
                    for (let i = 0; i < rows.length; i++) {
                        switch (rows[i].status) {
                            case 1:
                                statuscurrent = 'Antrag Entscheid';
                                break;
                            case 2:
                                statuscurrent = 'Antrag Entscheid';
                                break;
                            case 3:
                                statuscurrent = 'Antrag Entscheid';
                                break;
                            case 4:
                                statuscurrent = 'Antrag genehmigt';
                                break;
                            case 5:
                                statuscurrent = 'Antrag abgelehnt';
                                break;
                        }
                        // Create an object to save current row's data
                        let order = {
                            'orderid': rows[i].orderid,
                            'institut': (rows[i].institut === "undefined" ? " " : rows[i].institut),
                            'professur': (rows[i].professur === "undefined" ? " " : rows[i].professur),
                            'anrede': (rows[i].anrede === "undefined" ? " " : rows[i].anrede),
                            'vorname': (rows[i].vorname === "undefined" ? " " : rows[i].vorname),
                            'nachname': (rows[i].nachname === "undefined" ? " " : rows[i].nachname),
                            'email': (rows[i].email === "undefined" ? " " : rows[i].email),
                            'funktion': (rows[i].funktion === "undefined" ? " " : rows[i].funktion),
                            'studiengang': (rows[i].studiengang === "undefined" ? " " : rows[i].studiengang),
                            'modulanlass': (rows[i].modulanlass === "undefined" ? " " : rows[i].modulanlass),
                            'szenario': (rows[i].szenario === "undefined" ? " " : rows[i].szenario),
                            'softwarename': (rows[i].softwarename === "undefined" ? " " : rows[i].softwarename),
                            'softwarewebseite': (rows[i].softwarewebseite === "undefined" ? " " : rows[i].softwarewebseite),
                            'softwareversion': (rows[i].softwareversion === "undefined" ? " " : rows[i].softwareversion),
                            'softwareupdate': (rows[i].softwareupdate === "undefined" ? " " : rows[i].softwareupdate),
                            'softwareupdatewelches': (rows[i].softwareupdatewelches === "undefined" ? " " : rows[i].softwareupdatewelches),
                            'lizenzenanzahl': (rows[i].lizenzenanzahl === "undefined" ? " " : rows[i].lizenzenanzahl),
                            'nutzeranzahl': (rows[i].nutzeranzahl === "undefined" ? " " : rows[i].nutzeranzahl),
                            'nutzungsdauer': (rows[i].nutzungsdauer === "undefined" ? " " : rows[i].nutzungsdauer),
                            'nutzungsdauertext': (rows[i].nutzungsdauertext === "undefined" ? " " : rows[i].nutzungsdauertext),
                            'betriebssystem': (rows[i].betriebssystem === "undefined" ? " " : rows[i].betriebssystem),
                            'browser': (rows[i].browser === "undefined" ? " " : rows[i].browser),
                            'softwareverfuegung': (rows[i].softwareverfuegung === "undefined" ? " " : rows[i].softwareverfuegung),
                            'softwareinteresse': (rows[i].softwareinteresse === "undefined" ? " " : rows[i].softwareinteresse),
                            'softwareinstitut': (rows[i].softwareinstitut === "undefined" ? " " : rows[i].softwareinstitut),
                            'softwarehochschinteresse': (rows[i].softwarehochschinteresse === "undefined" ? "" : rows[i].softwarehochschinteresse),
                            'softwarehochschule': (rows[i].softwarehochschule === "undefined" ? " " : rows[i].softwarehochschule),
                            'lizenzinstitution': (rows[i].lizenzinstitution === "undefined" ? " " : rows[i].lizenzinstitution),
                            'lizenzart': (rows[i].lizenzart === "undefined" ? " " : rows[i].lizenzart),
                            'lizenzkosten': (rows[i].lizenzkosten === "undefined" ? " " : rows[i].lizenzkosten),
                            'vergleichbarkeit': (rows[i].vergleichbarkeit === "undefined" ? " " : rows[i].vergleichbarkeit),
                            'support': (rows[i].support === "undefined" ? " " : rows[i].support),
                            'cloud': (rows[i].cloud === "undefined" ? " " : rows[i].cloud),
                            'cloudwo': (rows[i].cloudwo === "undefined" ? " " : rows[i].cloudwo),
                            'productowner': (rows[i].productowner === "undefined" ? " " : rows[i].productowner),
                            'bemerkungen': (rows[i].bemerkungen === "undefined" ? " " : rows[i].bemerkungen),
                            'datumantrag': (rows[i].datumantrag === "undefined" ? " " : rows[i].datumantrag),
                            'notizen': (rows[i].notizen === "undefined" ? " " : rows[i].notizen),
                            'status': rows[i].status
                        }
                        // Add object into array
                        anrede = rows[i].anrede;
                        nachname = rows[i].nachname;
                        email = rows[i].email;
                        orderid = rows[i].orderid;
                        softwarename = rows[i].softwarename;
                        softwareListDetails.push(order);
                    }
                } else {
                    console.log(err)
                }
                if ((mailtype == 2) && (typeof statuschange != 'undefined') && (typeof email != 'undefined')) {
                    let transport2 = nodemailer.createTransport({
                        host: "lmailer.fhnw.ch",
                        secure: false, // use SSL
                        port: 25,
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
                    let messageSender2 = {
                        // sender info
                        from: 'Santra <applprojekte.ph@fhnw.ch>',
                        // Comma separated list of recipients
                        to: email, //NICHT ABÄNDERN EMAIL
                        bcc: 'applprojekte.ph@fhnw.ch',
                        // Subject of the message
                        subject: 'Santra: Antrag Nummer #' + orderid + '',

                        // plaintext body
                        text: mailtext,
                        // HTML body
                        html: '' + mailtext
                    };
                    transport2.sendMail(messageSender2, function (error) {
                        if (error) {
                            console.log('Error occured');
                            console.log(error.message);
                            return;
                        }
                        transport2.close();
                    });
                } else if ((status == 1) && (typeof email != 'undefined')) {
                    let transport2 = nodemailer.createTransport({
                        host: "lmailer.fhnw.ch",
                        secure: false, // use SSL
                        port: 25,
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
                    let messageSender2 = {
                        // sender info
                        from: 'Santra <applprojekte.ph@fhnw.ch>',

                        // Comma separated list of recipients
                        to: email, //NICHT ABÄNDERN EMAIL
                        // Subject of the message
                        subject: "Santra: Antrag Nummer #" + orderid + " in bearbeitung",

                        // plaintext body
                        text: 'Guten Tag ' + anrede + ' ' + nachname + ', Ihr Antrag wurde zur Bearbeitung weitergeleitet. Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid=' + orderid + ' nach der Anmeldung. \n' +
                            '\n' +
                            'Vielen Dank und freundliche Grüsse \n' +
                            'Ihr ApplProjekte Supportteam \n' +
                            'n|w\n',
                        // HTML body
                        html: '<p><span>Guten Tag ' + anrede + ' ' + nachname + '</span><p>Ihr Antrag wurde von unserem System entgegengenommen und zur Bearbeitung an das entsprechende Team weitergeleitet.' +
                            '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid=' + orderid + ' nach der Anmeldung.' +
                            '</br></br>Vielen Dank und freundliche Grüsse' +
                            '</br>Ihr ApplProjekte Supportteam ' +
                            '</br>n|w</p>'
                    };
                    let messageSupport2 = {
                        // sender info
                        from: 'Santra <applprojekte.ph@fhnw.ch>',
                        // Comma separated list of recipients
                         to: 'Applprojekte Team <applprojekte.ph@fhnw.ch>',
                       // to: '<alesya.heymann@fhnw.ch>',
                        // Subject of the message
                        subject: "Santra: Antrag Nummer #" + orderid + "",
                        // plaintext body
                        text: 'Liebes Applprojekte Team</br></br>Ein neuer Antrag ist eingegangen: </br>Antrag Nummer ' + orderid + ' </br> Name der Software ' + softwarename + ' </br>Direktlinkt auf Antrag: http://santra.ph.fhnw.ch/details?tsid=' + orderid + ' </br></br>Vielen Dank und freundliche Grüsse </br>Ihr ApplProjekte Supportteam </br>n|w',
                        // HTML body
                        html: '<p><span>Liebes Applprojekte Team</span></br></br><p>Ein neuer Antrag ist eingegangen: </br>Antrag Nummer ' + orderid + ' </br> Name der Software ' + softwarename + ' </br>Direktlinkt auf Antrag: http://santra.ph.fhnw.ch/details?tsid=' + orderid + ' </br></br>Vielen Dank und freundliche Grüsse </br>Ihr ApplProjekte Supportteam </br>n|w</p>'

                    };
                    transport2.sendMail(messageSender2, function (error) {
                        if (error) {
                            console.log('Error occured');
                            console.log(error.message);
                            return;
                        }
                        console.log('Message sent successfully!');
                        transport2.close();
                    });
                    transport2.sendMail(messageSupport2, function (error) {
                        transport2.close();
                    });
                }
            })

            setTimeout(
                function () {
                    res.render('layout_details', {
                        "softwareListDetails": softwareListDetails,
                        "statuscurrent": statuscurrent,
                        "vornamelog": obj_user.givenName,
                        "nachnamelog": obj_user.surname,
                        "admin": adminlog
                    });
                }, 500);

        })

    };
};

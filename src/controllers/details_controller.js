let db = require('../libs/db');
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
    this.main = function (req, res, next) {
        let tsID = parseInt(req.query.tsid);
        let datetime = req.query.datetime;
        let mailuser = req.query.mailuser;
        let mailtype = req.query.mailtype;
        let anrede;
        let nachname;
        let email;
        let orderid;
        let statuschange =  parseInt(req.query.statuschange);
        console.log(statuschange);

        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        if(CONSTANTS.SETTINGS.WEB.SUB_PATH)
            page.path = "/"+CONSTANTS.SETTINGS.WEB.PATH_STRING;
        else
            page.path = "";
        pool.getConnection((err, connection) => {
            if(err) throw err
            let softwareListDetails = [];
            sql1 = 'SELECT * FROM orders WHERE (userid IN (SELECT id FROM users) AND orderid IN (SELECT '+tsID+' FROM orders))';
            let statusset = parseInt(req.query.status);
            let mailt = req.query.mailtext;
            if ( (!isNaN(statuschange))) {
                sql4 = 'UPDATE orders SET status='+statuschange+' WHERE orderid IN (SELECT '+tsID+' FROM orders)';
                connection.query(""+sql4+"",
                    (err, rows) => {
                    })
            }
           // deaktiviert for tests
           if ( (!isNaN(statusset))) {
                    sql2 = 'UPDATE orders SET status='+statusset+' WHERE orderid IN (SELECT '+tsID+' FROM orders)';
                    connection.query(""+sql2+"",
                        (err, rows) => {
                        })
                }
            if ( (!isNaN(orderid))||(!isNaN(datetime))||/*(!isNaN(mailuser))||*/(!isNaN(mailtype)) ) {
                sql3 = "INSERT INTO history (orderid, datetime, mailuser, mailtype, mailtext, orderstatus) VALUES ( '" + tsID + "', '" + datetime + "', 'alesya.heymann@fhnw.ch', '" + mailtype + "', '" + mailt + "', '" + statusset + "')";
                connection.query("" + sql3 + "",
                    (err, rows) => {
                    })
            }
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
                            'softwareupdate':rows[i].softwareupdate,
                            'softwareupdatewelches':rows[i].softwareupdatewelches,
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
                            'notizen': rows[i].notizen,
                            'userid':rows[i].userid,
                            'status':rows[i].status
                        }
                        // Add object into array
                         anrede = rows[i].anrede;
                         nachname = rows[i].nachname;
                         email = rows[i].email;
                         orderid = rows[i].orderid;
                         softwareListDetails.push(order);
                }
                }
                else {
                    console.log(err)
                }
                if(typeof statusset != 'undefined') {
                    if(statusset == 2){
                       let transport2 = nodemailer.createTransport("SMTP", {
                           host: "lmailer.fhnw.ch",
                           port: 25
                       });
                       let messageSender2 = {
                           // sender info
                           from: 'Santra <applprojekte.ph@fhnw.ch>',
                           // Comma separated list of recipients
                           //to: '+nachname+ <'+email+'>',
                           to: 'Heymann <alesya.heymann@fhnw.ch>',
                           // Subject of the message
                           subject: 'Santra: Antrag Nummer #'+orderid+'',

                           // plaintext body
                           text: mailt,
                           // HTML body
                           html: ''+mailt
                       };
                        transport2.sendMail(messageSender2, function(error){
                                if(error){
                                    console.log('Error occured');
                                    console.log(error.message);
                                    return;
                                }

                                console.log('2Message sent successfully!');
                                transport2.close();
                            });
                   }
                         else if (statusset == 3)  {
                       console.log('status3');
                       let transport2 = nodemailer.createTransport("SMTP", {
                           host: "lmailer.fhnw.ch",
                           port: 25
                       });
                       let messageSender2 = {
                           // sender info
                           from: 'Santra 2 <applprojekte.ph@fhnw.ch>',

                           // Comma separated list of recipients
                           to: '+nachname+ <'+email+'>',

                           // Subject of the message
                           subject: 'Santra 2: Antrag Nummer XY in bearbeitung',

                           // plaintext body
                           text: '2 Guten Tag '+anrede+' '+nachname+', Ihr Antrag wurde zur Bearbeitung weitergeleitet. Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung. \n' +
                               '\n' +
                               'Vielen Dank und freundliche Grüsse \n' +
                               'Ihr ApplProjekte Supportteam \n' +
                               'n|w\n',
                           // HTML body
                           html:'<p><span>Guten Tag '+anrede+' '+nachname+'</span><p>Ihr Antrag wurde von unserem System entgegengenommen und zur Bearbeitung an das entsprechende Team weitergeleitet.' +
                               '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                               '</br>Vielen Dank und freundliche Grüsse' +
                               '</br>Ihr ApplProjekte Supportteam ' +
                               '</br>n|w</p>'
                       };
                       let messageSupport2 = {
                           // sender info
                           from: 'Santra <applprojekte.ph@fhnw.ch>',
                           // Comma separated list of recipients
                           //to: 'Applprojekte Team <applprojekte.ph@fhnw.ch>',
                           to: '<alesya.heymann@fhnw.ch>',
                           // Subject of the message
                           subject: 'Status 2 Santra: Antrag Nummer XY ✔',
                           // plaintext body
                           text: ''+orderid+'Liebes Applprojekte Team, neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung. \n' +
                               '\n' +
                               'freundliche Grüsse \n' +
                               'Santra Softwareantrag Software \n' +
                               'n|w\n',
                           // HTML body
                           html:'<p><span>1 Status Liebes Applprojekte Team</span><p>neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung.' +
                               '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                               '</br>Vielen Dank und freundliche Grüsse' +
                               '</br>Ihr ApplProjekte Supportteam ' +
                               '</br>n|w</p>'
                       };
                       transport2.sendMail(messageSender2, function(error){
                           if(error){
                               console.log('Error occured');
                               console.log(error.message);
                               return;
                           }
                           console.log('Message sent successfully!');
                           transport2.close();
                       });
                       transport2.sendMail(messageSupport2, function(error){
                           transport2.close();
                       });
                        }
                        else if (statusset == 4) {
                       console.log('status4');
                       let transport3 = nodemailer.createTransport("SMTP", {
                           host: "lmailer.fhnw.ch",
                           port: 25
                       });
                       let messageSender3 = {
                           // sender info
                           from: '3 Santra <applprojekte.ph@fhnw.ch>',

                           // Comma separated list of recipients
                           to: '+nachname+ <'+email+'>',

                           // Subject of the message
                           subject: 'Santra 3: Antrag Nummer XY in bearbeitung',

                           // plaintext body
                           text: '3 Guten Tag '+anrede+' '+nachname+', Ihr Antrag wurde zur Bearbeitung weitergeleitet. Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung. \n' +
                               '\n' +
                               'Vielen Dank und freundliche Grüsse \n' +
                               'Ihr ApplProjekte Supportteam \n' +
                               'n|w\n',
                           // HTML body
                           html:'<p><span>Guten Tag '+anrede+' '+nachname+'</span><p>Ihr Antrag wurde von unserem System entgegengenommen und zur Bearbeitung an das entsprechende Team weitergeleitet.' +
                               '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                               '</br>Vielen Dank und freundliche Grüsse' +
                               '</br>Ihr ApplProjekte Supportteam ' +
                               '</br>n|w</p>'
                       };
                       let messageSupport3 = {
                           // sender info
                           from: '3 Santra <applprojekte.ph@fhnw.ch>',
                           // Comma separated list of recipients
                           //to: 'Applprojekte Team <applprojekte.ph@fhnw.ch>',
                           to: '<alesya.heymann@fhnw.ch>',
                           // Subject of the message
                           subject: 'Status 3 Santra: Antrag Nummer XY ✔',
                           // plaintext body
                           text: ''+orderid+'Liebes Applprojekte Team, neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung. \n' +
                               '\n' +
                               'freundliche Grüsse \n' +
                               'Santra Softwareantrag Software \n' +
                               'n|w\n',
                           // HTML body
                           html:'<p><span>3 Status Liebes Applprojekte Team</span><p>neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung.' +
                               '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                               '</br>Vielen Dank und freundliche Grüsse' +
                               '</br>Ihr ApplProjekte Supportteam ' +
                               '</br>n|w</p>'
                       };
                       transport3.sendMail(messageSender3, function(error){
                           if(error){
                               console.log('Error occured');
                               console.log(error.message);
                               return;
                           }
                           console.log('Message sent successfully!');
                           transport3.close();
                       });
                       transport3.sendMail(messageSupport3, function(error){
                           transport3.close();
                       });
                   }

                            else if (statusset==5){
                       console.log('status5');
                       let transport4 = nodemailer.createTransport("SMTP", {
                           host: "lmailer.fhnw.ch",
                           port: 25
                       });
                       let messageSender4 = {
                           // sender info
                           from: 'Status 4 Santra <applprojekte.ph@fhnw.ch>',

                           // Comma separated list of recipients
                           to: '+nachname+ <'+email+'>',

                           // Subject of the message
                           subject: 'Santra 4: Antrag Nummer XY in bearbeitung',

                           // plaintext body
                           text: '4 Guten Tag '+anrede+' '+nachname+', Ihr Antrag wurde zur Bearbeitung weitergeleitet. Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung. \n' +
                               '\n' +
                               'Vielen Dank und freundliche Grüsse \n' +
                               'Ihr ApplProjekte Supportteam \n' +
                               'n|w\n',
                           // HTML body
                           html:'<p><span>Guten Tag '+anrede+' '+nachname+'</span><p>Ihr Antrag wurde von unserem System entgegengenommen und zur Bearbeitung an das entsprechende Team weitergeleitet.' +
                               '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                               '</br>Vielen Dank und freundliche Grüsse' +
                               '</br>Ihr ApplProjekte Supportteam ' +
                               '</br>n|w</p>'
                       };
                       let messageSupport4 = {
                           // sender info
                           from: 'Santra Status 4 <applprojekte.ph@fhnw.ch>',
                           // Comma separated list of recipients
                           //to: 'Applprojekte Team <applprojekte.ph@fhnw.ch>',
                           to: '<alesya.heymann@fhnw.ch>',
                           // Subject of the message
                           subject: 'Status 4 Santra: Antrag Nummer XY ✔',
                           // plaintext body
                           text: ''+orderid+'Liebes Applprojekte Team, neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung. \n' +
                               '\n' +
                               'freundliche Grüsse \n' +
                               'Santra Softwareantrag Software \n' +
                               'n|w\n',
                           // HTML body
                           html:'<p><span>4 Status Liebes Applprojekte Team</span><p>neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung.' +
                               '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                               '</br>Vielen Dank und freundliche Grüsse' +
                               '</br>Ihr ApplProjekte Supportteam ' +
                               '</br>n|w</p>'
                       };
                       transport4.sendMail(messageSender4, function(error){
                           if(error){
                               console.log('Error occured');
                               console.log(error.message);
                               return;
                           }
                           //console.log('4Message sent successfully!');
                           transport4.close();
                       });
                       transport4.sendMail(messageSupport4, function(error){
                           transport4.close();
                       });
                   }

                            else if(statusset == 5){
                       console.log('status5');
                       let transport5 = nodemailer.createTransport("SMTP", {
                           host: "lmailer.fhnw.ch",
                           port: 25
                       });
                       let messageSender5 = {
                           // sender info
                           from: 'Status 5 Santra <applprojekte.ph@fhnw.ch>',

                           // Comma separated list of recipients
                           to: '+nachname+ <'+email+'>',

                           // Subject of the message
                           subject: 'Santra 5: Antrag Nummer XY in bearbeitung',

                           // plaintext body
                           text: '5 Guten Tag '+anrede+' '+nachname+', Ihr Antrag wurde zur Bearbeitung weitergeleitet. Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung. \n' +
                               '\n' +
                               'Vielen Dank und freundliche Grüsse \n' +
                               'Ihr ApplProjekte Supportteam \n' +
                               'n|w\n',
                           // HTML body
                           html:'<p><span>Guten Tag '+anrede+' '+nachname+'</span><p>Ihr Antrag wurde von unserem System entgegengenommen und zur Bearbeitung an das entsprechende Team weitergeleitet.' +
                               '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                               '</br>Vielen Dank und freundliche Grüsse' +
                               '</br>Ihr ApplProjekte Supportteam ' +
                               '</br>n|w</p>'
                       };
                       let messageSupport5 = {
                           // sender info
                           from: 'Santra Status 5 <applprojekte.ph@fhnw.ch>',
                           // Comma separated list of recipients
                           //to: 'Applprojekte Team <applprojekte.ph@fhnw.ch>',
                           to: '<alesya.heymann@fhnw.ch>',
                           // Subject of the message
                           subject: 'Status 5 Santra: Antrag Nummer XY ✔',
                           // plaintext body
                           text: ''+orderid+'Liebes Applprojekte Team, neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung. \n' +
                               '\n' +
                               'freundliche Grüsse \n' +
                               'Santra Softwareantrag Software \n' +
                               'n|w\n',
                           // HTML body
                           html:'<p><span>5 Status Liebes Applprojekte Team</span><p>neues Antrag ist eingegangen. Eine Gesamtübersicht des Antrags erhalten Sie unter http://santra.ph.fhnw.ch nach der Anmeldung.' +
                               '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+orderid+' nach der Anmeldung.' +
                               '</br>Vielen Dank und freundliche Grüsse' +
                               '</br>Ihr ApplProjekte Supportteam ' +
                               '</br>n|w</p>'
                       };
                       transport5.sendMail(messageSender5, function(error){
                           if(error){
                               console.log('Error occured');
                               console.log(error.message);
                               return;
                           }
                           //  console.log('5Message sent successfully!');
                           transport5.close();
                       });
                       transport5.sendMail(messageSupport5, function(error){
                           transport5.close();
                       });
                   }
                }
            })

            setTimeout(
                function(){
                     res.render('layout_details', {
                         "softwareListDetails": softwareListDetails, "mailstatus": true
                     });
                }, 500);

        })

    };
};

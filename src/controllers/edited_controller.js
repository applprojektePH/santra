let db = require('../libs/db');
const mysql = require('mysql');
let CONSTANTS = require("../libs/constants");
const LOGIN = require("../login");
const nodemailer = require("nodemailer");
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
        let tsID = parseInt(req.query.tsid);
        let status = req.body.status;
        let sendorder;
        pool.getConnection((err, connection) => {
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
            let softwareversion = req.body.softwareversion;
            let softwareupdate = req.body.softwareupdate;
            let softwareupdatewelches = req.body.softwareupdatewelches;
            let lizenzenanzahl = req.body.lizenzenanzahl;
            let nutzeranzahl = req.body.nutzeranzahl;
            let nutzungsdauer = req.body.nutzungsdauer;
            let nutzungsdauertext = req.body.nutzungsdauertext;
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
            let notizen = req.body.notizen;
            let softwareListDetails = [];
            let anredeMail;
            if (status == 1) {
                if (anrede == "Neutrale Anrede"){
                    anredeMail = req.body.vorname +' '+req.body.nachname;
                }
                else{
                    anredeMail = anrede +' '+req.body.nachname;
                }
                sql = 'UPDATE orders SET institut="'+institut+'", professur="'+professur+'", anrede="'+anrede+'", nachname="'+nachname+'", vorname="'+vorname+'", email="'+email+'", funktion="'+funktion+'", studiengang="'+studiengang+'", modulanlass="'+modulanlass+'", szenario="'+szenario+'", softwarename="'+softwarename+'", softwarewebseite="'+softwarewebseite+'", softwareversion="'+softwareversion+'", softwareupdate="'+softwareupdate+'", softwareupdatewelches="'+softwareupdatewelches+'", lizenzenanzahl="'+lizenzenanzahl+'", nutzeranzahl="'+nutzeranzahl+'", nutzungsdauer="'+nutzungsdauer+'", nutzungsdauertext="'+nutzungsdauertext+'", betriebssystem="'+betriebssystem+'", browser="'+browser+'", softwareverfuegung="'+softwareverfuegung+'", softwareinteresse="'+softwareinteresse+'", softwareinstitut="'+softwareinstitut+'", softwarehochschinteresse="'+softwarehochschinteresse+'", softwarehochschule="'+softwarehochschule+'", lizenzinstitution="'+lizenzinstitution+'", lizenzart="'+lizenzart+'", lizenzkosten="'+lizenzkosten+'", vergleichbarkeit="'+vergleichbarkeit+'", support="'+support+'", cloud="'+cloud+'", cloudwo="'+cloudwo+'", productowner="'+productowner+'", bemerkungen="'+bemerkungen+'", notizen="'+notizen+'", status="'+status+'" WHERE orderid="'+tsID+'"'
                sendorder = 1;
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
                    to: email,

                    // Subject of the message
                    subject: "Santra: Antrag Nummer #"+tsID+" in bearbeitung",

                    // plaintext body
                    text: 'Guten Tag '+anredeMail+', Ihr Antrag wurde zur Bearbeitung weitergeleitet. Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+tsID+' nach der Anmeldung. \n' +
                        '\n' +
                        'Vielen Dank und freundliche Grüsse \n' +
                        'Ihr ApplProjekte Supportteam \n' +
                        'n|w\n',
                    // HTML body
                    html:'<p><span>Guten Tag '+anredeMail+'</span><p>Ihr Antrag wurde von unserem System entgegengenommen und zur Bearbeitung an das entsprechende Team weitergeleitet.' +
                        '</br>Eine Gesamtübersicht Ihrer Tickets erhalten Sie unter http://santra.ph.fhnw.ch/details?tsid='+tsID+' nach der Anmeldung.' +
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
                    subject: "Santra: Antrag Nummer #"+tsID+"",
                    // plaintext body
                    text: 'Liebes Applprojekte Team</br></br>Ein neuer Antrag ist eingegangen: </br>Antrag Nummer '+tsID+' </br> Name der Software '+softwarename+' </br>Direktlinkt auf Antrag: http://santra.ph.fhnw.ch/details?tsid='+tsID+' </br></br>Vielen Dank und freundliche Grüsse </br>Ihr ApplProjekte Supportteam </br>n|w',
                    // HTML body
                    html:'<p><span>Liebes Applprojekte Team</span></br></br><p>Ein neuer Antrag ist eingegangen: </br>Antrag Nummer '+tsID+' </br> Name der Software '+softwarename+' </br>Direktlinkt auf Antrag: http://santra.ph.fhnw.ch/details?tsid='+tsID+' </br></br>Vielen Dank und freundliche Grüsse </br>Ihr ApplProjekte Supportteam </br>n|w</p>'

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
                else if (status == 0) {
                sql = 'UPDATE orders SET institut="'+institut+'", professur="'+professur+'", anrede="'+anrede+'", nachname="'+nachname+'", vorname="'+vorname+'", email="'+email+'", funktion="'+funktion+'", studiengang="'+studiengang+'", modulanlass="'+modulanlass+'", szenario="'+szenario+'", softwarename="'+softwarename+'", softwarewebseite="'+softwarewebseite+'", softwareversion="'+softwareversion+'", softwareupdate="'+softwareupdate+'", softwareupdatewelches="'+softwareupdatewelches+'", lizenzenanzahl="'+lizenzenanzahl+'", nutzeranzahl="'+nutzeranzahl+'", nutzungsdauer="'+nutzungsdauer+'", nutzungsdauertext="'+nutzungsdauertext+'", betriebssystem="'+betriebssystem+'", browser="'+browser+'", softwareverfuegung="'+softwareverfuegung+'", softwareinteresse="'+softwareinteresse+'", softwareinstitut="'+softwareinstitut+'", softwarehochschinteresse="'+softwarehochschinteresse+'", softwarehochschule="'+softwarehochschule+'", lizenzinstitution="'+lizenzinstitution+'", lizenzart="'+lizenzart+'", lizenzkosten="'+lizenzkosten+'", vergleichbarkeit="'+vergleichbarkeit+'", support="'+support+'", cloud="'+cloud+'", cloudwo="'+cloudwo+'", productowner="'+productowner+'", bemerkungen="'+bemerkungen+'", notizen="'+notizen+'" WHERE orderid="'+tsID+'"'
                sendorder = 0;
                }
            connection.query(""+sql+"",
                (err, rows) => {
                connection.release() // return the connection to pool
                if (!err) {
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
                            'studiengang':rows[i].studiengang,
                            'modulanlass':rows[i].modulanlass,
                            'szenario':rows[i].szenario,
                            'softwarename':rows[i].softwarename,
                            'softwarewebseite':rows[i].softwarewebseite,
                            'softwareversion':rows[i].softwareversion,
                            'softwareupdate': rows[i].softwareupdate,
                            'softwareupdatewelches': rows[i].softwareupdatewelches,
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
                    res.render('layout_edited', {
                        "softwareListDetails": softwareListDetails,
                        "status": status,
                        "vornamelog": decodeURIComponent(obj_user.givenName),
                        "nachnamelog": decodeURIComponent(obj_user.surname),
                        "emaillog": obj_user.mail,
                        "sendorder": sendorder,
                        "admin": adminlog
                    });
                }, 500);
        })
    };
};

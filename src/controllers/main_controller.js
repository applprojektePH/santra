const mysql = require("mysql");
const CONSTANTS = require("../libs/constants");
const LOGIN = require("../login");
module.exports = function (models) {
    //const LOGIN = require("../login");
    let page = {};
    let CONSTANTS = require("../libs/constants");
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: CONSTANTS.SETTINGS.DB.HOST,
        user: CONSTANTS.SETTINGS.DB.USERNAME,
        password: CONSTANTS.SETTINGS.DB.PASSWORD,
        database: CONSTANTS.SETTINGS.DBNAME.NAME
    })
    this.main = function (req, res, next) {
        console.log(new Date().toLocaleString() + " - rendering main");
        /* USER start */
        let obj_user = {};
        let adminlog;
        req.rawHeaders.forEach(function (val, i) {
            if (i % 2 === 1) return;
            obj_user[val] = req.rawHeaders[i + 1];
        });
        JSON.stringify(obj_user);
        if ((obj_user.fhnwOeID).includes("FP")) {
            accesslog = true;
        } else {
            accesslog = false;
        }
        adminlog = LOGIN.admins.includes(obj_user.mail)
        /* USER end */

        // if(accesslog==true){
        // 	pool.getConnection((err, connection) => {
        // 		if (err) throw err
        // 		console.log('connected as id ' + connection.threadId)
        // 		//sql1 = "INSERT INTO users (id, email, vorname, nachname) SELECT (obj_user.mail, obj_user.givenName) FROM DUAL WHERE NOT EXISTS (SELECT * FROM users WHERE email=obj_user.mail)';
        // 		sql1 = "INSERT IGNORE INTO users ( email, vorname, nachname) SET ( '"+obj_user.mail+"', '"+obj_user.givenName+"', '"+obj_user.surname+"')";
        // 		connection.query(""+sql1+"",
        // 			(err, rows) => {
        // 			})
        // 	})
        // }
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        setTimeout(
            function () {
                res.render('layout', {
                    "vornamelog": obj_user.givenName,
                    "nachnamelog": obj_user.surname,
                    "admin": adminlog,
                    "access": accesslog
                });
            }, 500);
    };

};

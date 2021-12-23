const mysql = require("mysql");
const CONSTANTS = require("../libs/constants");
const LOGIN = require("../login");
module.exports = function (models) {
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

        if(accesslog==true){
        	pool.getConnection((err, connection) => {
        		if (err) throw err

                sql1 = "INSERT INTO users (email, vorname, nachname) SELECT '"+obj_user.mail+"', '"+decodeURIComponent(obj_user.givenName)+"', '"+decodeURIComponent(obj_user.surname)+"' FROM DUAL WHERE NOT EXISTS (SELECT * FROM users WHERE email='"+obj_user.mail+"')";
                connection.query(""+sql1+"",
        			(err, rows) => {
        			})
        	})
        }
        page.title = "Santra - Softwareantrag\n" +
            "Pädagogische Hochschule FHNW";
        setTimeout(
            function () {
                res.render('layout', {
                    "vornamelog": decodeURIComponent(obj_user.givenName),
                    "nachnamelog": decodeURIComponent(obj_user.surname),
                    "admin": adminlog,
                    "access": accesslog
                });
            }, 500);
    };

};

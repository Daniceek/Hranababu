/**
 * konfigurace pro MySQL v souboru app-config.json v nasledujici podobe:
 {
  "mysql": {
    "host": "...",
    "user": "...",
    "password": "...",
    "database": "..."
  }
 }
 */
const getAppConfig = require("./app-config.js").getAppConfig;
const mysql = require('mysql');

let connection;

exports.getConnection = function() {
    _checkDbConnection();
    return connection;
}

const _checkDbConnection = function() {
    if (connection) console.log(connection.state);
    if (connection && connection.state === 'authenticated') return;

    let cfg = getAppConfig();
    connection = mysql.createConnection({
        host: cfg.mysql.host,
        port: cfg.mysql.port,
        user: cfg.mysql.user,
        password: cfg.mysql.password,
        database: cfg.mysql.database
    });
    connection.connect(function(err) {
        if (err) {
            console.log('error when connecting to MySQL db:', err);
            console.log('reconnecting...');
            setTimeout(_checkDbConnection, 2000);
        } else {
            console.log("Connected!");
        }
    });
    connection.on('error', function(err) { //https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
        console.log('MySQL db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('reconnecting...');
            _checkDbConnection();
        } else {
            throw err;
        }
    });
}


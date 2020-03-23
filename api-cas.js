const dateFormat = require('dateformat');

exports.apiCas = function (req, res, obj) {
    let dt = new Date();
    obj.cas = dateFormat(dt, "HH:MM:ss");
}
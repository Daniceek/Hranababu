const uniqid = require("uniqid");

const PLAYER_COLOR = ["red","green","blue","orange","pink","magenta","white","black"];

let hraci = new Array();
let hraciArrayIndex = new Array();

exports.apiHraci = function (req, res, obj) {
    if (req.pathname.endsWith("/pripojit")) {
        obj.uid = uniqid();
        console.log("###"+obj.uid);
        let hrac = {};
        hrac.jmeno = req.parameters.jmeno;
        hrac.x = 100;
        hrac.y = 100;
        hrac.r = 10;
        hrac.c = PLAYER_COLOR[hraci.length % PLAYER_COLOR.length];
        hraciArrayIndex[obj.uid] = hraci.push(hrac) -1;
        let x = Math.random()*10;
        if (x < 5) {
            hrac.baba = true;
        } else {
            hrac.baba = false;
        }
    }
}

/**
 * vraci hrace podle jeho unikatniho id
 * @param uid
 * @returns {any}
 */
exports.hrac = function (uid) {
    return hraci[hraciArrayIndex[uid]];
}

/**
 * vraci seznam vsech hracu
 * @returns {any[]}
 */
exports.hraci = function () {
    return hraci;
}

/**
 * vraci seznam uid vsech hracu
 * @returns {any[]}
 */
exports.uids = function () {
    return Object.keys(hraciArrayIndex);
}
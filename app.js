const createSpaServer = require("spaserver").createSpaServer;
const apiDenVTydnu = require('./api-denvtydnu').apiDenVTydnu;
const apiCas = require('./api-cas').apiCas;
const apiDb = require('./api-db').apiDb;
const apiDbGen = require('./db-setup/api-db-gen').apiDbGen;

const PORT = 8080; //aplikace na Rosti.cz musi bezet na portu 8080
const API_HEAD = {
    "Content-type": "application/json"
};
const API_STATUS_OK = 0;
const API_STATUS_NOT_FOUND = -1;


//ssh -L 127.0.0.1:3306:store5.rosti.cz:3306 -p 16337 app@node-13.rosti.cz


function processApi(req, res) {
    console.log(req.pathname);
    res.writeHead(200, API_HEAD);
    let obj = {};
    obj.status = API_STATUS_OK;

    if (req.pathname === "/dbgen") { //v ostre aplikaci nebude toto treba
        apiDbGen(req, res, obj);
        return;
    }

    if (req.pathname === "/denvtydnu") {
        apiDenVTydnu(req, res, obj);
    } else if (req.pathname === "/cas") {
        apiCas(req, res, obj);
    } else if (req.pathname.startsWith("/db")) {
        apiDb(req, res, obj);
        return; //MySQL query je asynchronni
    } else {
        obj.status = API_STATUS_NOT_FOUND;
        obj.error = "API not found";
    }
    res.end(JSON.stringify(obj));
}

createSpaServer(PORT, processApi);

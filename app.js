const createSpaServer = require("spaserver").createSpaServer;
const apiDenVTydnu = require('./api-denvtydnu').apiDenVTydnu;
const apiCas = require('./api-cas').apiCas;
const apiHraci = require('./api-hraci').apiHraci;
const najdiHrace = require('./api-hraci').hrac;
const vsichniHraci = require('./api-hraci').hraci;
const uidVsechHracu = require('./api-hraci').uids;

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
    } else if (req.pathname.startsWith("/hraci")) {
        apiHraci(req, res, obj);
    } else {
        obj.status = API_STATUS_NOT_FOUND;
        obj.error = "API not found";
    }
    res.end(JSON.stringify(obj));
}

let srv = createSpaServer(PORT, processApi);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: srv });
wss.on('connection', ws => {
    ws.on('message', message => { //prijem zprav
        console.log(`Přijatá zpráva: ${message}`);
        let posunHrace = JSON.parse(message);
        let hrac = najdiHrace(posunHrace.uid);
        if (posunHrace.up) hrac.y -= 2;
        if (hrac.y < hrac.r) hrac.y = hrac.r;
        if (posunHrace.down) hrac.y += 2;
        if (hrac.y > 590) hrac.y = 590;
        if (posunHrace.left) hrac.x -= 2;
        if (hrac.x < hrac.r) hrac.x = hrac.r;
        if (posunHrace.right) hrac.x += 2;
        if (hrac.x > 790) hrac.x = 790;
        if (hrac.baba == true) hrac.jmeno = "MÁ JI";
        if (hrac.baba == false) hrac.jmeno = "NEMÁ JI";
        for (let uid of uidVsechHracu()) {
            if (uid === posunHrace.uid) continue;
            let h = najdiHrace(uid);
            if (Math.sqrt((hrac.x - h.x)*(hrac.x - h.x)+(hrac.y - h.y)*(hrac.y - h.y)) < (hrac.r + h.r) ) {
                if (hrac.baba === true) {
                    if (h.baba === false) {
                        hrac.baba = !hrac.baba;
                        h.baba = !h.baba;
                        hrac.x = Math.random() * 800, hrac.y = Math.random() * 600;
                    }
                }

            }

        }
    });
});

function broadcast() {
    let json = JSON.stringify(vsichniHraci());
    //odeslani zpravy vsem pripojenym klientum
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}
setInterval(broadcast, 10);
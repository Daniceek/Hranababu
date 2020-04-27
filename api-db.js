const getDbConnection = require("./db-mysql").getConnection;
const crypto = require("crypto");

const ID_LEN = 16;

exports.apiDb = function (req, res, obj) {
    let connection = getDbConnection();
    if (req.pathname.endsWith("/tridy")) {
        connection.query(
            `SELECT * FROM spaserverexample_tridy ORDER BY rocnik,oznaceni`,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.tridy = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/studenti")) {
        let qry = "SELECT s.id,s.jmeno,s.prijmeni,t.rocnik,t.oznaceni as 'oznaceni_tridy',s.cislo_podle_tridnice FROM spaserverexample_studenti s, spaserverexample_tridy t WHERE t.id=s.tridy_id";
        qry += " AND s.stav=1";
        if (req.parameters.trida) { //pokud je zadana trida, vybereme jen studenty z dane tridy
            qry += " AND t.id="+req.parameters.trida;
        }
        if (req.parameters.text) { //pokud je zadan vyhledavany text, vybereme jen studenty, jejichz jmeno nebo prijmeni obsahuje dany text
            qry += " AND (s.jmeno LIKE '%"+req.parameters.text+"%' OR s.prijmeni LIKE '%"+req.parameters.text+"%')";
        }
        qry += " ORDER BY prijmeni,jmeno,rocnik"; //setridime primarne podle prijmeni
        console.log(qry);
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.studenti = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/smazStudenta")) {
//        let qry = "DELETE FROM spaserverexample_studenti WHERE id="+req.parameters.id;
        let qry = "UPDATE spaserverexample_studenti SET stav = '2' WHERE id="+req.parameters.id;
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/pridejStudenta")) {
        let qry = "INSERT INTO spaserverexample_studenti (tridy_id, jmeno, prijmeni, cislo_podle_tridnice)";
        qry += " VALUES ('"+req.parameters.trida+"', '"+req.parameters.jmeno+"', '"+req.parameters.prijmeni+"', '0');";
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/upravStudenta")) {
        let qry = "UPDATE spaserverexample_studenti SET jmeno = '"+req.parameters.jmeno+"' WHERE id="+req.parameters.id;
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                }
                res.end(JSON.stringify(obj));
            }
        );
        //obdoba /pridejStudenta, ale bude to "UPDATE ... WHERE id=req.parameters.id"
    } else if (req.pathname.endsWith("/pridejUzivatele")) {
        let token = crypto.randomBytes(ID_LEN/2).toString("hex");
        let qry = "INSERT INTO uzivatele (jmeno, heslo, email, token)";
        qry += " VALUES ('"+req.parameters.jmeno+"', '"+req.parameters.heslo+"', '"+req.parameters.email+"', '"+token+"');";
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    const nodemailer = require('nodemailer');
                    const transporter = nodemailer.createTransport({
                        host: "smtp-mail.outlook.com", // hostname
                        secureConnection: false, // TLS requires secureConnection to be false
                        port: 587, // port for secure SMTP
                        tls: {
                            ciphers: 'SSLv3'
                        },
                        auth: {
                            user: 'novotny@porg.cz',
                            pass: 'DOPLNIT HESLO'
                        }
                    });
                    const mailOptions = {
                        from: '"Daniel Novotný " <novotny@porg.cz>', // sender address (who sends)
                        to: 'lsvejda@centrum.cz', // list of receivers (who receives)
                        subject: 'Testik', // Subject line
                        text: 'Testíček z Node.js', // plaintext body
                        html: `Potvrdte vas e-mail kliknutim <a href="http://localhost:8080/db/overUzivatele?token=${token}">zde</a>.`
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }

                        console.log('Message sent: ' + info.response);
                    });
                    let qry = "UPDATE uzivatele SET verified=1, token='' WHERE token='"+req.parameters.token+"'";


                }
                res.end(JSON.stringify(obj));
            }
        );
    } else {
        obj.status = -1;
        obj.error = "API not found";
        res.end(JSON.stringify(obj));
    }
}
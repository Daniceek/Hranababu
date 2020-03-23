const getDbConnection = require("../db-mysql").getConnection;

const MUZSKA_JMENA = ["Jiří", "Jan", "Petr", "Josef", "Pavel", "Martin", "Jaroslav", "Tomáš", "Miroslav", "Zdeněk", "František", "Václav", "Michal", "Milan", "Karel", "Jakub", "Lukáš", "David", "Vladimír", "Ladislav"];
const MUZSKA_PRIJMENI = ["Novák", "Svoboda", "Novotný", "Dvořák", "Černý", "Procházka", "Kučera", "Veselý", "Horák", "Němec", "Pokorný", "Marek", "Pospíšil", "Hájek", "Jelínek", "Král", "Růžička", "Beneš", "Fiala", "Sedláček", "Doležal", "Zeman", "Charvát", "Šulc", "Řezníček"];
const ZENSKA_JMENA = ["Marie", "Jana", "Eva", "Hana", "Anna", "Lenka", "Kateřina", "Věra", "Lucie", "Alena", "Petra", "Jaroslava", "Veronika", "Martina", "Jitka", "Tereza", "Ludmila", "Helena", "Michaela", "Zdeňka"];
const ZENSKA_PRIJMENI = ["Nováková", "Svobodová", "Novotná", "Dvořáková", "Černá", "Procházková", "Kučerová", "Veselá", "Horáková", "Němcová", "Pokorná", "Marková", "Pospíšilová", "Hájková", "Jelínková", "Králová", "Růžičková", "Benešová", "Fialová", "Sedláčková", "Doležalová", "Zemanová", "Charvátová", "Řezníčková"];

function nahodneCislo(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

exports.apiDbGen = function (req, res, obj) {
    const connection = getDbConnection();
    connection.query(
        `TRUNCATE spaserverexample_studenti`,
        function (err, rows) {
            if (err) {
                console.log(JSON.stringify({status: "Error", error: err}));
            } else {
                connection.query(
                    `TRUNCATE spaserverexample_tridy`,
                    function (err, rows) {
                        if (err) {
                            console.log(JSON.stringify({status: "Error", error: err}));
                        } else {
                            let qry = "INSERT INTO spaserverexample_tridy (rocnik, oznaceni, maturitni_rok) VALUES ";
                            obj.classes = 0;
                            for (let r = 1; r <= 4; r++) {
                                qry += `(${r},'A',${2024 - r}),`;
                                obj.classes++;
                                qry += `(${r},'B',${2024 - r}),`;
                                obj.classes++;
                            }
                            qry = qry.substr(0, qry.length - 1);
                            console.log(qry);
                            connection.query(
                                qry,
                                function (err, rows) {
                                    if (err) {
                                        console.log(JSON.stringify({status: "Error", error: err}));
                                    } else {
                                        let qry = "INSERT INTO spaserverexample_studenti (tridy_id, jmeno, prijmeni, cislo_podle_tridnice) VALUES ";
                                        obj.students = 0;
                                        for (let t = 1; t <= 8; t++) {
                                            let j, p;
                                            let pocStudentu = nahodneCislo(20, 30);
                                            for (let c = 1; c <= pocStudentu; c++) {
                                                if (nahodneCislo(1, 2) == 1) {
                                                    j = ZENSKA_JMENA[nahodneCislo(0, ZENSKA_JMENA.length - 1)];
                                                    p = ZENSKA_PRIJMENI[nahodneCislo(0, ZENSKA_PRIJMENI.length - 1)];
                                                } else {
                                                    j = MUZSKA_JMENA[nahodneCislo(0, MUZSKA_JMENA.length - 1)];
                                                    p = MUZSKA_PRIJMENI[nahodneCislo(0, MUZSKA_PRIJMENI.length - 1)];
                                                }
                                                qry += `(${t},'${j}','${p}',${c}),`;
                                                obj.students++;
                                            }
                                        }
                                        qry = qry.substr(0, qry.length - 1);
                                        console.log(qry);
                                        connection.query(
                                            qry,
                                            function (err, rows) {
                                                if (err) {
                                                    console.log(JSON.stringify({status: "Error", error: err}));
                                                } else {
                                                    res.end(JSON.stringify(obj));
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
}
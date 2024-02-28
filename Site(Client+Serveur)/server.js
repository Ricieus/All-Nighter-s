/*
    Importation des modules requis
*/
import express from "express";
import session from "express-session";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";
import { body, validationResult } from "express-validator";
import dateFormat from "dateformat";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
    Connect to server
*/
const server = app.listen(4000, function () {
    console.log("serveur fonctionne sur 4000... ! ");
});
/*
    Configuration de EJS
*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Utilisation des images statiques dans le fichier "images"
// Référence : https://expressjs.com/en/starter/static-files.html
app.use('/images', express.static(__dirname + '/views/images'));

app.get("/", function (req, res) {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/index", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.get('/pages/login', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/login", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.get('/contact', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/contact", {
            pageTitle: "Concessionnaire Rubious",
            items: result
            
        });
    });
});

//INSERT pour la page de contact
app.post('/contact/submit_contact', (req, res) => {
    var dateRendezVous =  dateFormat(2024-9-11, "yyyy-mm-dd");
    var raisonRendezVous = "Je veux poser une question";
    var extra = "test";
    var utilisateurs_id_utilisateurs = 1;

    console.log("test")

    var sql = "INSERT INTO contact (dateRendezVous, raisonRendezVous, extra, utilisateurs_id_utilisateurs) VALUES ('" + dateRendezVous + "','" + raisonRendezVous + "','" + extra + "','" + utilisateurs_id_utilisateurs + "')";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Insertion effectué");
    });
});

app.get('/pages/index', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/index", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.get('/pages/catalogue', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/catalogue", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

/*
    Importation de Bootstrap
*/
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap-select/dist/js"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap-select/dist/css"));
/*
    Connection au server MySQL
*/
const con = mysql.createConnection({
    host: "localhost",
    user: "scott",
    password: "oracle",
    database: "AllNighter"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected!");
});
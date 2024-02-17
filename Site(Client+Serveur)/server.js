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

app.get('/pages/login.ejs', (req, res) => {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err, result) {
        if (err) throw err;
        res.render("pages/login.ejs", {
            pageTitle: "Dealership Rubious",
            items: result
        });
    });
});
app.get('/pages/contact.ejs', (req, res) => {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err, result) {
        if (err) throw err;
        res.render("pages/contact.ejs", {
            pageTitle: "Dealership Rubious",
            items: result
        });
    });
});
app.get('/pages/login.ejs', (req, res) => {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err, result) {
        if (err) throw err;
        res.render("pages/login.ejs", {
            pageTitle: "Dealership Rubious",
            items: result
        });
    });
});
app.get('/pages/catalogue.ejs', (req, res) => {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err, result) {
        if (err) throw err;
        res.render("pages/catalogue.ejs", {
            pageTitle: "Dealership Rubious",
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
    database: "mybd"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected!");
});
/*
    Description des routes
*/
app.get("/", function (req, res) {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err, result) {
        if (err) throw err;
        res.render("pages/index.ejs", {
            pageTitle: "Dealership Rubious",
            items: result
        });
    });
});
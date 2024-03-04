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
import { uptime } from "process";

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

// Parse application/json et application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/pages/contact', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/contact", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

//INSERT pour la page de contact
app.post('/contact/submit_contact', [
    body('prenom').notEmpty().withMessage('Prénom est requis'),
    body('nomFamille').notEmpty().withMessage('Nom de Famille est requis'),
    body('courriel').isEmail().withMessage('Invalide email'),
    body('telephone').notEmpty().withMessage('Téléphone est requis'),
    body('daterendezvous').notEmpty().withMessage('La date de rendez-vous est requis'),
    body('raison').notEmpty().withMessage('Il faut selectionner une raison')
], (req, res) => {
    let prenom = req.body.prenom;
    let nom = req.body.nomFamille;
    let courriel = req.body.courriel;
    let telephone = req.body.telephone;

    let dateArray = req.body.daterendezvous.split("-");
    let year = dateArray[0];
    let month = parseInt(dateArray[1], 10) - 1;
    let date = dateArray[2];
    let _entryDate = new Date(year, month, date);

    let dateRendezVous = dateFormat(_entryDate, "yyyy-mm-dd");
    let raisonRendezVous = req.body.raison;
    let utilisateurs_id_utilisateurs = 1;

    var sql = "INSERT INTO contact (prenom, nom, courriel, telephone, dateRendezVous, raisonRendezVous, utilisateurs_id_utilisateurs) VALUES ('" + prenom + "','" + nom + "','" + courriel + "','" + telephone + "', '" + dateRendezVous + "','" + raisonRendezVous + "','" + utilisateurs_id_utilisateurs + "')";

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur insertion: Veuillez notifier Jad');
        }
        console.log("Insertion effectuée");
        res.redirect('/pages/contact');
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
    con.query("SELECT * FROM voitures", (err, results) => {
      if (err) throw err;
      res.render("pages/catalogue", {
        pageTitle: "Concessionnaire Rubious",
        items: results
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
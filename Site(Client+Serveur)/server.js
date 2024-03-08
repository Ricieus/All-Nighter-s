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
import { count } from "console";

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

//Connexion:
app.post('/login/submit_connexion', (req, res) => {
    let courriel = req.body.courrielConnexion;
    let motdePasse = req.body.motDePasseConnexion;
    console.log(courriel);
    console.log(motdePasse);

    var sql = "SELECT email, motdepasse FROM utilisateurs WHERE email = ? AND motdepasse = ?";

    con.query(sql, [courriel, motdePasse], function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.redirect("/pages/login");
        }else{
            res.redirect("/pages/index?error=invalid");
        }
    });
});



app.post('/login/submit_login', (req, res) => {
    let prenom = req.body.prenom;
    let nom = req.body.nom;
    let courriel = req.body.courriel;
    let telephone = req.body.telephone;
    let motdePasse = req.body.confirmerMotPasse;
    let adresse = req.body.adresse;

    var sql = "INSERT INTO utilisateurs (nom, prenom, email, motdepasse, telephone, adresse) VALUES ('" + nom + "','" + prenom + "','" + courriel + "','" + motdePasse + "','" + telephone + "','" + adresse + "')";

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur insertion: Veuillez notifier Marc');
        }
        console.log("Insertion effectuée");
        res.redirect('/');
    });
});


//INSERT pour la page de contact
app.post('/contact/submit_contact', (req, res) => {
    let prenom = req.body.prenom;
    let nom = req.body.nomFamille;
    let courriel = req.body.courriel;
    let telephone = req.body.telephone;
    let raisonRendezVous = req.body.raison;
    let utilisateurs_id_utilisateurs = 1;

    // Date de rendez-vous
    let dateRendezVous = req.body.daterendezvous ? "'" + req.body.daterendezvous + "'" : 'NULL';

    // Requête SQL d'insertion
    var sql = "INSERT INTO contact (prenom, nom, courriel, telephone, dateRendezVous, raisonRendezVous, utilisateurs_id_utilisateurs) VALUES ('" + prenom + "','" + nom + "','" + courriel + "','" + telephone + "'," + dateRendezVous + ",'" + raisonRendezVous + "','" + utilisateurs_id_utilisateurs + "')";

    // Exécuter la requête d'insertion
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
app.post('/catalogue/submit_catalogue', (req, res) => {
    const { marque, modele, prix } = req.body;

    // Initialiser la requête avec la sélection de base
    let query = "SELECT * FROM voitures WHERE 1=1";

    // Ajouter des conditions basées sur les valeurs sélectionnées
    if (marque) {
        query += ` AND marque = '${marque}'`;
    }

    if (modele) {
        query += ` AND modele = '${modele}'`;
    }

    if (prix) {
        query += ` AND prix <= ${prix}`;
    }

    // Exécuter la requête SQL
    con.query(query, (err, results) => {
        if (err) throw err;
        res.render("pages/catalogue", {
            pageTitle: "Concessionnaire Rubious",
            items: results
        });
    });
});

app.get('/get_marques', (req, res) => {
    con.query('SELECT DISTINCT marque FROM voitures', (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des marques :', err);
            res.status(500).send('Erreur lors de la récupération des marques');
            return;
        }
        const marques = rows.map(row => row.marque);
        res.json(marques);
    });
});

// Route pour récupérer les modèles depuis la base de données
app.get('/get_modeles', (req, res) => {
    const marque = req.query.marque; // Récupérer la marque sélectionnée depuis la requête
    const query = `SELECT DISTINCT modele FROM voitures WHERE marque = '${marque}'`;
    con.query(query, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des modèles :', err);
            res.status(500).send('Erreur lors de la récupération des modèles');
            return;
        }
        const modeles = rows.map(row => row.modele);
        res.json(modeles);
    });
});

//Test pour page paiement:
app.get('/pages/paiement', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/paiement", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

//End test

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
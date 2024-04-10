/*
    Importation des modules requis
*/
import express from "express";
import session from "express-session";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";
import { check, validationResult } from "express-validator";
import dateFormat from "dateformat";
import { uptime } from "process";
import { count } from "console";

import { executeOperations } from "./CrudMongoDB.js";
import { config } from "dotenv";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51OvpKQLJ3MC705wbYkC35Roo1dXsfBv8sTmqoksLDx4HyKMxraCAoJ6qKWtjkflxWKgeh185r3svPLyqgS5SYS1g00FIknoY1p');
config();

await executeOperations();
import { MongoClient } from 'mongodb';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uri = process.env.DB_URI;
const client = new MongoClient(uri);

/*
    Connect to server
*/

(async () => {
    await connectToMongo();
    await loadStripeObject();
    startServer();
})();

function startServer() {
    const server = app.listen(4000, () => {
        console.log("Server running on port 4000");
    });
}

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

// MongoDB Connection
//Aide avec ChatGPT pour troubleshoot les erreurs de connection entre MongoDB et MySQL à HTML(ejs)
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'AllNighter';
let db; // Declare db variable outside of MongoClient.connect

async function connectToMongo() {
    try {
        const client = await MongoClient.connect(uri);
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

async function loadStripeObject() {
    try {
        var stripe = await stripe('sk_test_51OvpKQLJ3MC705wbYkC35Roo1dXsfBv8sTmqoksLDx4HyKMxraCAoJ6qKWtjkflxWKgeh185r3svPLyqgS5SYS1g00FIknoY1p');
        app.set('stripe', stripe); // Set the stripe object in app for later use
        console.log(stripe);
        console.log('Stripe object loaded successfully');
    } catch (err) {
        console.error('Error loading Stripe:', err);
    }
}

// Define the route for fetching car information from MySQL and MongoDB
app.get('/detailee/:id_voiture', async (req, res) => {
    const carId = req.params.id_voiture;

    try {
        // Fetch basic car information from MySQL
        const sql = `SELECT * FROM voitures WHERE id_voiture = ${con.escape(carId)}`;
        const rows = await new Promise((resolve, reject) => {
            con.query(sql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        if (rows.length === 0) {
            console.error('Car not found in MySQL');
            res.status(404).send('Car not found');
            return;
        }

        const carInfo = rows; // Assuming only one row is returned

        // Fetch additional car information from MongoDB using the db variable
        if (!db) {
            console.error('MongoDB connection is not complete');
            res.status(500).send('Internal server error');
            return;
        }

        const collection = db.collection('voitureDetaille');
        const result = await collection.findOne({ _id: parseInt(carId) });

        // Check if car details are found in MongoDB
        if (!result) {
            console.error('Car details not found in MongoDB');
            res.status(404).send('Car details not found');
            return;
        }
        // Render the detailee page with car information
        res.render('pages/detailee', { carInfo, carDetails: [result] });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal server error');
    }
});

app.get("/", function (req, res) {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/index", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.get('/pages/connexion', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/connexion", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.get('/pages/inscription', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/inscription", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
})

app.get('pages/inscription', (req, res) => {
    res.redirect("pages/inscription");
});
app.get('pages/connexion', (req, res) => {
    res.redirect("pages/connexion");
})

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
app.post('/connexion/submit_connexion', (req, res) => {
    let courriel = req.body.courriel;
    let motDePasse = req.body.motDePasse;

    var sql = "SELECT email, motdepasse, nom, prenom FROM utilisateurs WHERE BINARY email = ? AND BINARY motdepasse = ?";

    con.query(sql, [courriel, motDePasse], function (err, result) {
        if (err) {
            console.error('Erreur lors de la requête SQL:', err);
            return res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
        }

        if (result.length > 0) {
            const nom = result[0].nom; //prendre le nom
            const prenom = result[0].prenom; //prendre le prenom
            res.json({ exists: true, nom, prenom }); // Changer "success" en "exists"
        } else {
            res.json({ exists: false }); // Changer "success" en "exists"
        }
    });
});




app.post('/inscription/submit_inscription', (req, res) => {
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
        setTimeout(function () { res.redirect('/'); }, 3000);

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

//Test pour page paiement:
app.get('/pages/commande', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/commande", {
            pageTitle: "Concessionnaire Rubious",
            items: result
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
const DOMAIN = 'http://localhost:4000';

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1P1LtWLJ3MC705wbISJ69Hte',
            quantity: 1,
          },
        ],
        mode: 'payment',
        return_url: `${DOMAIN}/return.html?session_id={CHECKOUT_SESSION_ID}`,
        automatic_tax: {enabled: true},
      });
    
      res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
    const session = await stripeTest.checkout.sessions.retrieve(req.query.session_id);
  
    res.send({
      status: session.status,
      customer_email: session.customer_details.email
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
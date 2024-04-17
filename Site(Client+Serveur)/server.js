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
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uri = process.env.DB_URI;
const client = new MongoClient(uri);

/*
    Connect to server
*/

(async () => {
    await connectToMongo();
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
app.post('/connexion/submit_connexion', async (req, res) => {
    try {
        const { courriel, motDePasse } = req.body;

        const sql = "SELECT email, motdepasse, nom, prenom FROM utilisateurs WHERE BINARY email = ?";
        con.query(sql, [courriel], async (err, result) => {
            if (err) {
                console.error('Erreur lors de la requête SQL:', err);
                return res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
            }

            if (result.length > 0) {
                const hashedPassword = result[0].motdepasse;
                const passwordMatch = await bcrypt.compare(motDePasse, hashedPassword);

                if (passwordMatch) {
                    const { nom, prenom } = result[0];
                    return res.json({ exists: true, nom, prenom }); // Changer "success" en "exists"
                }
            }

            res.json({ exists: false }); // Changer "success" en "exists"
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
    }
});



app.post('/inscription/submit_inscription', async (req, res) => {
    try {
        let prenom = req.body.prenom;
        let nom = req.body.nom;
        let courriel = req.body.courriel;
        let telephone = req.body.telephone;
        let motdePasse = req.body.confirmerMotPasse;
        let adresse = req.body.adresse;
        // Chiffrez le mot de passe
        const hashedPassword = await bcrypt.hash(motdePasse, 10); // 10 est le coût du hachage

        console.log(hashedPassword);

        var sql = "INSERT INTO utilisateurs (nom, prenom, email, motdepasse, telephone, adresse) VALUES ('" + nom + "','" + prenom + "','" + courriel + "','" + hashedPassword + "','" + telephone + "','" + adresse + "')";

        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).send('Erreur insertion: Veuillez notifier Marc');
            }
            setTimeout(function () { res.redirect('/'); }, 4000);
        });
    } catch (error) {
        console.error("Erreur lors du chiffrement du mot de passe :", error);
        return res.status(500).send('Erreur lors du chiffrement du mot de passe');
    }

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

//Test pour page paiement:
app.get('/pages/paiement', (req, res) => {
    const marque = req.query.marque;
    const taux = req.query.taux;
    const priceVoiture = req.query.price;

    res.render('pages/paiement', {
        pageTitle: 'Concessionnaire Rubious',
        marque,
        taux,
        priceVoiture
    });
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        let marque = req.body.marque;
        let taux = req.body.taux;
        let priceVoiture = req.body.price;

        let sanitizedPriceString = priceVoiture.replace(/[^0-9.-]/g, '');
        let priceNumber = parseFloat(sanitizedPriceString);

        // Create or retrieve a product in Stripe
        const productResponse = await stripe.products.search({
            query: `name:'${marque}'`,
        });

        let product; // Declare a new variable for the product

        if (productResponse.data.length === 0) {
            product = await stripe.products.create({
                name: marque,
            });
        } else {
            product = productResponse.data[0];
        }

        // Create or retrieve a price in Stripe
        const priceResponse = await stripe.prices.list({
            product: product.id,
            currency: 'cad',
            active: true,
        });

        let price;
        if (priceResponse.data.length > 0) {
            // Price already exists
            price = priceResponse.data[0];
        } else {
            // Create a new price if it doesn't exist
            price = await stripe.prices.create({
                currency: 'cad',
                unit_amount: priceNumber * 100, // Convert to cents
                product: product.id,
            });
        }

        // Create or retrieve a customer in Stripe
        // let customer;
        // const customerResponse = await stripe.customers.list({
        //     email: customerEmail,
        // });

        // if (customerResponse.data.length > 0) {
        //     // Customer already exists
        //     customer = customerResponse.data[0];
        // } else {
        //     // Create a new customer if it doesn't exist
        //     customer = await stripe.customers.create({
        //         email: customerEmail,
        //     });
        // }

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `${DOMAIN}/pages/commande`,
            automatic_tax: { enabled: true },
        });

        res.send({ clientSecret: session.client_secret });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

app.get('/session-status', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

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
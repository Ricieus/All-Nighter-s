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

        const sql = "SELECT email, motdepasse, nom, telephone, adresse, prenom, id_utilisateurs FROM utilisateurs WHERE BINARY email = ?";
        con.query(sql, [courriel], async (err, result) => {
            if (err) {
                console.error('Erreur lors de la requête SQL:', err);
                return res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
            }

            let userExists = false;
            let userData = {};

            for (let i = 0; i < result.length; i++) {
                const hashedPassword = result[i].motdepasse;
                const passwordMatch = await bcrypt.compare(motDePasse, hashedPassword);

                if (passwordMatch) {
                    const { nom, prenom, email, telephone, adresse, motdepasse, id_utilisateurs } = result[0];
                    return res.json({ exists: true, nom, prenom, email, telephone, adresse, motdepasse, id_utilisateurs }); // Changer "success" en "exists"
                }
            }

            if (userExists) {
                return res.json({ exists: true, userData });
            } else {
                return res.json({ exists: false });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
    }
});




app.post('/checkEmailExists', (req, res) => {
    const email = req.body.email;
    const checkEmailQuery = 'SELECT * FROM utilisateurs WHERE email = ?';
    con.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur serveur lors de la vérification de l\'email');
        }
        if (result.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    });
});
app.post('/checkEmailExists1', (req, res) => {
    const email1 = req.body.courriel;
    const checkEmailQuery = 'SELECT * FROM utilisateurs WHERE email = ?';
    con.query(checkEmailQuery, [email1], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur serveur lors de la vérification de l\'email');
        }
        if (result.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    });
});

// Endpoint pour gérer l'inscription
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

        // Vérifier si l'email existe déjà
        var checkEmailQuery = "SELECT * FROM utilisateurs WHERE email = ?";
        con.query(checkEmailQuery, [courriel], function (err, rows) {
            if (err) {
                console.log(err);
                return res.status(500).send('Erreur insertion: Veuillez notifier Marc');
            }
            if (rows.length > 0) {
                return res.status(400).send('Cet email est déjà utilisé. Veuillez en choisir un autre.');
            }

            // Insérer les données dans la base de données
            var insertQuery = "INSERT INTO utilisateurs (nom, prenom, email, motdepasse, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?)";
            con.query(insertQuery, [nom, prenom, courriel, hashedPassword, telephone, adresse], function (err, result) {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erreur insertion: Veuillez notifier Marc');
                }
                setTimeout(function () { res.redirect('/'); }, 4000);
            });
        });
    } catch (error) {
        console.error("Erreur lors du chiffrement du mot de passe :", error);
        return res.status(500).send('Erreur lors du chiffrement du mot de passe');
    }
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

app.get('/', (req, res) => {
    con.query("SELECT * FROM voitures", function (err, result) {
        if (err) throw err;
        res.redirect('/pages/index');
    });
});

app.get('/pages/index', async (req, res) => {

    try {
        // Fetch basic car information from MySQL
        const sql = `SELECT * FROM voitures`;
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
        const cursor = collection.find({});
        const result = await cursor.toArray();


        // Check if car details are found in MongoDB
        if (!result) {
            console.error('Car details not found in MongoDB');
            res.status(404).send('Car details not found');
            return;
        }
        // Render the detailee page with car information
        res.render('pages/index', { carInfo, carDetails: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal server error' + err);
    }
});

app.get('/pages/profile', (req, res) => {
    const sql = "SELECT * FROM utilisateurs";
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des informations des utilisateurs:', err);
            return res.status(500).send('Erreur serveur lors de la récupération des informations des utilisateurs');
        }
        // Assurez-vous que `results` est correctement défini avant d'accéder à ses propriétés
        res.render('pages/profile', {
            pageTitle: "Concessionnaire Rubious",
            items: results
        });
    });
});
app.post('/profile/submit_profil', async (req, res) => {
    // Récupérer les données du formulaire
    let prenom = req.body.prenom;
    let nom = req.body.nom;
    let courriel = req.body.courriel;
    let telephone = req.body.telephone;
    let motdePasse = req.body.motDePasse1;
    let adresse = req.body.adresse;
    let userId = req.body.userId1;
    const hashedPassword = await bcrypt.hash(motdePasse, 10); // 10 est le coût du hachage

    // Construire la requête SQL pour la mise à jour du profil
    var sql = "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?, motdepasse = ? WHERE id_utilisateurs = ?";

    // Exécuter la requête SQL avec les valeurs mises à jour
    con.query(sql, [nom, prenom, courriel, telephone, adresse, hashedPassword, userId], function (err, result) {
        if (err) {
            console.error('Erreur lors de la mise à jour du profil :', err);
            return res.status(500).send('Erreur serveur lors de la mise à jour du profil');
        }
        // Redirection vers la page de profil après la mise à jour
        res.redirect('/pages/profile');
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

    const marqueVoiture = req.query.marque;
    const prixDeVehicule = parseFloat(req.query.taux);
    const tauxInteret = parseFloat(req.query.price);


    res.render('pages/paiement', {
        pageTitle: 'Concessionnaire Rubious',
        marqueVoiture,
        tauxInteret,
        prixDeVehicule
    });
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        let marque = req.body.marque;
        let taux = req.body.taux;
        let priceNumber = req.body.price;

        const productResponse = await stripe.products.search({
            query: `name:'${marque}'`,
        });

        let product;

        if (productResponse.data.length === 0) {
            product = await stripe.products.create({
                name: marque,
            });
        } else {
            product = productResponse.data[0];
        }

        const priceResponse = await stripe.prices.list({
            product: product.id,
            currency: 'cad',
            active: true,
        });

        let price;
        if (priceResponse.data.length > 0) {
            price = priceResponse.data[0];
        } else {
            price = await stripe.prices.create({
                currency: 'cad',
                unit_amount: priceNumber * 100,
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

        let currentDate = new Date();

        let twoWeeksLater = new Date(currentDate.getTime() + (2 * 7 * 24 * 60 * 60 * 1000));

        let formattedDate = twoWeeksLater.toISOString().split('T')[0];

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `${DOMAIN}/pages/commande?produitNom=${product.name}&price=${price.unit_amount / 100}&date=${formattedDate}`,
            automatic_tax: { enabled: true },
        });

        res.send({ clientSecret: session.client_secret });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

app.get('/pages/administrateur', (req, res) => {
    con.query("SELECT * FROM voitures", function (err, result) {
        if (err) throw err;
        res.render("pages/administrateur", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.get('/pages/administrateurCommandes', (req, res) => {
    con.query("SELECT * FROM voitures", function (err, result) {
        if (err) throw err;
        res.render("pages/administrateurCommandes", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.get('/pages/administrateurGestionClient', (req, res) => {
    con.query("SELECT * FROM voitures", function (err, result) {
        if (err) throw err;
        res.render("pages/administrateurGestionClient", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.get('/pages/administrateurProduits', (req, res) => {
    con.query("SELECT * FROM voitures", function (err, result) {
        if (err) throw err;
        res.render("pages/administrateurProduits", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});

app.post('/command', async (req, res) => {
    try {
        let uri = process.env.DB_URI;
        let nomVoiture = req.body.nom;
        let prixVoiture = req.body.prix;
        let dateVoiture = req.body.date;
        let utilisateurActive = req.body.user;

        if (!client) {
            client = await connectToMongo(uri);
        }

        let database = client.db('AllNighter');
        let voitureDetailleCollection = database.collection('voitureDetaille');

        const voitureDetaille = await voitureDetailleCollection.findOne({ nom: nomVoiture });

        if (!voitureDetaille) {
            return res.status(404).send('Voiture non trouvée');
        }

        const image = voitureDetaille.images[0];

        let voitureCommandeCollection = database.collection('voitureCommande');

        const commandeInformation = {
            nom: nomVoiture,
            prix: prixVoiture,
            date: dateVoiture,
            utilisateur: utilisateurActive,
            image: image
        };

        await voitureCommandeCollection.insertOne(commandeInformation);

        res.status(200).send('Commande insérée avec succès');

    } catch (error) {
        console.error("Erreur lors de l'exécution des opérations:", error);
        res.status(500).send('Erreur interne du serveur');
    }
});

app.get('/getImageVoiture', async (req, res) => {
    let nomVoiture = req.body.nom;
    try {
        let uri = process.env.DB_URI;
        if (!client) {
            client = await connectToMongo(uri);
        }

        let database = client.db('AllNighter');
        let voitureDetailleCollection = database.collection('voitureCommande');
        const voitureDetaille = await voitureDetailleCollection.findOne({ nom: nomVoiture });

        res.json(voitureDetaille);

    } catch (error) {
        console.error("Erreur lors de l'exécution des opérations:", error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.post('/ajoutVoiture', async (req, res) => {

    let marque = req.body.marque;
    let modele = req.body.modele;
    let annee = req.body.annee;
    let prix = req.body.prix;
    let utilisateurs_id_utilisateurs = 1;
    let image = req.body.image;
    

    

    // Requête SQL d'insertion
    var sql = "INSERT INTO voitures (marque, modele, annee, prix, utilisateurs_id_utilisateurs, image,) VALUES ('" + marque + "','" + modele + "','" + annee + "','" + prix + "'," + utilisateurs_id_utilisateurs + ",'" + image + "')";

    // Exécuter la requête d'insertion
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur ajouter: Veuillez notifier Jad');
        }
        console.log("Ajout effectuée");
        res.redirect('/pages/adinistrateur');
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
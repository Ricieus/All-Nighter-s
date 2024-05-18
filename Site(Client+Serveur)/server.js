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
    res.render("pages/connexion", {
        pageTitle: "Concessionnaire Rubious"
    });
});

app.get('/pages/inscription', (req, res) => {
    res.render("pages/inscription", {
        pageTitle: "Concessionnaire Rubious"
    });
})

app.get('pages/inscription', (req, res) => {
    res.redirect("pages/inscription");
});
app.get('pages/connexion', (req, res) => {
    res.redirect("pages/connexion");
})

app.get('/pages/contact', (req, res) => {
    res.render("pages/contact", {
        pageTitle: "Concessionnaire Rubious"
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
    const email = req.body.courriel;
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
                const userId = result.insertId; // Récupérer l'ID de l'utilisateur inséré automatiquement
                res.status(201).json({ userId: userId });
            });
        });
    } catch (error) {
        console.error("Erreur lors du chiffrement du mot de passe :", error);
        return res.status(500).send('Erreur lors du chiffrement du mot de passe');
    }
});

app.post('/contact/submit_contact', (req, res) => {
    let prenom = req.body.prenom;
    let nom = req.body.nomFamille;
    let courriel = req.body.courriel;
    let telephone = req.body.telephone;
    let raisonRendezVous = req.body.raison;

    let dateRendezVous = req.body.daterendezvous ? "'" + req.body.daterendezvous + "'" : 'NULL';

    var sql = "INSERT INTO contact (prenom, nom, courriel, telephone, dateRendezVous, raisonRendezVous) VALUES ('" + prenom + "','" + nom + "','" + courriel + "','" + telephone + "'," + dateRendezVous + ",'" + raisonRendezVous + "')";

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur insertion: Veuillez notifier Jad');
        }
        console.log("Insertion effectuée");
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
        const cursor = collection.find({}).sort({ _id: 1 });
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


    // Construire la requête SQL pour la mise à jour du profil
    if (motdePasse) {
        const hashedPassword = await bcrypt.hash(motdePasse, 10); // 10 est le coût du hachage

        var sql = "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?, motdepasse = ? WHERE id_utilisateurs = ?";

        // Exécuter la requête SQL avec les valeurs mises à jour
        con.query(sql, [nom, prenom, courriel, telephone, adresse, hashedPassword, userId], function (err, result) {
            if (err) {
                console.error('Erreur lors de la mise à jour du profil :', err);
                return res.status(500).send('Erreur serveur lors de la mise à jour du profil');
            }
        });
    } else {
        var sql = "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ? WHERE id_utilisateurs = ?";

        // Exécuter la requête SQL avec les valeurs mises à jour
        con.query(sql, [nom, prenom, courriel, telephone, adresse, userId], function (err, result) {
            if (err) {
                console.error('Erreur lors de la mise à jour du profil :', err);
                return res.status(500).send('Erreur serveur lors de la mise à jour du profil');
            }
        });
    }



});

app.get('/pages/catalogue', async (req, res) => {
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

        // Fetch additional car information from MongoDB using the db variable
        if (!db) {
            console.error('MongoDB connection is not complete');
            res.status(500).send('Internal server error');
            return;
        }

        const collection = db.collection('voitureDetaille');
        const cursor = collection.find({});
        const carDetails = await cursor.toArray();

        // Check if car details are found in MongoDB
        if (!carDetails) {
            console.error('Car details not found in MongoDB');
            res.status(404).send('Car details not found');
            return;
        }

        // Render the detailee page with car information
        res.render('pages/catalogue', { items: rows, carDetails });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal server error' + err);
    }
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

app.get('/pages/paiement', (req, res) => {
    const marqueVoiture = req.query.marque;
    const prixDeVehicule = parseFloat(req.query.price);
    const tauxInteret = parseFloat(req.query.taux);


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
        let images = req.body.images;

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

app.get('/pages/administrateur', async (req, res) => {
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

        const items = rows; // Assuming only one row is returned

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
        res.render('pages/administrateur', { items, carDetails: [result] });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal server error' + err);
    }
});



app.get('/pages/administrateurMain', (req, res) => {
    con.query("SELECT * FROM utilisateurs", function (err, result) {
        if (err) throw err;
        res.render("pages/administrateurMain", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });
});


app.post('/updateProduct/:id', async (req, res) => {
    try {
        const { marque, modele, prix, annee, firstImage } = req.body;
        const idVoiture = req.params.id;

        const query = `UPDATE voitures SET marque = ?, modele = ?, prix = ?, annee = ?, image = ? WHERE id_voiture = ?`;
        con.query(query, [marque, modele, prix, annee, firstImage, idVoiture], (error, results) => {
            if (error) {
                console.error('Erreur lors de la mise à jour du produit:', error);
                return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du produit' });
            }
            res.json({ success: true, message: 'Mise à jour du produit effectuée avec succès' });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal server error');
    }
});


app.get('/getCarId/:id', (req, res) => {
    const idVoiture = req.params.id;

    con.query("SELECT * FROM voitures WHERE id_voiture = ?", idVoiture, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
})

async function getCarDetailsFromMongo(id) {

    try {
        // Connexion au client MongoDB

        const collection = db.collection('voitureDetaille');

        // Récupération des détails de la voiture basés sur l'ID
        const result = await collection.findOne({ _id: parseInt(id) });

        return result;
    } catch (err) {
        console.error('Erreur lors de la récupération des détails de la voiture depuis MongoDB:', err);
        throw err; // Propagez l'erreur pour la gérer plus tard
    }
}


// Route pour récupérer les détails de la voiture depuis MongoDB
app.get('/getCarDetails/:id', async (req, res) => {
    const idVoiture = req.params.id;

    try {
        const carDetails = await getCarDetailsFromMongo(idVoiture);

        if (!carDetails) {
            console.error('Détails de la voiture introuvables dans MongoDB');
            return res.status(404).send('Détails de la voiture introuvables');
        }

        res.json(carDetails); // Envoyez les détails de la voiture au frontend
    } catch (err) {
        console.error('Erreur lors de la récupération des détails de la voiture depuis MongoDB:', err);
        res.status(500).send('Erreur serveur lors de la récupération des détails de la voiture depuis MongoDB');
    }

});

app.post('/updateVoitureMongo/:id', async (req, res) => {
    let typeCarosserie = req.body.typeCarosserie;
    console.log(typeCarosserie);
    let typeGaz = req.body.typeGaz;
    let typeTraction = req.body.typeTraction;
    let productDescription = req.body.productDescription;
    let nbrCylindre = req.body.nbrCylindre;
    let typeConduit = req.body.typeConduit;
    let productImage = req.body.productImages;

    const idVoiture = req.params.id;
    const collection = db.collection('voitureDetaille');
    try {
        const result = await collection.updateOne(
            { _id: parseInt(idVoiture) },
            { $set: { corps: typeCarosserie, carburant: typeGaz, transmission: typeConduit, description: productDescription, moteur: nbrCylindre, pneus_bougent: typeTraction, images: productImage } }
        );

        if (result.modifiedCount === 1) {
            console.log('Voiture mise à jour avec succès dans MongoDB');
            res.status(200).json({ success: true, message: 'Voiture mise à jour avec succès' });
        } else {
            console.log('Aucune voiture trouvée avec l\'ID fourni dans MongoDB');
            res.status(404).json({ success: false, message: 'Voiture non trouvée dans MongoDB' });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la voiture dans MongoDB:', err);
        res.status(500).json({ success: false, error: 'Erreur serveur lors de la mise à jour de la voiture' });
    }
});



app.delete('/delete_voiture/:id', async (req, res) => {
    const idVoiture = req.params.id;

    con.query("DELETE FROM voitures WHERE id_voiture = ?", idVoiture, function (err, result) {
        if (err) throw err;
        res.render("pages/administrateur", {
            pageTitle: "Concessionnaire Rubious",
            items: result
        });
    });

    const collection = db.collection('voitureDetaille');

    try {
        const result = await collection.deleteOne({ _id: parseInt(idVoiture) });
        if (result.deletedCount === 1) {
            console.log('Car deleted successfully from MongoDB');
        } else {
            console.log('No car found with the provided ID in MongoDB');
        }
    } catch (err) {
        console.error('Error deleting car from MongoDB:', err);
    }
});

app.post('/command', (req, res) => {
    let uri = process.env.DB_URI;
    let nomVoiture = req.body.nom;
    let prixVoiture = req.body.prix;
    let dateVoiture = req.body.date;
    let utilisateurActive = req.body.user;

    const commandeInformation = {
        nom: nomVoiture,
        prix: prixVoiture,
        date: dateVoiture,
        utilisateur: utilisateurActive
    };

    try {
        let collection = db.collection('voitureCommande');

        collection.insertOne({ commandeInformation }, (err, result) => {
            if (err) {
                return res.status(500).send('Erreur insertion');
            }
        });

    } catch (error) {
        console.error("Error executing operations:", error);
    }
    // finally {
    //     if (mongoClient) {
    //         mongoClient.close(); // Close the MongoDB client
    //         console.log("MongoDB connection closed.");
    //     }
    // }
});

app.post('/getImageVoiture', async (req, res) => {
    let nomVoiture = req.body.nom;
    try {
        let voitureDetailleCollection = db.collection('voitureDetaille');
        const voitureDetaille = await voitureDetailleCollection.findOne({ nom: nomVoiture });
        res.json(voitureDetaille.images[0]);

    } catch (error) {
        console.error("Erreur lors de l'exécution des opérations:", error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.post('/ajoutVoiture', async (req, res) => {
    let id = parseInt(req.body.id);
    let marque = req.body.marque;
    let modele = req.body.modele;
    let prix = req.body.prix;
    let annee = req.body.annee;
    let productDescription = req.body.productDescription;
    let typeCarosserie = req.body.typeCarosserie;
    let typeGaz = req.body.typeGaz;
    let typeTraction = req.body.typeTraction;
    let nbrCylindre = req.body.nbrCylindre;
    let typeConduit = req.body.typeConduit;
    let images = req.body.images;

    let collection = db.collection('voitureDetaille');


    const ajoutInformation = {
        _id: id,
        nom: `${marque} ${modele} ${annee}`,
        corps: typeCarosserie,
        transmission: typeConduit,
        moteur: nbrCylindre,
        annee: annee,
        carburant: typeGaz,
        description: productDescription,
        pneus_bougent: typeTraction,
        images: images
    };

    try {
        collection.insertOne(ajoutInformation, (err, result) => {
            if (err) {
                return res.status(500).send('Erreur insertion');
            }
        });

    } catch (error) {
        console.error("Error executing operations:", error);
    }

    // Requête SQL d'insertion
    var sql = "INSERT INTO voitures (id_voiture, marque, modele, annee, prix, image) VALUES ('" + id + "','" + marque + "','" + modele + "','" + annee + "','" + prix + "','" + images[0] + "')";

    // Exécuter la requête d'insertion
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur ajouter: Veuillez notifier Jad');
        }
        console.log("complet");
        res.redirect('/pages/administrateur');
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

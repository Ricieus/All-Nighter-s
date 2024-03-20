// Dans le fichier "CrudMongoDB.js"

import { MongoClient } from "mongodb";

/*
    Connect to MongoDB
*/
export async function connectToMongo(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log("Connecting to MongoDB Atlas cluster...");
        await mongoClient.connect();
        console.log("Successfully connected to MongoDB Atlas!");

        return mongoClient;
    } catch (error) {
        console.error("Connection to MongoDB Atlas failed!", error);
        process.exit();
    }
}

/* 
    Exécuter des opérations de MongoDB
*/
export async function executeOperations() {
    const uri = process.env.DB_URI;
    let mongoClient;

    try {
        if (!mongoClient) {
            console.log(uri); // Log the URI only if mongoClient is not already initialized
            mongoClient = await connectToMongo(uri);
        }
        
        const database = mongoClient.db('AllNighter');
        const collection = database.collection('voitureDetaille');
        
        const toyota = {
            "corps": "Sedan",
            "transmission": "Automatique",
            "moteur": "4 cylindres",
            "prix_sans_taxes": 30000,
            "annee": 2021,
            "carburant": "Essence",
            "description": "Une sedan élégante et performante avec des caractéristiques avancées.",
            "pneus_bougent": "FWD",
            "tauxInteret": 6.99,
            "images": [
                "toyota_corrola.jpg",
                "toyota_corolla_2021_ext-cote.png",
                "toyota_corolla_2021_ext-der.png",
                "toyota_corolla_2021_int.jpg"
                
            ],
        };

        let result = await collection.deleteMany(toyota);
        result = await collection.insertOne(toyota);
        console.log(`Nouvelle voiture insérée avec l'ID : ${result.insertedId}`);
    } finally {
        // Do not close the connection here to maintain it for subsequent executions
    }
}


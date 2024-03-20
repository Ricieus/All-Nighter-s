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
        console.log(uri);
        mongoClient = await connectToMongo(uri);
        const database = mongoClient.db('AllNighter'); // Corrected database name
        const collection = database.collection('voitureDetaille'); // Corrected collection name

        const newCar = {
            "corps": "Berline",
            "transmission": "Automatique",
            "moteur": "6 cylindres",
            "prix_sans_taxes": 30000,
            "annee": 2023,
            "carburant": "Essence",
            "description": "Une berline élégante et performante avec des caractéristiques avancées.",
            "pneus_bougent": "AWD",
            "tauxInteret": 6.99
        };
        const result = await collection.insertOne(newCar);
        console.log(`Nouvelle voiture insérée avec l'ID : ${result.insertedId}`);
    } finally {
        await mongoClient.close();
    }
}

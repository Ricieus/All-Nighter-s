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
        process.exit(1); // Exit with error code 1
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
            console.log(uri);
            mongoClient = await connectToMongo(uri);
        }

        const database = mongoClient.db('AllNighter');
        const collection = database.collection('voitureDetaille');

        const voitures = [
            {
                "_id": 1,
                "corps": "Sedan",
                "transmission": "Automatique",
                "moteur": "4 cylindres",
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
                ]
            },
            {
                "_id": 2,
                "corps": "Sedan",
                "transmission": "Automatique",
                "moteur": "4 cylindres",
                "annee": 2022,
                "carburant": "Essence",
                "description": "Une sedan plus que confortable",
                "pneus_bougent": "FWD",
                "tauxInteret": 6.99,
                "images": [
                    "honda_civic.jpg",
                    "honda_civic_2022_ext-cote.avif",
                    "honda_civic_2022_ext-der.avif",
                    "honda_civic_2022_int.png"
                ]
            },
            {
                "_id": 3,
                "corps": "SUV",
                "transmission": "Automatique",
                "moteur": "4 cylindres",
                "annee": 2023,
                "carburant": "Essence",
                "description": "Une SUV plus que confortable",
                "pneus_bougent": "FWD",
                "tauxInteret": 6.99,
                "images": [
                    "honda_CRV.jpg",
                    "honda_crv_2023_ext-cote.avif",
                    "honda_crv_2023_ext-der.avif",
                    "honda_crv_2023_int.png"
                ]
            },
            {
                "_id": 4,
                "corps": "Sedan",
                "transmission": "Automatique",
                "moteur": "500km",
                "annee": 2021,
                "carburant": "Électrique",
                "description": "Une sedan plus que confortable",
                "pneus_bougent": "FWD",
                "tauxInteret": 6.99,
                "images": [
                    "teslaS.jpg",
                    "tesla_model_s_2021_ext-cote.jpeg",
                    "tesla_model_s_2021_ext-der.jpeg",
                    "tesla_model_s_2021_int.jpeg"
                ]
            },
            {
                "_id": 5,
                "corps": "Sedan",
                "transmission": "Automatique",
                "moteur": "500km",
                "annee": 2022,
                "carburant": "Électrique",
                "description": "Une sedan plus que confortable",
                "pneus_bougent": "RWD",
                "tauxInteret": 6.99,
                "images": [
                    "Tesla3.jpg",
                    "tesla_model_3_2022_ext-cote.jpeg",
                    "tesla_model_3_2022_ext-der.jpeg",
                    "tesla_model_3_2022_int.jpeg"
                ]
            },
            {
                "_id": 6,
                "corps": "SUV",
                "transmission": "Automatique",
                "moteur": "500km",
                "annee": 2022,
                "carburant": "Électrique",
                "description": "Une sedan plus que confortable",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "teslaX.jpg",
                    "tesla_model_x_2022_ext-cote.jpeg",
                    "tesla_model_x_2022_ext-der.jpeg",
                    "tesla_model_x_2022_int.jpeg"
                ]
            },
          
            {
                "_id": 7,
                "corps": "SUV",
                "transmission": "Automatique",
                "moteur": "500km",
                "annee": 2022,
                "carburant": "Électrique",
                "description": "Une sedan plus que confortable",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "teslaY.jpg",
                    "tesla_model_y_2023_ext-cote.jpeg",
                    "tesla_model_y_2023_ext-der.jpeg",
                    "tesla_model_y_2023_int.jpeg"
                ]
            },
                 
          
            {
                "_id": 8,
                "corps": "SUV",
                "transmission": "Automatique",
                "moteur": "6 cylindres",
                "annee": 2021,
                "carburant": "Essence",
                "description": "Une sedan plus que confortable",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "chevSilver.jpg",
                    "chevrolet_silverado_2021_ext-cote.avif",
                    "chevrolet_silverado_2021_ext-der.avif",
                    "chevrolet_silverado_2021_int.avif"
                ]
            }
        ];

        for (const voiture of voitures) {
            let result = await collection.deleteOne({ "_id": voiture._id });
            console.log(`${voiture.corps} supprimée : ${result.deletedCount} document(s) supprimé(s)`);
        }

        // Insérer les nouveaux documents
        const insertResults = await collection.insertMany(voitures);
        console.log("Insertion results:", insertResults);
        if (insertResults && insertResults.insertedCount > 0) {
            console.log("IDs of inserted documents:", insertResults.insertedIds);
            insertResults.insertedIds.forEach((insertedId, index) => {
                console.log(`Nouvelle ${voitures[index].corps} insérée avec l'ID : ${insertedId}`);
            });
        } else {
            console.error("Insertion failed or no documents were inserted.");
        }
        
    } catch (error) {
        console.error("Error executing operations:", error);
    } finally {
        if (mongoClient) {
            await mongoClient.close(); // Close the MongoDB client
            console.log("MongoDB connection closed.");
        }
    }
}

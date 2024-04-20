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
                "description": "La Toyota Corolla est une berline compacte fiable et économique, offrant une conduite confortable et une bonne économie de carburant, ce qui en fait un choix populaire pour les conducteurs du quotidien.",
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
                "description": "La Honda Civic est une voiture compacte réputée pour sa qualité de construction, sa fiabilité et ses performances équilibrées. Elle offre un intérieur spacieux et des technologies modernes, en faisant un choix attrayant pour une large gamme de conducteurs.",
                "pneus_bougent": "FWD",
                "tauxInteret": 6.99,
                "images": [
                    "honda_civic.avif",
                    "honda_civic_2022_ext-cote.jpg",
                    "honda_civic_2022_ext-der.jpg",
                    "honda_civic_2022_int.webp"
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
                "moteur": "500 km",
                "annee": 2021,
                "carburant": "Électrique",
                "description": "La Tesla Model S est une berline électrique haut de gamme offrant des performances impressionnantes, une autonomie étendue et un intérieur luxueux. Elle est souvent saluée pour ses caractéristiques de conduite semi-autonome et son design avant-gardiste.",
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
                "moteur": "500 km",
                "annee": 2022,
                "carburant": "Électrique",
                "description": "La Tesla Model 3 est une berline électrique de taille moyenne offrant une autonomie compétitive, des performances rapides et une multitude de fonctionnalités de conduite assistée. Son design épuré et son interface utilisateur minimaliste la distinguent sur le marché.",
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
                "moteur": "500 km",
                "annee": 2022,
                "carburant": "Électrique",
                "description": "Le Tesla Model X est un SUV électrique de luxe offrant une autonomie impressionnante, des performances de pointe et des portes arrière à ouverture falcon-wing distinctives. Son intérieur spacieux et ses fonctionnalités de sécurité avancées en font un choix prisé pour les familles.",
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
                "moteur": "500 km",
                "annee": 2022,
                "carburant": "Électrique",
                "description": "Le Tesla Model Y est un SUV électrique compact offrant une combinaison de performances électriques, d'autonomie et de polyvalence. Avec une conception similaire à la Model 3 mais avec plus d'espace intérieur et une hauteur de conduite surélevée, il attire les conducteurs à la recherche d'un véhicule familial moderne.",
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
                "description": "Le Chevrolet Silverado est un pick-up pleine grandeur réputé pour sa robustesse, sa capacité de remorquage et son choix de moteurs puissants. Il offre également un intérieur confortable et une gamme de fonctionnalités technologiques pour répondre aux besoins des conducteurs travaillant sur les chantiers ou ceux ayant besoin d'un véhicule utilitaire.",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "chevSilver.jpg",
                    "chevrolet_silverado_2021_ext-cote.avif",
                    "chevrolet_silverado_2021_ext-der.avif",
                    "chevrolet_silverado_2021_int.avif"
                ]
            },
            {
                "_id": 9,
                "corps": "SUV",
                "transmission": "Automatique",
                "moteur": "8 cylindres",
                "annee": 2023,
                "carburant": "Essence",
                "description": "Le Chevrolet Tahoe est un SUV pleine grandeur offrant une capacité de remorquage impressionnante, un intérieur spacieux et un confort de conduite supérieur. Il est apprécié pour sa polyvalence, pouvant accueillir confortablement des passagers tout en offrant un espace de chargement généreux.",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "tahoeChev.jpg",
                    "chevrolet_tahoe_2023_ext-cote.jpeg",
                    "chevrolet_tahoe_2023_ext-der.jpeg",
                    "chevrolet_tahoe_2023_int.avif"
                ]
            },
            {
                "_id": 10,
                "corps": "Coupe",
                "transmission": "Automatique",
                "moteur": "8 cylindres",
                "annee": 2021,
                "carburant": "Essence",
                "description": "La Ford Mustang est une voiture de sport emblématique offrant des performances puissantes, un design rétro et une expérience de conduite exaltante. Elle incarne l'esprit de l'automobile américaine et attire les passionnés de conduite depuis des décennies.",
                "pneus_bougent": "RWD",
                "tauxInteret": 6.99,
                "images": [
                    "mustang.jpg",
                    "ford_mustang_2021_ext-cote.jpg",
                    "ford_mustang_2021_ext-der.avif",
                    "ford_mustang_2021_int.avif"
                ]
            },
            {
                "_id": 11,
                "corps": "Camionette",
                "transmission": "Automatique",
                "moteur": "8 cylindres",
                "annee": 2023,
                "carburant": "Essence",
                "description": "Le Ford F-150 est un pick-up pleine grandeur extrêmement populaire, réputé pour sa robustesse, sa polyvalence et sa capacité de remorquage impressionnante. Avec un choix de moteurs et de configurations, il peut être adapté à une variété de besoins, des travaux sur le chantier aux escapades familiales.",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "f150.jpg",
                    "ford_f150_2023_ext-cote.avif",
                    "ford_f150_2023_ext-der.avif",
                    "ford_f150_2023_int.avif"
                ]
            },
            {
                "_id": 12,
                "corps": "Sedan",
                "transmission": "Automatique",
                "moteur": "4 cylindres",
                "annee": 2021,
                "carburant": "Essence",
                "description": "L'Audi A4 est une berline de luxe compacte offrant un mélange parfait de performance, de raffinement et de technologie. Avec son intérieur haut de gamme, ses moteurs puissants et ses options de traction intégrale, elle offre une expérience de conduite dynamique et confortable.",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "a4.jpg",
                    "audi_a4_2021_ext-cote.jpg",
                    "audi_a4_2021_ext-der.jpg",
                    "audi_a4_2021_int.jpg"
                ]
            },
            {
                "_id": 13,
                "corps": "Sportback",
                "transmission": "Automatique",
                "moteur": "6 cylindres",
                "annee": 2022,
                "carburant": "Essence",
                "description": "L'Audi A7 est une berline sportive de luxe avec un design élégant et des lignes fluides. Offrant des performances dynamiques, un intérieur somptueux et une gamme complète de technologies avancées, elle combine l'élégance d'un coupé avec la praticité d'une berline à hayon.",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "a7.jpg",
                    "audi_a7_2022_ext-cote.avif",
                    "audi_a7_ext-der.avif",
                    "audi_a7_2022_int.jpg"
                ]
            },
            {
                "_id": 14,
                "corps": "Sedan",
                "transmission": "Automatique",
                "moteur": "6 cylindres",
                "annee": 2021,
                "carburant": "Essence",
                "description": "La BMW Série 3 est une berline compacte sportive qui incarne le plaisir de conduire avec des performances agiles, une tenue de route précise et un intérieur luxueux. Elle offre également une variété de moteurs puissants et une multitude de fonctionnalités technologiques.",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "bmw3.jpg",
                    "bmw_3_2021_ext-cote.png",
                    "bmw_3_2021_ext-der.png",
                    "bmw_3_2021_int.jpg"
                ]
            },
            {
                "_id": 15,
                "corps": "Sedan",
                "transmission": "Automatique",
                "moteur": "6 cylindres",
                "annee": 2023,
                "carburant": "Essence",
                "description": "La BMW Série 5 est une berline de luxe offrant un équilibre parfait entre confort, performance et technologie. Avec son intérieur raffiné, ses moteurs puissants et ses options de conduite dynamique, elle offre une expérience de conduite haut de gamme pour les conducteurs exigeants.",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "bmw5.jpg",
                    "bmw_5_2023_ext-cote.png",
                    "bmw_5_2023_ext-der.png",
                    "bmw_5_2023_int.jpg"
                ]
            },
            {
                "_id": 16,
                "corps": "Wagon",
                "transmission": "Automatique",
                "moteur": "6 cylindres",
                "annee": 2024,
                "carburant": "Essence",
                "description": "L'Audi A6 est une berline de luxe offrant un design élégant, des performances dynamiques et une gamme complète de technologies avancées. Avec son intérieur somptueux, ses moteurs puissants et son système de traction intégrale Quattro, elle offre une expérience de conduite sophistiquée et confortable.",
                "pneus_bougent": "AWD",
                "tauxInteret": 6.99,
                "images": [
                    "a6.jpg",
                    "audi_a6_2024_ext-cote.jpg",
                    "audi_a6_2024_ext-der.jpg",
                    "audi_a6_2024_int.jpg"
                ]
            }

        ];

        for (const voiture of voitures) {
            let result = await collection.deleteOne({ "_id": voiture._id });
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

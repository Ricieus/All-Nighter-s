-- Ce code permet de créer l'environnement de la base de données
CREATE DATABASE AllNighter;

use AllNighter; -- Après la création de l'environnement, ce code permet d'accéder dans l'environnement

-- Dans les prochanes lignes, veuillez copier et coller dans le terminal du docker les prochaines code un par un (séparer par un "---")
------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE utilisateurs (
    ID_UTILISATEURS INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NOM VARCHAR(100) NOT NULL,
    PRENOM VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(200) NOT NULL,
    MOTDEPASSE VARCHAR(150) NOT NULL,
    TELEPHONE BIGINT NOT NULL,
    ADRESSE VARCHAR(200) NOT NULL
);

INSERT INTO utilisateurs (
    NOM,
    PRENOM,
    EMAIL,
    MOTDEPASSE,
    TELEPHONE,
    ADRESSE
) VALUES (
    'Doe',
    'John',
    'johndoe@example.com',
    'password123',
    1234567890,
    '123 Main Street, Anytown, Canada'
);

INSERT INTO utilisateurs (
    NOM,
    PRENOM,
    EMAIL,
    MOTDEPASSE,
    TELEPHONE,
    ADRESSE
) VALUES (
    'Smith',
    'Jane',
    'janesmith@example.com',
    'secret789',
    0987654321,
    '456 Elm Street, Anycity, Canada'
);

------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE voitures (
    ID_VOITURE INT NOT NULL PRIMARY KEY,
    MARQUE VARCHAR(150) NOT NULL,
    MODELE VARCHAR(200) NOT NULL,
    ANNEE INT NOT NULL,
    PRIX DECIMAL(10, 2) NOT NULL,
    UTILISATEURS_ID_UTILISATEURS INT NOT NULL,
    IMAGE VARCHAR(255),
    FOREIGN KEY (UTILISATEURS_ID_UTILISATEURS) REFERENCES utilisateurs (ID_UTILISATEURS)
);

INSERT INTO voitures (
    ID_VOITURE,
    MARQUE,
    MODELE,
    ANNEE,
    PRIX,
    UTILISATEURS_ID_UTILISATEURS,
    IMAGE
) VALUES (
    1,
    'Toyota',
    'Corolla',
    2021,
    25000,
    1,
    'toyota_corolla.png'
),
(
    2,
    'Honda',
    'Civic',
    2022,
    23000,
    2,
    'honda_civic.avif'
),
(
    3,
    'Honda',
    'CRV',
    2023,
    45000,
    1,
    'honda_CRV.avif'
),
(
    4,
    'Tesla',
    'Model S',
    2021,
    75000,
    1,
    'teslaS.jpeg'
),
(
    5,
    'Tesla',
    'Model 3',
    2022,
    50000,
    2,
    'Tesla3.jpeg'
),
(
    6,
    'Tesla',
    'Model X',
    2022,
    90000,
    2,
    'teslaX.jpeg'
),
(
    7,
    'Tesla',
    'Model Y',
    2023,
    55000,
    1,
    'teslaY.jpeg'
),
(
    8,
    'Chevrolet',
    'Silverado',
    2021,
    30000,
    1,
    'chevSilver.avif'
),
(
    9,
    'Chevrolet',
    'Tahoe',
    2023,
    55000,
    2,
    'chevrolet-tahoe.avif'
),
(
    10,
    'Ford',
    'Mustang',
    2021,
    40000,
    1,
    'mustang.png'
),
(
    11,
    'Ford',
    'F150',
    2023,
    45000,
    2,
    'f150.png'
),
(
    12,
    'Audi',
    'A4',
    2021,
    35000,
    1,
    'a4.jpeg'
),
(
    13,
    'Audi',
    'A7',
    2022,
    85000,
    1,
    'a7.jpeg'
),
(
    14,
    'BMW',
    '3-Series',
    2021,
    50000,
    1,
    'bmw_3.png'
),
(
    15,
    'BMW',
    '5-Series',
    2023,
    70000,
    1,
    'bmw_5.png'
),
(
    16,
    'Audi',
    'A6',
    2024,
    60000,
    2,
    'a6.jpeg'
);

---------------------------------------------------------------------------------------------------------------------
CREATE TABLE contact (
    ID_CONTACT INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    PRENOM VARCHAR(100) NOT NULL,
    NOM VARCHAR(100) NOT NULL,
    COURRIEL VARCHAR(100) NOT NULL,
    TELEPHONE VARCHAR(100) NOT NULL,
    DATERENDEZVOUS DATE NOT NULL,
    RAISONRENDEZVOUS VARCHAR(100),
    UTILISATEURS_ID_UTILISATEURS INT NOT NULL,
    FOREIGN KEY (UTILISATEURS_ID_UTILISATEURS) REFERENCES utilisateurs (ID_UTILISATEURS)
);

INSERT INTO contact (
    PRENOM,
    NOM,
    COURRIEL,
    TELEPHONE,
    DATERENDEZVOUS,
    RAISONRENDEZVOUS,
    UTILISATEURS_ID_UTILISATEURS
) VALUES (
    'Alice',
    'Smith',
    'alice.smith@example.com',
    '1234567891',
    '2024-03-01',
    'Je veux me plaindre',
    1
),
(
    'Bob',
    'Johnson',
    'bob.johnson@example.com',
    '5149744492',
    '2024-03-02',
    'Je veux réserver un essai routier',
    2
),
(
    'Charlie',
    'Brown',
    'charlie.brown@example.com',
    '4508901284',
    '2024-03-03',
    'Je veux laisser un commentaire',
    1
);
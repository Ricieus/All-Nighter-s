-- Ce code permet de créer l'environnement de la base de données
CREATE DATABASE AllNighter;

use AllNighter; -- Après la création de l'environnement, ce code permet d'accéder dans l'environnement

-- Dans les prochanes lignes, veuillez copier et coller dans le terminal du docker les prochaines code un par un (séparer par un "---")
------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE utilisateurs (
    id_utilisateurs INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    motdepasse VARCHAR(150) NOT NULL,
    telephone BIGINT NOT NULL,
    adresse VARCHAR(200) NOT NULL
);

INSERT INTO utilisateurs (nom, prenom, email, motdepasse, telephone, adresse)
VALUES ('Doe', 'John', 'johndoe@example.com', '$2b$10$NjEEzFRmZFYbqzLzI71VreCMdKEPCIdX/rtbxUF2b5ILKp/XKg6r.', 1234567890, '123 Main Street, Anytown, Canada'); -- Le password est "password1234"

------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE voitures (
    id_voiture INT NOT NULL PRIMARY KEY,
    marque VARCHAR(150) NOT NULL,
    modele VARCHAR(200) NOT NULL,
    annee INT NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255)
);

INSERT INTO voitures (
    id_voiture,
    marque, 
    modele, 
    annee, 
    prix, 
    image
) VALUES (
    1,
    'Toyota',
    'Corolla',
    2021,
    25000,
    'toyota_corolla.png'
),
(
    2,
    'Honda',
    'Civic',
    2022,
    23000,
    'honda_civic.avif'
),
(
    3,
    'Honda',
    'CRV',
    2023,
    45000,
    'honda_CRV.avif'
),
(
    4,
    'Tesla',
    'Model S',
    2021,
    75000,
    'teslaS.jpeg'
),
(
    5,
    'Tesla',
    'Model 3',
    2022,
    50000,
    'Tesla3.jpeg'
),
(
    6,
    'Tesla',
    'Model X',
    2022,
    90000,
    'teslaX.jpeg'
),
(
    7,
    'Tesla',
    'Model Y',
    2023,
    55000,
    'teslaY.jpeg'
),
(
    8,
    'Chevrolet',
    'Silverado',
    2021,
    30000,
    'chevSilver.avif'
),
(
    9,
    'Chevrolet',
    'Tahoe',
    2023,
    55000,
    'chevrolet-tahoe.avif'
),
(
    10,
    'Ford',
    'Mustang',
    2021,
    40000,
    'mustang.png'
),
(
    11,
    'Ford',
    'F150',
    2023,
    45000,
    'f150.png'
),
(
    12,
    'Audi',
    'A4',
    2021,
    35000,
    'a4.jpeg'
),
(
    13,
    'Audi',
    'A7',
    2022,
    85000,
    'a7.jpeg'
),
(
    14,
    'BMW',
    '3-Series',
    2021,
    50000,
    'bmw_3.png'
),
(
    15,
    'BMW',
    '5-Series',
    2023,
    70000,
    'bmw_5.png'
),
(
    16,
    'Audi',
    'A6',
    2024,
    60000,
    'a6.jpeg'
);

---------------------------------------------------------------------------------------------------------------------
CREATE TABLE contact (
    id_contact INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    courriel VARCHAR(100) NOT NULL,
    telephone BIGINT NOT NULL,
    dateRendezVous DATE NOT NULL,
    raisonRendezVous VARCHAR(100)
);


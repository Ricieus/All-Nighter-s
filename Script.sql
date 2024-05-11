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
    id_voiture INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(150) NOT NULL,
    modele VARCHAR(200) NOT NULL,
    annee INT NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    utilisateurs_id_utilisateurs INT NOT NULL,
    image VARCHAR(255),
    FOREIGN KEY (utilisateurs_id_utilisateurs) REFERENCES utilisateurs (id_utilisateurs)
);

INSERT INTO voitures (
    id_voiture,
    marque, 
    modele, 
    annee, 
    prix, 
    utilisateurs_id_utilisateurs, 
    image
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
    id_contact INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    courriel VARCHAR(100) NOT NULL,
    telephone VARCHAR(100) NOT NULL,
    dateRendezVous DATE NOT NULL,
    raisonRendezVous VARCHAR(100),
    utilisateurs_id_utilisateurs INT NOT NULL,
    FOREIGN KEY (utilisateurs_id_utilisateurs) REFERENCES utilisateurs (id_utilisateurs)
);

INSERT INTO contact (
    prenom, 
    nom, 
    courriel, 
    telephone, 
    dateRendezVous, 
    raisonRendezVous, 
    utilisateurs_id_utilisateurs
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
CREATE DATABASE AllNighter;
use AllNighter;
-------------------------------------------
-------------------------------------------
CREATE TABLE utilisateurs (
    id_utilisateurs INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    motdepasse VARCHAR(150) NOT NULL,
    telephone INT NOT NULL,
    adresse VARCHAR(200) NOT NULL
);
INSERT INTO utilisateurs (nom, prenom, email, motdepasse, telephone, adresse)
VALUES ('Doe', 'John', 'johndoe@example.com', 'password123', 1234567890, '123 Main Street, Anytown, Canada');
INSERT INTO utilisateurs (nom, prenom, email, motdepasse, telephone, adresse)
VALUES ('Smith', 'Jane', 'janesmith@example.com', 'secret789', 0987654321, '456 Elm Street, Anycity, Canada');
------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE voitures (
    id_voiture INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(150) NOT NULL,
    modele VARCHAR(200) NOT NULL,
    annee INT NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    utilisateurs_id_utilisateurs INT NOT NULL,
    FOREIGN KEY (utilisateurs_id_utilisateurs) REFERENCES utilisateurs (id_utilisateurs)
);
INSERT INTO voitures (marque, modele, annee, prix, utilisateurs_id_utilisateurs)
VALUES 
('Toyota', 'Corolla', 2021, 25000, 1),
('Honda', 'Civic', 2022, 23000, 2),
('Honda', 'CRV', 2023, 45000, 1);
---------------------------------------------------------------------------------------------------------------------
CREATE TABLE contact (
    id_contact INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dateRendezVous DATE NOT NULL,
    raisonRendezVous VARCHAR(100),
    extra VARCHAR(1000),
    utilisateurs_id_utilisateurs INT NOT NULL,
    FOREIGN KEY (utilisateurs_id_utilisateurs) REFERENCES utilisateurs (id_utilisateurs)
);
INSERT INTO contact (dateRendezVous, raisonRendezVous, extra, utilisateurs_id_utilisateurs) VALUES

     ('2024-02-22', 'Je veux me plaindre', 'Aucun respect dans votre service', 1),
     ('2024-02-23', 'Je veux laisser un commentaire', 'Bon service tres accueillant', 2);

----------------------------------------------------------------------------------------------------------------------------------
 CREATE TABLE stock (
    id_stock INT NOT NULL PRIMARY KEY,
    voitureRestante INT NOT NULL,
    voitures_id_voiture INT NOT NULL,
    FOREIGN KEY (voitures_id_voiture) REFERENCES voitures (id_voiture)
);
INSERT INTO stock (id_stock, voitureRestante, voitures_id_voiture)
VALUES 
(1, 5, 1),
(2, 8, 2),
(3, 3, 3);
-------------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE commande ( 
    id_commande INT AUTO_INCREMENT PRIMARY KEY,
     dateLivraison DATE NOT NULL, 
     voitures_id_voiture INT NOT NULL, 
     paiement_id_paiement INT NOT NULL,
     FOREIGN KEY (voitures_id_voiture) REFERENCES voitures (id_voiture)
     );

     INSERT INTO commande (dateLivraison, voitures_id_voiture, paiement_id_paiement) VALUES
     ('2024-02-21', 1, 1),
     ('2024-02-22', 2, 2),
     ('2024-02-23', 3, 3);
-------------------------------------------------------------------------------------------------------------------------

CREATE TABLE paiement (
    id_paiement  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    commande_id_commande INT NOT NULL,
     typePaiement  VARCHAR(200) NOT NULL,
     typeFinancement VARCHAR(200) NOT NULL,
    prixTotal INT NOT NULL
     );
     INSERT INTO paiement (commande_id_commande, typePaiement, typeFinancement, prixTotal) VALUES (2, 'PayPal', 'Hebdomadaire', 125);
     INSERT INTO paiement (commande_id_commande, typePaiement, typeFinancement, prixTotal) VALUES (1, 'Visa', 'Mensuel', 825);
     INSERT INTO paiement (commande_id_commande, typePaiement, typeFinancement, prixTotal) VALUES (3, 'Mastercard', 'Bi-Hebdomadaire', 227);
-----------------------------------------------------------------------------------------------------------------------------------------------------
ALTER TABLE commande
ADD CONSTRAINT fk_commande_paiement
FOREIGN KEY (paiement_id_paiement) REFERENCES paiement(id_paiement);
-----------------------------------------------------------------------------------------
ALTER TABLE paiement
ADD CONSTRAINT fk_paiement_commande
FOREIGN KEY (commande_id_commande) REFERENCES commande(id_commande);

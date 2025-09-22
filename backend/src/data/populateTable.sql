-- Données d'exemple

-- Table Role
INSERT INTO Role (id, name) VALUES 
  (1, 'Admin'), 
  (2, 'Association'), 
  (3, 'FamilleAccueil');

-- Table Species
INSERT INTO Species (id, name) VALUES 
  (1, 'Chien'),
  (2, 'Chat');

-- Table User
INSERT INTO User (id, first_name, last_name, phone_number, password, email, street_number, address, city, zip_code, rna_number, role_id) VALUES 
  (1, 'Alice', 'Durand', '0123456789', 'hashed_pwd_1', 'alice@example.com', '10', 'rue des Lilas', 'Paris', '75000', 'RNA12345', 2),
  (2, 'Bob', 'Martin', '0987654321', 'hashed_pwd_2', 'bob@example.com', '5', 'avenue de Lyon', 'Lyon', '69000', NULL, 3);

-- Table Animal
INSERT INTO Animal (id, name, date_of_birth, description, picture, user_id, species_id) VALUES 
  ('1', 'Rex', '2020-01-01', 'Chien très gentil', 'rex.jpg', 1, 1),
  ('2', 'Mimi', '2019-02-15', 'Chat câlin', 'mimi.jpg', 1, 2);

-- Table Application
INSERT INTO Application (id, user_id, animal_id, message, status) VALUES 
  (1, 2, 1, 'Je souhaite accueillir Rex.', 'pending'),
  (2, 2, 2, 'Mimi serait parfaite pour ma famille.', 'pending');



--- Old script ---

-- INSERT INTO Role (id, name) VALUES 
--   (1, 'Admin'), 
--   (2, 'Association'), 
--   (3, 'User');

-- INSERT INTO Species (id, name) VALUES 
--   (1, 'Chien'),
--   (2, 'Chat');

-- INSERT INTO Localisation (id, name, postcode) VALUES 
--   (1, 'Paris', 75000),
--   (2, 'Lyon', 69000);

-- INSERT INTO User (id, first_name, last_name, phone_number, password, email, address, postcode, city, RNA_number, role_id) VALUES 
--   (1, 'Alice', 'Durand', 123456789, 'hashed_pwd_1', 'alice@example.com', '10 rue des Lilas', 75000, 'Paris', 'RNA12345', 2),
--   (2, 'Bob', 'Martin', 987654321, 'hashed_pwd_2', 'bob@example.com', '5 avenue de Lyon', 69000, 'Lyon', NULL, 3);

-- INSERT INTO Animal (id, name, date_of_birth, description, picture, localisation_id, user_id, species_id) VALUES 
--   (1, 'Rex', 20200101, 'Chien très gentil', 'rex.jpg', 1, 1, 1),
--   (2, 'Mimi', 20190215, 'Chat câlin', 'mimi.jpg', 2, 2, 2);

-- INSERT INTO User_Animal (user_id, animal_id, message) VALUES 
--   (2, 1, 'Je souhaite adopter Rex.'),
--   (1, 2, 'Mimi serait parfaite pour ma famille.');
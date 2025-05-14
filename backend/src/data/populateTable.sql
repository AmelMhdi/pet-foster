-- Données d'exemple

INSERT INTO Role (id, name) VALUES 
  (1, 'Admin'), 
  (2, 'Association'), 
  (3, 'User');

INSERT INTO Species (id, name) VALUES 
  (1, 'Chien'),
  (2, 'Chat');

INSERT INTO Localisation (id, name, postcode) VALUES 
  (1, 'Paris', 75000),
  (2, 'Lyon', 69000);

INSERT INTO User (id, first_name, last_name, phone_number, password, email, address, postcode, city, RNA_number, role_id) VALUES 
  (1, 'Alice', 'Durand', 123456789, 'hashed_pwd_1', 'alice@example.com', '10 rue des Lilas', 75000, 'Paris', 'RNA12345', 2),
  (2, 'Bob', 'Martin', 987654321, 'hashed_pwd_2', 'bob@example.com', '5 avenue de Lyon', 69000, 'Lyon', NULL, 3);

INSERT INTO Animal (id, name, date_of_birth, description, picture, localisation_id, user_id, species_id) VALUES 
  (1, 'Rex', 20200101, 'Chien très gentil', 'rex.jpg', 1, 1, 1),
  (2, 'Mimi', 20190215, 'Chat câlin', 'mimi.jpg', 2, 2, 2);

INSERT INTO User_Animal (user_id, animal_id, message) VALUES 
  (2, 1, 'Je souhaite adopter Rex.'),
  (1, 2, 'Mimi serait parfaite pour ma famille.');
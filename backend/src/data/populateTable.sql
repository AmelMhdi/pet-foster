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
  (1, 'Anya', 'Joy', '0123456789', '$argon2id$v=19$m=65536,t=3,p=4$qj8X6OQXdtqQcV7FczWYrA$JQn67/jVmcM+MuRyBQZDk+in9dQgK+EXknG0uCFxUqk', 'anya@gmail.com', '10', 'rue des Lilas', 'Paris', '75000', 'RNA12345', 2),
  (2, 'Joon', 'Kim', '0987654321', '$argon2id$v=19$m=65536,t=3,p=4$ysE0S+eyqyEU3Wu4B58PlA$PsA+ikPdOg68rypJQiziuUc2XN+ttw3q4UVspUAy7/M', 'joon@gmail.com', '5', 'avenue de Lyon', 'Lyon', '69000', NULL, 3);

-- Table Animal
INSERT INTO Animal (id, name, date_of_birth, description, picture, user_id, species_id) VALUES 
  ('1', 'Rex', '2020-01-01', 'Chien très gentil', 'rex.jpg', 1, 1),
  ('2', 'Mimi', '2019-02-15', 'Chat câlin', 'mimi.jpg', 1, 2);

-- Table Application
INSERT INTO Application (id, user_id, animal_id, message, status) VALUES 
  (1, 2, 1, 'Je souhaite accueillir Rex.', 'pending'),
  (2, 2, 2, 'Mimi serait parfaite pour ma famille.', 'pending');
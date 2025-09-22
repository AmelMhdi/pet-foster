-- Table: Role
CREATE TABLE Role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: User
CREATE TABLE User (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  street_number VARCHAR(10) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  rna_number VARCHAR(20) UNIQUE,
  role_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES Role(id)
);

-- Table: Species
CREATE TABLE Species (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: Animal
CREATE TABLE Animal (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  description TEXT NOT NULL,
  picture VARCHAR(255),
  user_id INT NOT NULL,
  species_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (species_id) REFERENCES Species(id)
);

-- Table: Application (demande d’accueil)
CREATE TABLE Application (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  animal_id INT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (animal_id) REFERENCES Animal(id),
  UNIQUE (user_id, animal_id)
);



-- OLD SQL SCRIPT ---
--  Table: Role
-- CREATE TABLE Role (
--   id INT PRIMARY KEY,
--   name VARCHAR(255) NOT NULL UNIQUE,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Table: Species
-- CREATE TABLE Species (
--   id INT PRIMARY KEY NOT NULL,
--   name VARCHAR(255) NOT NULL UNIQUE,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Table: Localisation
-- CREATE TABLE Localisation (
--   id INT PRIMARY KEY NOT NULL UNIQUE,
--   name VARCHAR(255) NOT NULL,
--   postcode INT NOT NULL,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Table: User
-- CREATE TABLE User (
--   id INT PRIMARY KEY NOT NULL,
--   first_name VARCHAR(255) NOT NULL,
--   last_name VARCHAR(255) NOT NULL,
--   phone_number INT NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   email VARCHAR(255) NOT NULL UNIQUE,
--   address VARCHAR(255) NOT NULL,
--   postcode INT NOT NULL,
--   city VARCHAR(255) NOT NULL,
--   RNA_number INT UNIQUE,
--   picture VARCHAR(255),
--   role_id INT NOT NULL,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (role_id) REFERENCES Role(id)
-- );

-- -- Table: Animal
-- CREATE TABLE Animal (
--   id INT PRIMARY KEY NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   date_of_birth INT UNSIGNED NOT NULL,
--   description TEXT NOT NULL,
--   picture VARCHAR(255) NOT NULL,
--   localisation_id INT NOT NULL,
--   user_id INT NOT NULL,
--   species_id INT NOT NULL,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (localisation_id) REFERENCES Localisation(id),
--   FOREIGN KEY (user_id) REFERENCES User(id),
--   FOREIGN KEY (species_id) REFERENCES Species(id)
-- );

-- -- Table: User_Animal (many-to-many)
-- CREATE TABLE User_Animal (
--   user_id INT NOT NULL,
--   animal_id INT NOT NULL,
--   message TEXT NOT NULL,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (user_id, animal_id),
--   FOREIGN KEY (user_id) REFERENCES User(id),
--   FOREIGN KEY (animal_id) REFERENCES Animal(id)
-- );


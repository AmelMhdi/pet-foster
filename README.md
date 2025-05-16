# Pet Foster Connect

Projet en cours...

# <img src="./pet-foster-connect/public/paw-print.svg" alt="Logo de PetFosterConnect" width="50"/> Pet Foster Connect

![Home](./pet-foster-connect/public/images/Home.webp)

## Présentation

**Pet Foster Connect** est une plateforme web qui facilite la mise en relation entre :

- des familles d’accueil temporaires souhaitant héberger un animal dans l’attente de son adoption ;
- des associations de protection animale proposant des animaux à placer.

Notre objectif : **offrir une vie meilleure aux animaux**, en leur évitant les refuges surchargés, grâce à des hébergements temporaires dans des foyers aimants.

---

## Stack technique

- **Frontend** : React, Bootstrap
- **Backend** : Node.js, Express
- **Base de données** : PostgreSQL, Sequelize ORM 

🎨 Le design est simple et épuré, pensé pour être accessible à toutes et tous, même aux personnes peu familières avec Internet.

## Installation

1. **Cloner le dépot** :

```
HTTPS : git clone https://github.com/O-clock-Sushi/pet-foster-connect.git
SSH : git@github.com:O-clock-Sushi/pet-foster-connect.git

```

2. **Naviguer dans le dossier** :

```bash
cd petfoster-connect
```

3. **Installer les dépendances (racine + front)** :

```bash
npm install            # Pour le backend (racine)
cd front

npm install            # Pour le frontend
cd ..
```

4. **Créer les fichiers d'environnement** :

```bash
cp .env.example .env           # Backend
cd front

cp .env.example .env           # Frontend
cd ..
```

5. **Creer la base de données**

```sql
-- À exécuter dans psql ou votre client SQL
CREATE ROLE votreRole WITH LOGIN PASSWORD 'password';
CREATE DATABASE votreBDD WITH OWNER votreRole;
```

6. **Initialiser la base de données** :

```bash
npm run db:reset
```

7. **Demarrer le projet**

```bash
npm run dev:back
npm run dev:front
```
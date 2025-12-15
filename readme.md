# Simple App – Dockerized
 
Ce projet est une application simple exécutée dans un conteneur Docker.  
Il montre comment construire une image, lancer un conteneur et utiliser un fichier Dockerfile.
 
## Structure du projet
 
├── app/                # Code source de l'application  
├── docker-compose.yml  # fichier docker-compose pour deployer l'app
└── Dockerfile  
 
## Prérequis
 
- Docker installé : https://docs.docker.com/get-docker/
 
## Construire l’image Docker
### En dev
`docker build --target dev -f ./Dockerfile -t jchaipas/projetdocker:1.0-dev app/`
### En prod
`docker build --target prod -f ./Dockerfile -t jchaipas/projetdocker:1.0-prod app/`
 
## Lancer l'application
### En dev avec docker-compose
mettez le nom et tag de l'image

`docker-compose up -d`

### En prod sans docker-compose

`docker run -p 3000:3000 -d jchaipas/projetdocker:1.0-prod`
 
L’application sera disponible sur : http://localhost:3000
 
## Arrêter et supprimer le conteneur
### avec docker-compose
`docker-compose down -v`
### sans docker-compose
```sh
docker ps  
docker stop name-container
docker rm name-container
```

### Différences d'environnement
Environnement DEV:<br>
Utilise Nodemon / npm run dev → rechargement automatique.<br>
Source maps activés → tu vois les vraies lignes de ton code en cas d’erreur.<br>
Dépendances installées entièrement (avec devDependencies).<br>
Contient des outils de dev (bash, git…).<br>

Environnement PROD :<br>
Démarré avec node server.js → optimisé, sans rechargement automatique.<br>
Source maps désactivés → plus sécurisé et plus rapide.<br>
Ne contient que les dépendances nécessaires (prod).<br>
Utilisateur non-root + image plus légère.<br>

## Test du rechargement automatique
Vérifie que: 
- DEV -> recharge automatiquement le code
- PROD -> nécessite un redémarrage du conteneur

### Etapes DEV
`docker-compose up -d`
1. Ouvrir http://localhost:3000
2. Modifie un ficher dans app/ (ex: message dans server.js)
3. Sauvegarde le fichier

#### Resultat attendu (DEV)
- Le conteneur redémarre automatiquement (nodemon)
- Le changement est visible sans relancer Docker

### Etapes PROD
`docker run -p 3000:3000 -d jchaipas/projetdocker:1.0-prod`
1. Modifie le même fichier source
2. Recharge la page

#### Resultat attendu (PROD)
- Aucun changement visible
- Le conteneur doit être redémarré pour appliquer les modifications

## Test de dépendances installées
Verifier que:
- DEV contient les devDependencies
- PROD ne contient que les dépendances de production

### Commandes
DEV:
`docker run --rm -it jchaipas/projetdocker:1.0-dev sh`

PROD:
`docker run --rm -it jchaipas/projetdocker:1.0-prod sh`

### Vérifications
#### Exemple: nodemon
`npm list nodemon`

DEV:
nodemon présent

PROD:
nodemon absent


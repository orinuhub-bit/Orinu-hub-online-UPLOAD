# Orinu Hub Online UPLOAD

API Express pour upload sécurisé BD / Images / PDF / Vidéos dans Firebase Storage, liens conservés dans MongoDB.

## Usage

1. Remplir `.env` à partir de `.env.example`.
2. Ajouter `firebaseServiceAccountKey.json` (non versionné !).
3. `npm install`
4. Lancer : `node app.js`

## Endpoints

- `POST /api/upload/` (Authentifié, multipart/form-data, champ `file`)
- `GET /api/upload/all` (Public : liste tous les fichiers uploadés)

## Sécurité

- Authentification par JWT (à intégrer avec ton système d’utilisateur)
- Seul l’uploader connecté peut publier des fichiers

## Intégration

À fusionner ensuite dans le projet principal Orinu-hub.

---
// CORE
const express = require('express');
//CSV data parsing
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csvParser = require('csv-parser');
// DB
const sqlite = require('sqlite3');



const app = express();
const port = 3000; // Port sur lequel le serveur écoutera
// const hostname = "127.0.0.1";

app.set('view engine', 'ejs'); // View engine setup

const upload = multer({ dest: 'tmp/csv/' }); // Définissez le dossier de destination pour les fichiers CSV

const db = new sqlite.Database('db/meeting-app.sqlite'); //Connexion à la base de données SQLite


db.serialize(() => { // Créer des tables ou effectuez d'autres opérations de configuration
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name VARCHAR,
      organizers TEXT,
      invited_users TEXT,
      event_start_date DATE,
      event_end_date DATE,
      event_start_hour TIME,
      event_end_hour TIME,
      team_channel TEXT,
      event_description TEXT,
      event_recurrence TEXT,
      meeting_link TEXT
    )`,
    (err) => {
      if (err) console.error('Erreur lors de la création de la table "events":', err);
      else console.log('Table "events" créée avec succès.');
    }
  );
});
      
// Définissez les routes et la logique de votre application ici
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
      
      
      
app.get('/', (req, res) => {
  res.render('home')
});

app.route('/import-csv')
  .post(upload.single('csvFile_import'), (req, res) => { // get the file from the form
    if (! req.file || ! req.file.path) return res.sendStatus(400);
    const csvFile = req.file;
    const results = [];

    fs.createReadStream(csvFile.path) // On crée un flux de données
      .pipe(csvParser()) // On utilise csv-parser pour lire le contenu du fichier CSV ligne par ligne
      .on('data', (row) => {
        results.push(row); // On push dans le tableau results chaque ligne du csv
      })
      .on('end', () => {
        fs.unlinkSync(req.file.path);// Supprimez le fichier temporaire après avoir traité les données      
        res.status(200).json(results);
      });
  })
  .get((req, res) => {
    res.send('Route pour uploader le CSV')
  });

  app.get('/evenements', (req, res) => {
    // Effectuez une requête SELECT pour récupérer toutes les données de la table "events"
    db.all('SELECT * FROM events', (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Erreur lors de la récupération des événements.' });
      }
      res.json(rows); // Renvoie les données au format JSON
    });
  });
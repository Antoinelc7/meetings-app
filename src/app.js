// CORE
const express = require('express');
//CSV data parsing
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csvParser = require('csv-parser');
// DB
const { db, createEventsTable, persistEvents } = require('./services/db.js')



const app = express();
const port = 3000; // Port sur lequel le serveur écoutera
// const hostname = "127.0.0.1";

app.set('view engine', 'ejs'); // View engine setup

const upload = multer({ dest: 'tmp/csv/' }); // Définissez le dossier de destination pour les fichiers CSV


      
// Définissez les routes et la logique de votre application ici
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
      


createEventsTable(); // from db services
      
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
        console.log(results);
        fs.unlinkSync(req.file.path);// Supprimez le fichier temporaire après avoir traité les données
        persistEvents(results) // from db services
        res.status(200).json(results);
      });
  })
  .get((req, res) => {
    console.warn("CSV upload route accessed without POST method");
    res.redirect("/")
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
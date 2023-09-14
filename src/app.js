const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
const port = 3000; // Port sur lequel le serveur écoutera
// const hostname = "127.0.0.1";

app.set('view engine', 'ejs'); // View engine setup

const upload = multer({ dest: 'tmp/csv/' }); // Définissez le dossier de destination pour les fichiers CSV


// Créez une connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost', // L'adresse de la base de données
  port: 3306,
  user: 'suser',
  password: '1307',
  database: 'meetings-app',
});

// Vérifiez si la connexion à la base de données a réussi
// db.connect((err) => {
  //   if (err) {
    //     console.error('Erreur de connexion à la base de données :', err);
    //   } else {
      //     console.log('Connexion à la base de données réussie');
      //   }
      // });
      
// Définissez les routes et la logique de votre application ici
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
      
      
      
app.get('/', (req, res) => {
  res.render('home')
});

app.route('/import-csv')
  .post(upload.single('csvFile_import'), (req, res) => {
    if (! req.file || ! req.file.path) return res.sendStatus(400);
    const csvFile = req.file;
    const results = [];

    fs.createReadStream(csvFile.path) // On crée un flux de données
      .pipe(csvParser()) // On utilise csv-parser pour lire le contenu du fichier CSV ligne par ligne
      .on('data', (buffer) => {
        results.push(buffer); // On push dans le tableau results chaque ligne du csv
      })
      .on('end', () => {
        fs.unlinkSync(req.file.path);// Supprimez le fichier temporaire après avoir traité les données      
        res.status(200).json(results);
      });
  })
  .get((req, res) => {
    res.send('Route pour uploader le CSV')
  });

app.get('/api', (req, res) => {
    res.send('Route pour la future API.');
});  


app.post('/services/microsoftGraph', (req, res) => {
  res.send('Route pour créer une équipe.');
  console.log("équipe créer");
});

// Dans app.js (ou server.js)
const express = require('express');
const app = express();
const port = 3000; // Port sur lequel le serveur écoutera
// const hostname = "127.0.0.1";

// Définissez les routes et la logique de votre application ici

app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});



app.get('/', (req, res) => {
    res.send('Bienvenue sur ma page d\'accueil !');
    console.log("page d'accueil");
});
  
app.get('/api', (req, res) => {
    res.send('Route pour la future API.');
});  
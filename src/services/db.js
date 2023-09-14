const sqlite = require('sqlite3');

const db = new sqlite.Database('db/meeting-app.sqlite'); //Connexion à la base de données SQLite


let createEventsTable = () => {
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
}

module.exports = { createEventsTable }
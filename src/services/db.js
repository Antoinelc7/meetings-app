const sqlite = require('sqlite3');

const db = new sqlite.Database('db/meeting-app.sqlite'); //Connexion à la base de données SQLite


let createEventsTable = () => {
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
    db.close();
}

let persistEvents = (dataArray) => {
    db.serialize(() => { // Créer des tables ou effectuez d'autres opérations de configuration
        dataArray.forEach(event => {
            const {
                eventName,
                organizer,
                invitedUsers,
                startDate,
                endDate,
                startHour,
                endHour,
                teamChannel,
                eventDescription,
                eventRecurrence,
                meetingLink
            } = event;

            // FWI: stmt == "statement"
            const sqlStmt = db.prepare(`
                INSERT INTO events (event_name, organizer, /* ... autres colonnes */)
                VALUES (?, ? /* ... autres valeurs */)
            `);
        });
    });
}

module.exports = { createEventsTable }
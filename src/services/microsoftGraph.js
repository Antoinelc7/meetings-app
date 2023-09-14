const graph = require('@microsoft/microsoft-graph-client');
require('dotenv').config();

const accessToken = process.env.MICROSOFT_GRAPH_ACCESS_TOKEN;


const client = graph.Client.init({
    authProvider: (done) => {
        done(null, accessToken);
    }
});

const teamData = {
    displayName: "test",
    description: "test description",
};

client
    .api('/me/joinedTeams')
    .version('v1.0')
    .post(teamData, (err, res) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la création de l\'équipe' });
            return;
        }
        console.log("Équipe créée avec succès :", apiResponse);
        res.status(200).json({ message: 'Équipe créée avec succès' });
    });
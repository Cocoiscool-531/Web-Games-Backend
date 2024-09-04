const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Load the JSON file
let jsonData = JSON.parse(fs.readFileSync('uno.json', 'utf-8'));

// Endpoint to update player data
app.post('/update-player', (req, res) => {
    const { player, hand, online } = req.body;

    if (player === 'player1' || player === 'player2') {
        jsonData[player].hand = hand || jsonData[player].hand;
        jsonData[player].online = online !== undefined ? online : jsonData[player].online;

        // Save the updated JSON file
        fs.writeFileSync('uno.json', JSON.stringify(jsonData, null, 2));

        res.send({ success: true, message: `${player} updated successfully`, data: jsonData[player] });
    } else {
        res.status(400).send({ success: false, message: 'Invalid player specified' });
    }
});

// Endpoint to update and send data object
app.post('/update-data', (req, res) => {
    const { fullDeck, turn } = req.body;

    jsonData.data.fullDeck = fullDeck || jsonData.data.fullDeck;
    jsonData.data.turn = turn || jsonData.data.turn;

    // Save the updated JSON file
    fs.writeFileSync('uno.json', JSON.stringify(jsonData, null, 2));

    res.send({ success: true, message: `Data updated successfully`, data: jsonData.data });
});

// Endpoint to get the current state
app.get('/get-data', (req, res) => {
    res.send(jsonData);
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


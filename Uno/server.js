const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const hexAbc = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
const numbers = ["0","1","2","3","4","5","6","7","8","9","Skip","Reverse","+2","","+4", ""];
const colors = ["Red", "Yellow", "Blue", "Green", "Wild"];
const app = express();

let deck = [];

// Use CORS middleware to allow cross-origin requests
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());

// Load the JSON file
let jsonData = JSON.parse(fs.readFileSync('uno.json', 'utf-8'));

const sleep = ms => new Promise(r => setTimeout(r, ms));
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function dealCards(){
    for(let i = 0; i < 7; i++){
        player1.push(deck.pop()); player2.push(deck.pop());
    } 
} 
function refreshJson(){
    jsonData = JSON.parse(fs.readFileSync('uno.json', 'utf-8'));
}

function uploadJson(){
  fs.writeFileSync('uno.json', JSON.stringify(jsonData, null, 2));
}



function createDeck(){
    
    for(let i = 0; i < 4; i++){
        jsonData.data.deck.push(i+"0")
        for(let j = 1; j < 13; j++){
            for(let k = 0; k < 2; k++){
                char1 = i.toString();
                char2 = hexAbc[j];
                toAdd = char1.concat(char2);
                jsonData.data.deck.push(toAdd);
            }
        }
    }
    //jsonData.data.deck.push("4D","4D","4D","4D","4E","4E","4E","4E");
}

// Endpoint to signal the end of a player's turn
app.post('/end-turn', (req, res) => {
    jsonData = JSON.parse(fs.readFileSync('uno.json', 'utf-8'));

    const player = req.body.player || req.query.player; // Get player from form data or query parameter

    if (player === 'player1' || player === 'player2') {

        // Optionally, you can decide whose turn is next, for example:
        jsonData.data.turn = player === 'player1' ? 'player2' : 'player1';

        // Save the updated JSON file
        fs.writeFileSync('uno.json', JSON.stringify(jsonData, null, 2));

        res.send({ success: true, message: `${player}'s turn is over`, nextTurn: jsonData.data.turn });
    } else {
        res.status(400).send({ success: false, message: 'Invalid player specified' });
    }
});

// Endpoint to update player data
app.post('/update-player', (req, res) => {
    jsonData = JSON.parse(fs.readFileSync('uno.json', 'utf-8'));

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
    jsonData = JSON.parse(fs.readFileSync('uno.json', 'utf-8'));

    const { fullDeck, turn } = req.body;

    jsonData.data.fullDeck = fullDeck || jsonData.data.fullDeck;
    jsonData.data.turn = turn || jsonData.data.turn;

    // Save the updated JSON file
    fs.writeFileSync('uno.json', JSON.stringify(jsonData, null, 2));

    res.send({ success: true, message: `Data updated successfully`, data: jsonData.data });
});

// Endpoint to get the current state
app.get('/get-data', (req, res) => {
    jsonData = JSON.parse(fs.readFileSync('uno.json', 'utf-8'));

    res.send(jsonData);
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    createDeck();
});


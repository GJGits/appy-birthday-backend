
const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')

app.use(cors());
app.use(express.json());

var db_type = process.argv[2];
var db_client = require('./db_js/' + db_type);

app.get('/punteggi/:game', (req, res) => {
  let gameName = req.params.game;
  db_client.getPunteggi(gameName, (results) => res.send(results));
})

app.post('/voti', (req, res) => {
  let voti = req.body;
  db_client.sendVoti(voti, (results) => res.send({status: 200}));
})


app.get('/games', (req, res) => {
  db_client.getGameNames((results) => res.send(results));
})

app.get('/partecipanti', (req, res) => {
  db_client.getPartecipanti((results) => res.send(results));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





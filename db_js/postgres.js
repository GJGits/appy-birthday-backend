const { Client } = require('pg')

const connection = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

// speculo sul fatto che dopo 10 secondi il db container e' up
setTimeout(() => { connection.connect().catch((reason) => console.log(reason)) }, 10000);

const queryWithCallback = (query, callback) => {
  connection.query(query, (error, results) => {
    callback(results.rows);
  });
};

const preparedQueryWithCallback = (preparedQuery, values, callback) => {
  connection.query(preparedQuery, values, (error, results) => {
    callback(results.rows);
  })
};

var client = {};

client.getGameNames = (callback) => {
  queryWithCallback("SELECT name FROM GAMES", callback);
};

client.getPartecipanti = (callback) => {
  queryWithCallback("SELECT name FROM PLAYERS", callback);
}

client.sendVoti = (voti, callback) => {
  let query = "INSERT INTO VOTI (name, game, score) VALUES ";
  let values = [];
  for (let i = 0; i < voti.length; i++) {
    let name = voti[i].name;
    let game = voti[i].game;
    let score = voti[i].score;
    values.push(name);
    values.push(game);
    values.push(score);
    query += "($" + (i * 3 + 1) + ", $" + (i * 3 + 2) + ", $" + (i * 3 + 3) + "),";
  }
  query = query.substring(0, query.length - 1);
  preparedQueryWithCallback(query, values, callback);
}

client.getPunteggi = (game, callback) => {
  preparedQueryWithCallback("SELECT name, game, SUM(score) as score FROM  VOTI WHERE game = $1 GROUP BY name, game ", [game], callback);
}

module.exports = client;
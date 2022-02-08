var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'APPY_BIRTHDAY'
});

// speculo sul fatto che dopo 10 secondi il db container e' up
setTimeout(() => { connection.connect() }, 10000);

const queryWithCallback = (query, callback) => {
  connection.query(query, (error, results, fields) => {
    callback(results);
  });
};

const preparedQueryWithCallback = (preparedQuery, values, callback) => {
  connection.query(preparedQuery, values, (error, results, fields) => {
    callback(results);
  })
};

const bulkInsert = (preparedQuery, values, callback) => {
  connection.query(preparedQuery, [values], (error, results, fields) => {
    callback(results);
  })
};

var client = {};

client.getGameNames = (callback) => {
  queryWithCallback("select name from GAMES", callback);
};

client.getPartecipanti = (callback) => {
  queryWithCallback("select name from PLAYERS", callback);
}

client.sendVoti = (voti, callback) => {
  let query = "insert into VOTI (name, game, score) values ?";
  values = [];
  for (let i = 0; i < voti.length; i++) {
    let name = voti[i].name;
    let game = voti[i].game;
    let score = voti[i].score;
    let arrValue = [name, game, score];
    values.push(arrValue);
  }
  bulkInsert(query, values, callback);
}

client.getPunteggi = (game, callback) => {
  preparedQueryWithCallback("select name, game, sum(score) as score from  VOTI where game = ? group by name, game ", [game], callback);
}

module.exports = client;
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'naveen',
  password : 'Apple',
  database : 'socialmedia'
});
connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;

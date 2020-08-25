const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost', // adresse du serveur
port : 3307,
user :  'user', // le nom d'utilisateur
password :  'matu2010', // le mot de passe
database :  'cryptodb', // le nom de la base de données
});
module.exports = connection;
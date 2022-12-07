const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost', // adresse du serveur
port : 3307,
user :  'user', // le nom d'utilisateur
password :  '', // mon mot de passe habituel
database :  'cryptodb', // le nom de la base de données
});
module.exports = connection

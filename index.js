const express = require('express');
const connection = require('./config')
const app = express()
const port = process.env.PORT || 3000;
var fetch = require('node-fetch')

app.use(express.json())

function ooIfoundData(){
    fetch('https://www.bitstamp.net/api/v2/ticker/btceur')
  .then(response => response.json())
  .then(data => {  
    console.log(data)

    const timestamp = data.timestamp
    console.log("timestamp :", timestamp)

    const open = data.open
    console.log("open :", open)

    const high = data.high
    console.log("high :", high)

    const last = data.last
    console.log("last:", last)

    const low = data.low
    console.log("low :", low)

    //on doit changer les valeurs pour des numéros dans le knex à mon avis et il faut qu'il reconnaisse que c'est bien ls bonns valeurs
    
    connection.query(`INSERT INTO ohcl_btc_usd (open, high, close, low, timestamp) VALUES ('open', 'high', 'last', 'low', 'timestamp')`),
    (err, res) => {
        if (err)
          console.log('error1', err);
        }
    })}

  /* router.post('/signup', function(req, res, next) {
  const { email, name, lastname , password} = req.body;
  
  
  const formData = [email, hash, name, lastname];
  connection.query( 'INSERT INTO users (email, password, name, lastname) VALUES (?, ?, ?, ?)', formData, (err, results) => {
    if (err)
      res.status(500).json({ flash:  err.message });
    else
      res.status(200).json({ flash:  "User has been signed up!" });
    });
});*/

ooIfoundData();




/*con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO cryptodb (open) VALUES (data.open)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });*/

connection.connect((err) => {
      if (err) throw err;
      console.log('database successfully connected')
  })

  app.listen(port, () => console.log(`Listening on port ${port}...`))

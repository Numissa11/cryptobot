const express = require('express');
const connection = require('./config')
const app = express()
const port = process.env.PORT || 3000;
var fetch = require('node-fetch')
var cron = require('node-cron');

app.use(express.json())

function ooIfoundData(){
    fetch('https://www.bitstamp.net/api/v2/ticker/btceur')
  .then(response => response.json())
  .then(data => {  
    console.log(data)

    const timestamp = (data.timestamp)
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
    const query = `INSERT INTO ohcl_btc_usd (open, high, last, low, timestamp) VALUES ('${open}', '${high}', '${last}', '${low}', '${timestamp}')`
    console.log('query', query)
    connection.query(query),
    (err, res) => {
        if (err)
          console.log('error1', err);
        }
    })}

  
 // cron.schedule('*/1 * * * *', ooIfoundData());


 cron.schedule('*/1 * * * *', () => {
    ooIfoundData()
    console.log('running a task every minute');
  });



connection.connect((err) => {
      if (err) throw err;
      console.log('database successfully connected')
  })

  app.listen(port, () => console.log(`Listening on port ${port}...`))

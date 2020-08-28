const express = require('express');
const connection = require('./config')
const app = express()
const port = process.env.PORT || 3000;
var fetch = require('node-fetch')

app.use(express.json())

function ooIfoundData(){
    var Numissa11='Numissa11'
    fetch('https://www.bitstamp.net/api/v2/ticker/btceur')
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
    }
ooIfoundData();



connection.connect((err) => {
      if (err) throw err;
      console.log('database successfully connected')
  })

  app.listen(port, () => console.log(`Listening on port ${port}...`))

/*const express = require('express');
const connection = require('./config')
const app = express()
const port = process.env.PORT || 5000;
const fetch = require('node-fetch')
const cron = require('node-cron');
const Bluebird = require('bluebird')
var tulind = require('tulind');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

// Tulip indicators console
console.log("Tulip Indicators version is:");
console.log(tulind.version);

let freshData = 0



app.use(express.json())

global.db = Bluebird.promisifyAll(connection);

connection.connect((err) => {
    if (err) throw err;
    console.log('database successfully connected')
})

async function ooIfoundData() {
    try {

        const fetchedData = await fetch('https://www.bitstamp.net/api/v2/ohlc/btceur?step=60&limit=10') // 'https://www.bitstamp.net/api/v2/ticker/btceur'

        const data = await fetchedData.json()

        console.log('data', data)
return
        const timestamp = data.timestamp
        // console.log("timestamp :", timestamp)

        const open = data.open
        // console.log("open :", open)

        const high = data.high
        // console.log("high :", high)

        const last = data.last
        // console.log("last:", last)

        const low = data.low
        // console.log("low :", low)

        // INSERT fetched data into DB
        const query = `INSERT INTO ohcl_btc_usd (open, high, last, low, timestamp) VALUES ('${open}', '${high}', '${last}', '${low}', '${timestamp}')`
        const insert = await db.queryAsync(query)

        // COUNT total id in the DB
        const totalLineCount = await db.queryAsync('SELECT COUNT (*) FROM ohcl_btc_usd')

        const string = JSON.stringify(totalLineCount);
        const json = JSON.parse(string);
        const numberTotal = json[0]['COUNT (*)']
        const numberTen = numberTotal - 26;
        const numberLimit = 26;


        // SELECT last 10 from
        query2 = `SELECT * from ohcl_btc_usd limit ${numberTen}, ${numberLimit}`

        const limit = await db.queryAsync(query2)

        const limitString = JSON.stringify(limit)
        let dataJson = JSON.parse(limitString)
        freshData = dataJson

        const openArray = dataJson.map((elem) => elem.open)
        const highArray = dataJson.map((elem) => elem.high)
        const lastArray = dataJson.map((elem) => elem.last)
        const lowArray = dataJson.map((elem) => elem.low)
        const timeArray = dataJson.map((elem) => elem.timestamp)

        // console.log(results)
        // console.log('totalLineCount', totalLineCount)
        // console.log('limit', limit)
        // console.log('count: ', numberTotal)
        // console.log('count -10:', numberTen)
        // console.log('data Json', dataJson)
        // console.log('open Array', openArray)
        // console.log('high Array', highArray)
        // console.log('last Array', lastArray)
        // console.log('low Array', lowArray)
        // console.log('time Array', timeArray)
        // console.log('open Array length', openArray.length)

      //Functions that take multiple inputs, options, or outputs use arrays.
//Call Stochastic Oscillator, taking 3 inputs, 3 options, and 2 outputs.

        // query3 = `SELECT * from settings where indicatior_name = 'macd'`

        // const indicatorSettings = await db.queryAsync(query3)

        const macd = await tulind.indicators.macd.indicator([openArray], [12, 26, 9])

        console.log('macd', macd)


    } catch (error) {
        console.log(error);
    }
}


// all indicators are console.log

// console.log('indicators', tulind.indicators);
          

app.get('/tradingData', (req, res) => {

    res.json(freshData)
})


cron.schedule('*/
/*
1 * * * *', async () => {
    await ooIfoundData()
    console.log('running a task every minute');
});



app.listen(port, () => console.log(`Listening on port ${port}...`))




exports.up = function (knex) {
      return knex.schema.createTable("ohcl_btc_usd", function (table) {
        table.increments("id").unsigned().primary();
        table.decimal('open', 8, 2);
        table.decimal("high", 8, 2);
        table.decimal("last", 8, 2);
        table.decimal("low", 8, 2);
        table.decimal("timestamp", 13, 0);
      });
    };
    
    exports.down = function(knex) {
          return knex.schema
              .dropTable("ohcl_btc_usd")
        };
    
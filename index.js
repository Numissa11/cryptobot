const express = require('express');
const connection = require('./config')
const app = express()
const port = process.env.PORT || 5000;
const fetch = require('node-fetch')
const cron = require('node-cron');
const Bluebird = require('bluebird')
var tulind = require('tulind');

app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

global.db = Bluebird.promisifyAll(connection);

connection.connect((err) => {
    if (err) throw err;
    console.log('database successfully connected')
})

// Tulip indicators console
console.log("Tulip Indicators version is:");
console.log(tulind.version);


// ***** C. O. D. E ****** //

let freshData = 0


async function ooIfoundData() {
    try {

        const fetchedData = await fetch('https://www.bitstamp.net/api/v2/ohlc/btcusd?step=60&limit=10')

        const data = await fetchedData.json()

        console.log('data', data)



        const timestamp = data.data.ohlc[0]['timestamp']
        console.log("timestamp :", timestamp)

        const open = data.data.ohlc[0]['open']
         console.log("open :", open)

        const high = data.data.ohlc[0]['high']
         console.log("high :", high)

        const close = data.data.ohlc[0]['close']
         console.log("close:", close)

        const low = data.data.ohlc[0]['low']
         console.log("low :", low)

        // INSERT fetched data into DB
        const query = `INSERT INTO ohcl_macd_bband (open, high, close, low, timestamp) VALUES ('${open}', '${high}', '${close}', '${low}', '${timestamp}')`
        const insert = await db.queryAsync(query)
/*
        // COUNT total id in the DB
        const totalLineCount = await db.queryAsync('SELECT COUNT (*) FROM ohcl_macd_bband')

        const string = JSON.stringify(totalLineCount);
        const json = JSON.parse(string);
        const numberTotal = json[0]['COUNT (*)']
        const numberReturned = numberTotal - 26;
        const numberLimit = 26;


        // SELECT last x number from Table
        query2 = `SELECT * from ohcl_btc_usd limit ${numberReturned}, ${numberLimit}`

        const limit = await db.queryAsync(query2)

        const limitString = JSON.stringify(limit)
        let dataJson = JSON.parse(limitString)
        freshData = dataJson

        const openArray = dataJson.map((elem) => elem.open)
        const highArray = dataJson.map((elem) => elem.high)
        const closeArray = dataJson.map((elem) => elem.close)
        const lowArray = dataJson.map((elem) => elem.low)
        const timeArray = dataJson.map((elem) => elem.timestamp)

         console.log(results)
         console.log('totalLineCount', totalLineCount)
         console.log('limit', limit)
         console.log('count: ', numberTotal)
         console.log('count -10:', numberTen)
         console.log('data Json', dataJson)
         console.log('open Array', openArray)
         console.log('high Array', highArray)
         console.log('last Array', lastArray)
         console.log('low Array', lowArray)
         console.log('time Array', timeArray)
         console.log('open Array length', openArray.length)

 
        // query3 = `SELECT * from settings where indicatior_name = 'macd'`

        // const indicatorSettings = await db.queryAsync(query3)

        const macd = await tulind.indicators.macd.indicator([openArray], [12, 26, 9])

        console.log('macd', macd)
*/

    } catch (error) {
        console.log(error);
    }
}


// all indicators are console.log

// console.log('indicators', tulind.indicators);
          
/*
app.get('/tradingData', (req, res) => {

    res.json(freshData)
})
*/

cron.schedule('*/1 * * * *', async () => {
    await ooIfoundData()
    console.log('running a task every minute');
});



app.listen(port, () => console.log(`Listening on port ${port}...`))
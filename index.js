const express = require('express');
const connection = require('./config')
const app = express()
const port = process.env.PORT || 5000;
const fetch = require('node-fetch')
const cron = require('node-cron');
const Bluebird = require('bluebird')
var tulind = require('tulind');

app.use(express.json())

app.use(function (req, res, next) {
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


async function ooIfoundData() {
    try {

        const fetchedData = await fetch('https://www.bitstamp.net/api/v2/ohlc/btcusd?step=60&limit=27')

        let data = await fetchedData.json()

        const ohclObject = data.data.ohlc

        // Array of 26 just fetched

        const openArray = ohclObject.map((elem) => elem.open)
        const highArray = ohclObject.map((elem) => elem.high)
        const closeArray = ohclObject.map((elem) => elem.close)
        const lowArray = ohclObject.map((elem) => elem.low)
        const timeArray = ohclObject.map((elem) => elem.timestamp)

        console.log('open array', openArray, openArray.length);

        // Tulind indicators calculations macd & bolinger

        const macd = await tulind.indicators.macd.indicator([openArray], [12, 26, 9])

        console.log('macd', macd)




        // timestamp try inserting into DB

        const timestamp = data.data.ohlc[0]['timestamp']
        console.log("timestamp :", timestamp)

        const typeoff = typeof timestamp

        console.log('type', typeoff)

        const parseTimestamp = parseFloat(timestamp)
        console.log(parseTimestamp, typeof parseTimestamp)


        // datas
        const open = data.data.ohlc[0]['open']
        console.log("open :", open)
        const parseOpen = parseFloat(open)


        const high = data.data.ohlc[0]['high']
        console.log("high :", high)
        const parseHigh = parseFloat(high)


        const close = data.data.ohlc[0]['close']
        console.log("close:", close)
        const parseClose = parseFloat(close)


        const low = data.data.ohlc[0]['low']
        console.log("low :", low)
        const parseLow = parseFloat(low)

        console.log('parseLow', parseLow);

        // INSERT fetched data into DB
        const query = `INSERT INTO ohcl_macd_bband (open, high, close, low, timestamp, macd, macd_signal, macd_histogram, bband_lower, bband_middle, bband_upper) VALUES ('${parseOpen}', '${parseHigh}', '${parseClose}', '${parseLow}', '${timestamp}', '${parseLow}','${parseLow}','${parseLow}','${parseLow}','${parseLow}','${parseLow}')`
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
                let ohclObject = JSON.parse(limitString)
                freshData = ohclObject
        
                const openArray = ohclObject.map((elem) => elem.open)
                const highArray = ohclObject.map((elem) => elem.high)
                const closeArray = ohclObject.map((elem) => elem.close)
                const lowArray = ohclObject.map((elem) => elem.low)
                const timeArray = ohclObject.map((elem) => elem.timestamp)
        
         
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
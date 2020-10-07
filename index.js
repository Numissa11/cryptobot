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

// Tulip indicators version
console.log("Tulip Indicators version is:");
console.log(tulind.version);


// ***** C. O. D. E ****** //

// Tulip Indicators expects the oldest data in the time series to be in index 0

async function reCalculate() {
    try {
        let lastMACD = null
        let beforeLastMACD = null
        let macdBuy = false
        let bbandBuy = false

        const step = 900
        const limit = 32

        const fetchedData = await fetch(`https://www.bitstamp.net/api/v2/ohlc/btcusd?step=${step}&limit=${limit}`)

        let data = await fetchedData.json()

        const ohclObject = data.data.ohlc

        const openArray = ohclObject.map((elem) => elem.open)
        const highArray = ohclObject.map((elem) => elem.high)
        const closeArray = ohclObject.map((elem) => elem.close)
        const lowArray = ohclObject.map((elem) => elem.low)
        const timeArray = ohclObject.map((elem) => elem.timestamp)

        console.log('*******************************************************');

        const currentdate = new Date(); 
        const datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

        // MACD:
        // option_names: [ 'short period', 'long period', 'signal period' ]
        // output_names: [ 'macd', 'macd_signal', 'macd_histogram' ]

        const macd = await tulind.indicators.macd.indicator([openArray], [10, 26, 9])

        const openLast = parseFloat(openArray[openArray.length - 1])

        if(openArray.length === limit){
           lastMACD = macd[2][macd[2].length - 1]
           beforeLastMACD = macd[2][macd[2].length - 2]
           if(beforeLastMACD < lastMACD){ 
               macdBuy = true} 
        }

        // BBANDS:
        // option_names: [ 'period', 'stddev' ]
        // output_names: [ 'bbands_lower', 'bbands_middle', 'bbands_upper' ]

        const bband = await tulind.indicators.bbands.indicator([openArray], [5, 2])

        const lastBband = bband[0][bband[0].length - 1]
        if(lastBband > openLast){
            bbandBuy = true
        }

        console.log('datetime', datetime)
        console.log('openArray.length', openArray.length)
        console.log('limit', limit)
        console.log('candle minutes', step / 60)
        console.log('macd output array shorter:', tulind.indicators.macd.start([10,26,9]));
        console.log('bbands output array shorter:', tulind.indicators.bbands.start([5,2]));

        console.log('openLast', openLast)
        console.log('beforeLastMACD', beforeLastMACD)
        console.log('lastMACD', lastMACD)
        console.log('lastBband', lastBband)
        console.log('macd buy', macdBuy)
        console.log('bbands buy', bbandBuy)
        console.log('BUY NOW -->', macdBuy && bbandBuy)
        console.log('SELL AT:', openLast * 1.03)
    } catch (error) {
        console.log(error);
    }
}

cron.schedule('*/1 * * * *', async () => {
    await reCalculate()
    console.log('running a task every minute');
});

app.listen(port, () => console.log(`Listening on port ${port}...`))
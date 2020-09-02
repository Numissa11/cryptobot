const express = require('express');
const connection = require('./config')
const app = express()
const port = process.env.PORT || 3000;
const fetch = require('node-fetch')
const cron = require('node-cron');
const Bluebird = require('bluebird')

let total1 = 0

let total2 = 0

app.use(express.json())

global.db = Bluebird.promisifyAll(connection);

connection.connect((err) => {
    if (err) throw err;
    console.log('database successfully connected')
})

async function ooIfoundData() {
    try {
        const fetchedData = await fetch('https://www.bitstamp.net/api/v2/ticker/btceur')

        const data = await fetchedData.json()

        console.log('data', data)

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

        // INSERT fetched data into DB
        const query = `INSERT INTO ohcl_btc_usd (open, high, last, low, timestamp) VALUES ('${open}', '${high}', '${last}', '${low}', '${timestamp}')`
        const insert = await db.queryAsync(query)

        // COUNT total id in the DB
        const resCount = await db.queryAsync('SELECT COUNT (*) FROM ohcl_btc_usd')
        total1 = resCount
        const string = JSON.stringify(total1);
        const json =  JSON.parse(string);
        const numberTotal = json[0]['COUNT (*)']
        const numberTen = numberTotal - 10;
        const numberFor = 4;


        // SELECT last 10 from
        query2 = `SELECT * from ohcl_btc_usd limit ${numberTen}, ${numberFor}`
        const limit = await db.queryAsync(query2)

        // console.log(results)
        console.log('insert', insert)
        console.log('total1', total1)
        console.log('limit', limit)
        console.log('string', string)
        console.log('json', json)
        console.log('count: ', numberTotal)
        console.log('count -10:', numberTen)


    } catch (error) {
        console.log(error);
    }
}






cron.schedule('*/1 * * * *', async () => {
    await ooIfoundData()
    console.log('running a task every minute');
});








app.listen(port, () => console.log(`Listening on port ${port}...`))
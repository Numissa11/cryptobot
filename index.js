const express = require('express');
const connection = require('./config')
const app = express()
const port = process.env.PORT || 3000;
const fetch = require('node-fetch')
const cron = require('node-cron');


app.use(express.json())


connection.connect((err) => {
    if (err) throw err;
    console.log('database successfully connected')
})

function ooIfoundData() {
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


            const query = `INSERT INTO ohcl_btc_usd (open, high, last, low, timestamp) VALUES ('${open}', '${high}', '${last}', '${low}', '${timestamp}')`
            connection.query(query),
                (err, res) => {
                    if (err)
                        console.log('error1', err);

                }
        })

        .then(function (req, res) {
            connection.query('SELECT COUNT (*) FROM ohcl_btc_usd',(err, results) => {
                if (err)
                    console.log(err)
                else
                    console.log(results);
                    const total = results;
                    console.log("total :", total) 
                return results
            });
           
        });






}





cron.schedule('*/1 * * * *', () => {
    ooIfoundData()
    console.log('running a task every minute');
});








app.listen(port, () => console.log(`Listening on port ${port}...`))
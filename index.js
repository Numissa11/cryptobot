const express = require('express') 
const connection = require('./config')

const app = express()

app.use(express.json())

app.listen(3000)

connection.connect((err) => {
      if (err) throw err;
      console.log('database successfully connected')
  })
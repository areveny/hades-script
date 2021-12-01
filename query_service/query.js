const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3')

var db = new sqlite3.Database('../hades-index.db')

const app = express()
app.use(cors())
const port = 3000

app.get("/", (req, res) => {

    db.all("SELECT * FROM lines", function(err, rows) {
        res.json(rows)
    })

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
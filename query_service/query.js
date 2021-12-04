const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3')

var db = new sqlite3.Database('../hades-index.db')

const app = express()
app.use(cors({'origin': true}))
app.use(express.json())
const port = 4000

app.get("/", (req, res) => {

    db.all("SELECT * FROM lines", function(err, rows) {
        res.json(rows)
    })

})

app.post("/", (req, res) => {
    console.log(req.body)
    res.json(req.body)
    // db.all(req.body.query, function(err, rows) {
    //     console.log(rows)
    //     res.json(req.body.query)
    // })

    }
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
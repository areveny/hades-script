const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3')
const { performance } = require('perf_hooks')

var db = new sqlite3.Database('../hades-index.db')

const app = express()
app.use(cors({'origin': true}))
app.use(express.json())
const port = 4000

function getQuery(queryProps) {
    var filters = ""
    if (queryProps.selectedSpeakers.length > 0) {
        filters = ` WHERE speaker IN ("${queryProps.selectedSpeakers.join("\", \"")}")`
    }
    var query = `SELECT * FROM lines${filters};`
    console.log(query)
    return query
}


app.get("/", (req, res) => {

    db.all("SELECT * FROM lines", function(err, rows) {
        res.json(rows)
    })

})

app.post("/", (req, res) => {
    var startTime = performance.now()
    db.all(getQuery(req.body), function (err, rows) {
        res.json(rows)
    })
    var endTime = performance.now()
    console.log(`${JSON.stringify(req.body)} took  ${endTime - startTime}`)
}
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
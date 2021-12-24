const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3')
const { performance } = require('perf_hooks')
const moment = require('moment');

var db = new sqlite3.Database('./hades-index.db')

const app = express()
app.use(cors({'origin': true}))
app.use(express.json())
const port = 4000

function getStatement(queryProps) {
    var filters = []
    var params = []
    var speakersSelected = queryProps.selectedSpeakers.length
    if (speakersSelected > 0) {
        var speakerParamSlots = '?' + ',?'.repeat(speakersSelected - 1)
        filters.push(` speaker IN (${speakerParamSlots})`)
        queryProps.selectedSpeakers.forEach(speaker => params.push(speaker))
    }
    if (queryProps.matchString != '') {
        filters.push(` text LIKE '%' || ? || '%'`)
        params.push(queryProps.matchString)
    }
    if (filters.length > 0) {
        filterText = ` WHERE ${filters.join(' AND ')}`
    }
    var preparedStatement = db.prepare(`SELECT * FROM lines ${filterText} ORDER BY rowid LIMIT 100;`, params)
    return preparedStatement
}


app.get("/", (req, res) => {
    db.all("SELECT * FROM lines LIMIT 10", function(err, rows) {
        res.json(rows)
    })
    console.log(`${moment().format()}: GET root`)
})

app.post("/conversation", (req, res) => {
    var startTime = performance.now()
    var statement = db.prepare('SELECT * FROM lines WHERE conversation_name=? ORDER BY rowid')
    statement.all([req.body.conversation_name],
        function (err, rows) {
            res.json(rows)
        })
    var endTime = performance.now()
    console.log(`${moment().format()}: Conversation ${req.body.conversation_name} took ${endTime - startTime}`)
})

app.post("/", (req, res) => {
    var startTime = performance.now()
    var statement = db.prepare(`SELECT * FROM lines WHERE text LIKE '%' || ? || '%';`, [req.body.matchString])
    // db.all(getQuery(req.body), function (err, rows) {
    var preparedStatement = getStatement(req.body)
    preparedStatement.all( function (err, rows) {
        res.json(rows)
    })
    var endTime = performance.now()
    console.log(`${moment().format()}: Query ${JSON.stringify(req.body)} took ${endTime - startTime}`)
})


app.listen(port, () => {
    console.log(`Query service listening at http://localhost:${port}`)
  })
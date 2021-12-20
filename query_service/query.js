const express = require('express')
const cors = require('cors')
const db = require('better-sqlite3')('./hades-index.db')
const { performance } = require('perf_hooks')

const app = express()
app.use(cors({ 'origin': true }))
app.use(express.json())
const port = 4000

function getQuery(queryProps) {
    var filters = []
    if (queryProps.selectedSpeakers.length > 0) {
        filters.push(` speaker IN ("${queryProps.selectedSpeakers.join("\", \"")}")`)
    }
    if (queryProps.matchString !== '') {
        filters.push(` text LIKE "%${queryProps.matchString}%"`)
    }
    if (filters.length > 0) {
        filterText = ` WHERE ${filters.join(' AND ')}`
    }
    var query = `SELECT * FROM lines ${filterText} ORDER BY rowid LIMIT 100;`
    console.log(query)
    return query
}

app.get("/", (req, res) => {
    res.json(db.prepare("SELECT * FROM lines LIMIT 100").all())
})

app.post("/conversation", (req, res) => {
    console.log(req.body)
    res.json(db.prepare(`SELECT * FROM lines WHERE conversation_name='${req.body.conversation_name}' ORDER BY rowid`).all())
    var endTime = performance.now()
}
)

app.post("/", (req, res) => {
    var startTime = performance.now()
    res.json(getQuery(req.body).all())
    var endTime = performance.now()
    console.log(`${JSON.stringify(req.body)} took  ${endTime - startTime}`)
}
)

app.listen(port, () => {
    console.log(`Hades DB listening at http://localhost:${port}`)
})
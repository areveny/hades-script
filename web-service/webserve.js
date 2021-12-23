const express = require('express')

const app = express()
app.use(express.static('build'))
app.use(express.json())
const port = 3000

app.get('/*', function(req, res) {
    res.sendFile('/index.html', {root: './build'})
})

app.listen(port, () => {
    console.log(`Webserver listening at http://localhost:${port}`)
  })
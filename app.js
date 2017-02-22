var express = require('express')
var app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index')
})

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})


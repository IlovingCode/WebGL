/* eslint-env node */
/* eslint no-console: ["off"] */

const express = require('express')
const app = express()

app.use(express.static('data'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = 8080
app.listen(port, '0.0.0.0', () => console.log(`app listening on port ${port}`))

var {exec} = require('child_process');
exec('start chrome http://localhost:8080');
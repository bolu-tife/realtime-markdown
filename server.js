const express = require('express');
const app = express();
const sharejs = require('share');
const { URL } = require('url');

require('redis');


// set the view engine to ejs
app.set('view engine', 'ejs');

// public folder to store assets
app.use(express.static(__dirname + '/public'));

// routes for app
app.get('/', function(req, res) {
  res.render('pad');
});

app.get('/(:id)', function(req, res) {
  res.render('pad');
});


// set up redis server
if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);
  console.log(rtg.auth)
  redis.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis").createClient();
}


// options for sharejs
var options = {
  db: {type: 'redis', client: redis}
};


// attach the express server to sharejs
sharejs.server.attach(app, options);


// listen on port 8000 (for localhost) or the port defined for heroku
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
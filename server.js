var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var plivo = require('plivo');
var path = require('path');


//requires models as the database

//CONFIGURATION

app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname + '/css')));

app.use('/fonts', express.static(path.join(__dirname + '/fonts')));

app.use('/img', express.static(path.join(__dirname + '/img')));

app.use('/js', express.static(path.join(__dirname + '/js')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000000 }
}));

var p = require('./js/script.js');

app.get('/moment/*', function (req, res) {

	res.render('singleMoment');
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/topTen', function (req, res) {
  res.render('curatedMoments');
})

app.get('/feed', function (req, res) {
  res.render('momentFeed');
});

// RENDER CAMPAIGN PAGE
app.get('/campaign', function (req, res) {
  res.render('campaign');
});

//SEND TEXT MESSAGES
app.post('/send', function (req, res) {
  console.log(req.body);
  p.sendText(req.body, function(err, response, body) {
  });
});

//RENDER DOWNLOAD PAGE
app.get('/download', function (req, res) {
  res.render('download');
});

//RENDER PODCAST PAGE
app.get('/makesomenoise', function (req, res) {
  res.render('makesomenoise');
});
app.listen(process.env.PORT || 3000);



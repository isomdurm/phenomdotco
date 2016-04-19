var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var plivo = require('plivo');


//requires models as the database

//CONFIGURATION

app.set('view engine', 'ejs');

app.use('/css', express.static('css'));

app.use('/fonts', express.static('fonts'));

app.use('/img', express.static('img'));

app.use('/js', express.static('js'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000000 }
}));

var p = require('./js/script.js');




// RENDER HOME PAGE
app.get('/', function (req, res) {
	res.render('home');
});

app.post('/send', function (req, res) {
  p.plivo(req.body, function(err, response, body) {
    var sentText = JSON.parse(body);
    res.json(sentText);
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



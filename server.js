var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var Q = require('q');

var Bitstamp = require('bitstamp');
var bitstamp = new Bitstamp();

var server;
server = express();

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

server.get('/', function (req, res, next) {
    res.render('index');
});

server.post('/order', function (req, res) {
    Q.nbind(transporter.sendMail, transporter)({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'New order',
            html: req.body
        })
        .then(function () {
            return res.send('Sent');
        })
        .fail(function (err) {
            console.log(err);
            return res.status(500).send(err.message);
        });
});

server.get('/ticker', function (req, res) {
    Q.nbind(bitstamp.ticker, bitstamp)()
        .then(function (ticker) {
            return res.send(ticker.last);
        })
        .fail(function (err) {
            console.log(err);
            return res.status(500).send(err.message);
        });
});


var port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', function () {
    console.log('listening on port ' + port);
});


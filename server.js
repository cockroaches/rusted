var restify = require('restify');
var fs = require('fs'); 
var https = require('https');
var http = require('http');
var nodemailer = require('nodemailer');

var Q = require('q');

var Bitstamp = require('bitstamp');
var bitstamp = new Bitstamp;

var server;
server = restify.createServer({
    name: 'rusted',
    version: '0.1.0'
});
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: false}));
server.use(
    function crossOrigin(req,res,next){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
          return next();
    }
);

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

server.get('/', function (req, res, next) {
    res.send('OK!!');
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
            return res.send(500, err.message);
        });
});

server.get('/ticker', function (req, res) {
    Q.nbind(bitstamp.ticker, bitstamp)()
        .then(function (ticker) {
            return res.send(ticker.last);
        })
        .fail(function (err) {
            console.log(err);
            return res.send(500, err.message);
        });
});


var port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', function () {
    console.log('listening on port ' + port);
});


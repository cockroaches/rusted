var restify = require('restify');
var fs = require('fs'); 
var https = require('https');
var http = require('http');
var nodemailer = require('nodemailer');

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


server.get('/', function (req, res, next) {
    res.send('OK!!');
});


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'rnd@magicinbits.com',
        pass: 'dS$HVF123A1'
    }
});

var port = 80;
server.listen(port, '0.0.0.0', function () {
    console.log('listening on port ' + port);
});


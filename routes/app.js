module.exports = function(app) {

    var App = require('../models/app/schema.js');

    //GET - Return all users in the DB
    getKey = function (req, res) {
        App.find(function (err, apps) {
            if (!err) {
                console.log('GET /apps')
                res.send(apps);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    getPublicKey = function(req,res){
        App.findById('55080390e5f4114c13000001', function (err, app) {
            if (!err) {
                console.log('GET /PublicKey');
                console.log('Apps: '+app);
                console.log('Public Key: '+app.publicKey);
                res.send(app.publicKey);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };
    getExponent = function(req,res){
        App.findById('55080390e5f4114c13000001', function (err, app) {
            if (!err) {
                console.log('GET /Exponent');
                var keys = require('node-rsa');
                var pair = new keys();
                console.log('GET PRIVATE KEY');
                pair.importKey(app.privateKey);
                console.log(pair);
                res.send(app.publicKey);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };
    getModulus = function(req,res){
        App.findById('55080390e5f4114c13000001', function (err, app) {
            if (!err) {
                console.log('GET /Modulus');
                console.log('Modulus: '+app);
                res.send(app.publicKey);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

        postKeys = function (req,res){
            console.log('POST');
            var keys = require('node-rsa');
            var pair2 = new keys({b: 2048});

            var app = new App({
                privateKey:  pair2.exportKey('pkcs8'),
                publicKey: 	  pair2.exportKey('pkcs8-public')
            });
            console.log(app);

            app.save(function(err) {
                if(!err) {
                    console.log('Created');
                } else {
                    console.log('ERROR: ' + err);
                }
            });
    };

    app.get('/apps', getKey);
    app.get('/publicKey', getPublicKey);
    app.get('/getExponent', getExponent);
    app.get('/getModulus', getModulus);
    app.post('/apps',postKeys);
}



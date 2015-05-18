module.exports = function(app) {

    var App = require('../models/app/schema.js');
    var big = require('big-integer');

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

    postVote = function(req,res){

        var PID = null;
        var sign = null;
        var vote = null;
        var digest = null;

        App.findById('55080390e5f4114c13000001', function (err, app) {
            console.log(app);
            if (!err) {
                var keys = require('node-rsa');
                var pair = new keys();
                console.log('GET PRIVATE KEY');
                pair.importKey(app.privateKey);

                /*

                PID = pair.exportKey('pkcs8-public-pem');
                console.log('PID pkcs8');
                console.log(PID);


                //Importar la clave desde pkcs8

                var pair2 = new keys();
                pair2.importKey(req.body.PID);
                console.log('PID: '+PID);
                console.log('------------------');
                var PIDe = pair2.keyPair.e.toString();
                console.log('PIDe: ' + PIDe);
                console.log('------------------');

                var PIDn =pair2.keyPair.n.toString();
                console.log('PIDn: '+ PIDn);
                console.log('------------------');


                //fin importar


                var presign = require("crypto")
                    .createHash("sha1")
                    .update(PID)
                    .digest("hex");
                presign=big(presign,16);
                console.log('Hash: ' + presign);
                sign = (big(presign).modPow(pair.keyPair.d, pair.keyPair.n)).toString();
                console.log('sign Generado');
                console.log('------------------');

                */

                vote = (big("voto",16).modPow(pair.keyPair.d, pair.keyPair.n)).toString();
                console.log('vote Generado');
                console.log('------------------');

                var predigest = require("crypto")
                    .createHash("sha1")
                    .update(vote)
                    .digest("hex");
                predigest=big(predigest,16);
                digest =  (big(predigest).modPow(pair.keyPair.d, pair.keyPair.n)).toString();

                //Fin Aux

                //
                //Importar la clave desde pkcs8
                console.log('Importando Key Publica');
                var pair2 = new keys();
                pair2.importKey(req.body.PID);
                console.log('PID: '+PID);
                console.log('------------------');
                var PIDe = pair2.keyPair.e.toString();
                console.log('PIDe: ' + PIDe);
                console.log('------------------');

                var PIDn =pair2.keyPair.n.toString();
                console.log('PIDn: '+ PIDn);
                console.log('------------------');


                //fin importar


                //fin importar


                //

                //Inicio
                console.log('------------------');
                console.log('PID: ');
                console.log(PID);
                console.log('PIDe: ');
                console.log(PIDe);
                console.log('PIDn: ');
                console.log(PIDn);
                console.log('sign: ');
                console.log(sign);
                console.log('vote: ');
                console.log(vote);
                console.log('digest:');
                console.log(digest);
                console.log('------------------');

                //Decrypt Sign + hash + compare

                var decryptSign = (big(sign).modPow(PIDe, PIDn));
                var hashPID = require("crypto")
                    .createHash("sha1")
                    .update(PID)
                    .digest("hex");
                hashPID = big(hashPID,16).toString();
                console.log('HashPID:');
                console.log(hashPID.toString());
                console.log('decrypt Sign:');
                console.log(decryptSign.toString());

                console.log('------------------');

                //Decrypt Dogest + hash + compare

                var decryptDigest = (big(digest).modPow(pair.keyPair.e, pair.keyPair.n));
                var hashVote = require("crypto")
                    .createHash("sha1")
                    .update(vote)
                    .digest("hex");
                hashVote = big(hashVote,16).toString();
                console.log('HashVote:');
                console.log(hashVote.toString());
                console.log('decrypt Vote:');
                console.log(decryptDigest.toString());

                console.log('------------------');

            } else {
                console.log('ERROR: ' + err);
            }
        });




        //Operaciones aux

        /*
        //Hacer Hash a algo

        var PID1 = require("crypto")
            .createHash("sha1")
            .update(req.body.PID)
            .digest("hex");
        PID1=big(PID1,16);
        console.log('Hash: ' + PID1);
        console.log('------------------');



        //encrypt
        App.findById('55080390e5f4114c13000001', function (err, app) {
            if (!err) {
                var keys = require('node-rsa');
                var pair = new keys();
                console.log('GET PRIVATE KEY');
                pair.importKey(app.privateKey);
                console.log('Potencia D modulo N');
                var cryptPID = (big(PID1).modPow(pair.keyPair.d, pair.keyPair.n));
                console.log(cryptPID);

                console.log('------------------');

                //decrypt
                console.log(pair.keypair);
                var decryptPID = (big(cryptPID).modPow(pair.keyPair.e, pair.keyPair.n));
                console.log(decryptPID);
                console.log('compare');
                console.log(PID);
                console.log('------------------');
            } else {
                console.log('ERROR: ' + err);
            }
        });
         */

    };

    app.get('/apps', getKey);
    app.get('/publicKey', getPublicKey);
    app.get('/getExponent', getExponent);
    app.get('/getModulus', getModulus);
    app.post('/apps',postKeys);
    app.post('/EU/Evote',postVote);
};



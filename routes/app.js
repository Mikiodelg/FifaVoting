module.exports = function(app) {

    var App = require('../models/app/schema.js');
    var table = require('../models/etable/schema.js');
    var vote = require('../models/vote/schema.js');
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
/*
    getModulus2 = function(req,res){
        App.findById('555b1ffe378a083025000002', function (err, app) {
            if (!err) {
                console.log('GET /Modulus');
                var keys = require('node-rsa');
                var pair = new keys();
                console.log('GET PRIVATE KEY');
                pair.importKey(app.privateKey);
                console.log('Modulus:');

                var exp = pair.keyPair.n.toString();
                var bigint = big(exp,16);
                console.log(bigint.toString());
                res.send(bigint.toString());
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    getExponent2 = function(req,res){
        App.findById('555b1ffe378a083025000002', function (err, app) {
            if (!err) {
                console.log('GET /Exponent');
                var keys = require('node-rsa');
                var pair = new keys();
                console.log('GET PRIVATE KEY');
                pair.importKey(app.privateKey);
                console.log('exponent:');
                //console.log(pair.keyPair.e);
                res.send(pair.keyPair.e.toString());
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };*/
    getPublicKey = function(req,res){
        App.findById('55672288b7d50fce1c000001', function (err, app) {
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

    getAll = function(req,res){
        table.find(function (err, etable) {
            if (!err) {
                console.log('GET /table')
                res.send(etable);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    getG = function(req,res){
        table.findById('5567286436e9dadc1e000001', function (err, etable) {
            if (!err) {
                console.log('GET /G = '+etable.g);
                etable.g;
                res.send(etable.g);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    getN = function(req,res){
        table.findById('5567286436e9dadc1e000001', function (err, etable) {
            if (!err) {
                console.log('GET /N = '+etable.n);
                etable.n;
                res.send(etable.n);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };
    aux = function (req,res){
        table.findById('5567286436e9dadc1e000001', function (err, etable) {
                 etable.result=0;
            etable.save(function(err) {
                if(!err) {
                    console.log('Updated');
                } else {
                    console.log('ERROR: ' + err);
                }
        });
        res.send('200: Ok - Votacion abierta');
    });
    };


    postKeys = function (req,res){
            console.log('POST');
            var keys = require('node-rsa');
            var pair2 = new keys({b: 1024});

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
        res.send('200: Creacion de Claves correcta.')
    };


    postVote = function(req,res) {


        var PID = 'req.body.PID';
        var sign = req.body.sign;
        var vote = req.body.vote;
        var digest = req.body.digest;

        console.log('PID: ' + PID);
        console.log('sign: ' + sign);
        console.log('vote: ' + vote);
        console.log('digest: ' + digest);

        var open = false;
        console.log('comprobamos si esta abierta');
        table.findById('5567286436e9dadc1e000001', function (err, etable) {
            console.log('Mesa:');
            console.log(etable.open);
            if (etable.open == true) {
                open = true;
            }

        console.log('mesa despues de encontrar: ' + open);
        if (open == true) {
            console.log('mesa abierta, miramos si has votado');
            var evote = require('../models/vote/schema.js');

            evote.findOne({ 'PID': PID }, function(err, votedb) {
                console.log(votedb);
            if (votedb != null) {
                console.log('Ya has votado');
                res.send('400: Ya has votado');
            }
                else {
                console.log('Mesa abierta y no has votado');

                App.findById('55672288b7d50fce1c000001', function (err, app) {

                    console.log(app);
                    if (!err) {
                        var keys = require('node-rsa');
                        var pair = new keys();
                        console.log('GET PRIVATE KEY');
                        pair.importKey(app.privateKey);

                        PID = pair.exportKey('pkcs8-public-pem');
                        console.log('PID pkcs8');
                        console.log(PID);


                        //Importar la clave desde pkcs8

                        var pair2 = new keys();
                        pair2.importKey(req.body.PID);
                        console.log('PID: ' + PID);
                        console.log('------------------');
                        var PIDe = pair2.keyPair.e.toString();
                        console.log('PIDe: ' + PIDe);
                        console.log('------------------');

                        var PIDn = pair2.keyPair.n.toString();
                        console.log('PIDn: ' + PIDn);
                        console.log('------------------');


                        //fin importar


                        var presign = require("crypto")
                            .createHash("sha1")
                            .update(PID)
                            .digest("hex");
                        presign = big(presign, 16);
                        console.log('Hash: ' + presign);
                        sign = (big(presign).modPow(pair.keyPair.d, pair.keyPair.n)).toString();
                        console.log('sign Generado');
                        console.log('------------------');


                        vote = (big("voto", 16).modPow(pair.keyPair.d, pair.keyPair.n)).toString();
                        console.log('vote Generado');
                        console.log('------------------');

                        var predigest = require("crypto")
                            .createHash("sha1")
                            .update(vote)
                            .digest("hex");
                        predigest = big(predigest, 16);
                        digest = (big(predigest).modPow(pair.keyPair.d, pair.keyPair.n)).toString();

                        //Fin Aux

                        //
                        //Importar la clave desde pkcs8
                        console.log('Importando Key Publica');
                        var pair2 = new keys();
                        pair2.importKey(req.body.PID);
                        console.log('PID: ' + PID);
                        console.log('------------------');
                        var PIDe = pair2.keyPair.e.toString();
                        console.log('PIDe: ' + PIDe);
                        console.log('------------------');

                        var PIDn = pair2.keyPair.n.toString();
                        console.log('PIDn: ' + PIDn);
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

                        var decryptSign = (big(sign).modPow(pair.keyPair.e, pair.keyPair.n));
                        var hashPID = require("crypto")
                            .createHash("sha1")
                            .update(PID)
                            .digest("hex");
                        hashPID = big(hashPID, 16).toString();
                        console.log('HashPID:');
                        console.log(hashPID.toString());
                        console.log('decrypt Sign:');
                        console.log(decryptSign.toString());

                        console.log('------------------');

                        //Decrypt Dogest + hash + compare

                        var decryptDigest = (big(digest).modPow(PIDe, PIDn));
                        var hashVote = require("crypto")
                            .createHash("sha1")
                            .update(vote)
                            .digest("hex");
                        hashVote = big(hashVote, 16).toString();
                        console.log('HashVote:');
                        console.log(hashVote.toString());
                        console.log('decrypt vote:');
                        console.log(decryptDigest.toString());

                        console.log('------------------');


                        if (hashPID.toString() === decryptSign.toString()) {

                            if (hashVote.toString() === decryptDigest.toString()) {
                                console.log('Guardamos el voto');

                                var evote = new vote({
                                    PID: PID,
                                    sign: sign,
                                    vote: vote,
                                    digest: digest
                                });
                                console.log(vote);

                                evote.save(function (err) {
                                    if (!err) {
                                        console.log('Voto guardado');
                                    } else {
                                        console.log('ERROR: ' + err);
                                    }
                                });

                                res.send('200:OK - Voto Guardado');
                            }
                            else {
                                console.log('402: vote invalido.');
                                res.send('402: vote invalido.');
                            }
                        }
                        else
                            console.log('401: Sign invalido.');
                        res.send('401: Sign invalido.')

                    } else {
                        console.log('ERROR: ' + err);
                        res.send('Error: ' + err);
                    }

                });
            }

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
            });
        };


        });
    }



    openVote = function (req,res){
        console.log('Abroendo la votacion');
        var bigint = require('bignum');
        var keyLength = 1024;

        var p, q, n, phi, n2;

        p = bigint.prime(keyLength/2);
        do {
            q = bigint.prime(keyLength/2);
            n= p.mul(q);

            phi = (p.sub(1)).mul(q.sub(1));
        } while(p.cmp(q) == 0 || n.bitLength() != keyLength || n.gcd(phi) != 1);
        n2 = n.pow(2);

        var lcm = function(a,b) {
            return (a.mul(b)).div(a.gcd(b));
        };

        console.log('p: '+ p);
        console.log('q: '+ q);
        console.log('n: '+n);
        console.log('n^2: '+n2);

        var lambda = lcm( p.sub(1) , q.sub(1) );

        console.log('lambda: '+ lambda);

        var alpha, beta;
        alpha = bigint.rand(n);

        do {
            beta = bigint.rand(n);
        } while(alpha == beta);

        console.log('alpha: '+alpha.toString());
        console.log('beta: '+beta.toString());

        var g = (((alpha.mul(n)).add(1)).mul(beta.powm(n,n2))).mod(n2);
        console.log('g: '+g.toString());

        var u = g.powm(lambda,n2);
        console.log('u: '+ u);

        var L = (u.sub(1)).div(n);
        console.log('L: '+L);

        var mu = L.invertm(n);
        console.log('mu: '+mu.toString());

        console.log('POST');
        var keys = require('node-rsa');
        var pair2 = new keys({b: 1024});

        var etable = new table({
            n: n,
            g:g,
            lambda:lambda,
            mu:mu,
            open:true});
        console.log(etable);

        etable.save(function(err) {
            if(!err) {
                console.log('Created');
            } else {
                console.log('ERROR: ' + err);
            }
        });
        res.send('200: Creacion de Claves correcta.')



        console.log('Claves mesa creadas, votacion abierta');
        res.send('200: Ok - Votacion abierta');
    };

    deleteVotes = function (req,res) {

        vote.collection('vote', function(err, collection) {
            collection.remove();

            console.log('200: OK - Votos Borrados, urna vacía');
            res.send('200: OK - Votos Borrados, urna vacía');
        });
    };

    app.get('/apps', getKey);
    app.get('/publicKey', getPublicKey);
    app.get('/EU/getG', getG);
    app.get('/EU/getN', getN);
//    app.get('/EU/getExponent', getExponent2);
//    app.get('/EU/getModulus', getModulus2);
    app.post('/apps/register',postKeys);
    app.post('/EU/Evote',postVote);
    app.post('/EU/Open',openVote);
    app.get('/EU/getall',getAll);
    app.get('/EU/aux',aux);
    app.delete('/EU/deleteVotes', deleteVotes);
//    app.post('/EU/Close',closeVote);
//    app.get('/EU/results',getResults);
};



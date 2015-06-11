module.exports = function(app) {

    var App = require('../models/app/schema.js');
    var table = require('../models/etable/schema.js');
    var vote = require('../models/vote/schema.js');
    var bigint = require('big-integer');
    var bignum = require('bignum');

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
                 etable.open=true;
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


        var PID = req.body.PID;
        var sign = req.body.sign;
        var vote = req.body.vote;
        var digest = req.body.digest;
        console.log('Entra');
        console.log('PID: ' + PID);
        console.log('sign: ' + sign);
        console.log('vote: ' + vote);
        console.log('digest: ' + digest);
        console.log('-----');

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




                        //Importar la clave desde pkcs8


                        var pair2 = new keys();
                        pair2.importKey(req.body.PID);

                        PID = pair2.exportKey('pkcs8-public-pem');
                        console.log('PID pkcs8');
                        console.log(PID);

                        console.log('PID: ' + PID);
                        console.log('------------------');
                        var PIDe = pair2.keyPair.e.toString();
                        console.log('PIDe: ' + PIDe);
                        console.log('------------------');

                        var PIDn = pair2.keyPair.n.toString();
                        console.log('PIDn: ' + PIDn);
                        console.log('------------------');


                        //fin importar

                /*
                    presign = require("crypto")

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
                 */
                        //Decrypt Sign + hash + compare

                        console.log('Decrypt sign + hash:');

                        var signpid = req.body.sign;
                        console.log('signpid sin desencriptar:'+signpid.toString());
                        var decryptSign = (big(signpid).modPow(pair.keyPair.e, pair.keyPair.n));
                        console.log('signpid con  desencriptar:'+decryptSign.toString());
                        var hashPID = require("crypto")
                            .createHash("sha1")
                            .update(PID)
                            .digest("hex");
                        console.log('hash primero:'+hashPID);
                        hashPID = big(hashPID, 16).toString();
                        console.log('HashPID:');
                        console.log(hashPID.toString());
                        console.log('decrypt Sign:');
                        console.log(decryptSign.toString());

                        console.log('------------------');

                        //Decrypt Dogest + hash + compare
                        var vote = req.body.vote;
                        var digestvote = (req.body.digest);

                        var decryptDigest = (big(digestvote).modPow(PIDe, PIDn));
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

    getResults = function (req,res) {

        function padL(a,b,c){//string/number,length=2,char=0
            return (new Array(b||2).join(c||0)+a).slice(-b)
        }

        table.findById('5567286436e9dadc1e000001', function (err, etable) {
            if (!err) {
                console.log('GET /results = '+etable.result);

                var bigint = require('bignum');
                var n=bigint(etable.n);
                var n2 = n.pow(2);
                var mu = bigint(etable.mu);
                var lambda = bigint(etable.lambda);
                var ctotal = bigint(etable.result);

                var u1 = ctotal.powm(lambda,n2);
                var L1 = (u1.sub(1)).div(n);

                var mtotal =(L1.mul(mu)).mod(n);
                console.log('mtotal: '+mtotal.toString());

                console.log('lenght: '+ mtotal.toString().length);
                var mtotalpad = padL(mtotal.toString(),20);
                console.log('mtotalpad: '+mtotalpad);
                console.log('----------');
                var arrayres= new Array(10);
                var arrayname= new Array(10);
                arrayname = ['Alba','Mascherano','Pique','Alves','Busquets','Iniesta','Xavi','Neymar','Suarez','Messi'];

                var i = 0;
                var j = 0;
                while(i<20) {
                    arrayres[j] = mtotalpad.toString().substring(i, i + 2);
                    console.log(arrayname[j]);
                    console.log(mtotalpad.toString().substring(i, i + 2));
                    i = i + 2;
                    j++;
                }

                var jsonArr = [];

                for (var k = 0; k < arrayname.length; k++) {
                    jsonArr.push({
                        name: arrayname[k],
                        votes: arrayres[k]
                    });
                }
                res.send(jsonArr);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    closeVote = function (req,res) {
        table.findById('5567286436e9dadc1e000001', function (err, etable) {
            console.log('table: ' + etable);
            etable.open = false;

            vote.find(function (err, votes) {
                var bigint = require('bignum');
                var n=bigint(etable.n);
                var n2 = n.pow(2);

                var resul=bigint(votes[0].vote);
                for (i=1;i<votes.length;i++){
                    resul = (resul.mul(votes[i].vote)).mod(n2);
                }
                etable.result = resul;

                etable.save(function (err) {
                if (!err) {
                    console.log('Updated');
                } else {
                    console.log('ERROR: ' + err);
                }
            });
            console.log('Votacion Cerrada');
            res.send("200:OK");
            });
        });
    };

    createVotes = function(req,res){

        table.findById('5567286436e9dadc1e000001', function (err, etable) {
            var bigint = require('bignum');
            var big= require('big-integer');
            var contador=0;
            var Cvote;
            var n=bigint(etable.n);
            var n2 = n.pow(2);
            var g=bigint(etable.g);
            var m;
            var r;

            console.log('g: '+g);
            console.log('n: '+n);
            console.log('n2: '+n2);
            for (i = 0; i < 6; i++) {

                contador++;
                console.log('voto numero: ' + contador);
                m = Math.pow(100, 8);
                r = bigint.rand(n);
                Cvote= ((g.powm(m,n2)).mul(r.powm(n,n2))).mod(n2);
                console.log('Cvote: ' + Cvote);
                var evote = new vote({
                    PID: 'prueba',
                    sign: 'prueba',
                    vote: Cvote,
                    digest: 'prueba'
                });
                console.log(evote);
                evote.save(function (err) {
                    if (!err) {
                        console.log('Voto guardado');
                    } else {
                        console.log('ERROR: ' + err);
                    }
                });
                console.log('voto guardado');
                console.log('---------');

            }
            for (i = 0; i < 3; i++) {

                contador++;
                console.log('voto numero: ' + contador);
                m = Math.pow(100, 1);
                r = bigint.rand(n);
                Cvote= ((g.powm(m,n2)).mul(r.powm(n,n2))).mod(n2);
                console.log('Cvote: ' + Cvote);
                var evote = new vote({
                    PID: 'prueba',
                    sign: 'prueba',
                    vote: Cvote,
                    digest: 'prueba'
                });
                console.log(evote);
                evote.save(function (err) {
                    if (!err) {
                        console.log('Voto guardado');
                    } else {
                        console.log('ERROR: ' + err);
                    }
                });
                console.log('voto guardado');
                console.log('---------');
            }
            for (i = 0; i < 1; i++) {

                contador++;
                console.log('voto numero: ' + contador);
                m = Math.pow(100, 5);
                r = bigint.rand(n);
                Cvote= ((g.powm(m,n2)).mul(r.powm(n,n2))).mod(n2);
                console.log('Cvote: ' + Cvote);
                var evote = new vote({
                    PID: 'prueba',
                    sign: 'prueba',
                    vote: Cvote,
                    digest: 'prueba'
                });
                console.log(evote);
                evote.save(function (err) {
                    if (!err) {
                        console.log('Voto guardado');
                    } else {
                        console.log('ERROR: ' + err);
                    }
                });
                console.log('voto guardado');
                console.log('---------');
            }
            for (i = 0; i < 1; i++) {

                contador++;
                console.log('voto numero: ' + contador);
                m = Math.pow(100, 4);
                r = bigint.rand(n);
                Cvote= ((g.powm(m,n2)).mul(r.powm(n,n2))).mod(n2);
                console.log('Cvote: ' + Cvote);
                var evote = new vote({
                    PID: 'prueba',
                    sign: 'prueba',
                    vote: Cvote,
                    digest: 'prueba'
                });
                console.log(evote);
                evote.save(function (err) {
                    if (!err) {
                        console.log('Voto guardado');
                    } else {
                        console.log('ERROR: ' + err);
                    }
                });
                console.log('voto guardado');
                console.log('---------');
            }
        });
        res.send("200:OK");
    }

    simul = function(req,res) {
        var User = require('../models/user/schema.js');
        var jwt = require('jwt-simple');
        var express = require('express');
        var appjwt = express();
        appjwt.set('jwtTokenSecret', 'FifaVoting');

        console.log('Iniciamos la simulación');
        console.log('Recibimos:');
        console.log('Username: ' +req.body.username);
        console.log('Password en claro: ' +req.body.password);
        console.log('Voto al candidato: ' +req.body.vote);

        hpass = require("crypto")

            .createHash("sha1")
            .update(req.body.password)
            .digest("hex");

        var user = new User({
            username:    req.body.username,
            password: 	 hpass
        });
        console.log('----');
        console.log('User: '+user.username+' Pass: '+user.password);

        var token = new String;

        console.log('Find one: ----------');
        User.findOne({ 'username': user.username }, function(err, userdb) {
            if (userdb != null) {
                console.log('User Found');
                console.log(userdb);
                console.log('----------- Password correct?: ----------');
                console.log('Password: '+user.password);
                console.log('Password DB: '+userdb.password);
                if (userdb.password === user.password) {
                    console.log('Password Correct');

                    if (userdb.signed == true) {
                        console.log('ERROR: User already logged - ');
                        res.json({
                            token: "ERROR",
                            expires: "User already logged"
                        });
                    }
                    if (userdb.signed != true) {
                        //Metodo generacion Token Token
                        var moment = require('moment');
                        var expires = moment().add(1, 'days').valueOf();
                        var token = jwt.encode(expires, appjwt.get('jwtTokenSecret'));

                        console.log('Usuario logueado: updating user - Signed = true');
                        userdb.signed = false;
                        userdb.save(function (err) {
                            if (!err) {
                                //console.log('Updated');
                            } else {
                                console.log('ERROR: ' + err);
                            }
                        });

                        console.log('Token Expires: ' + moment(expires).format('MMMM Do YYYY, h:mm:ss a'));

                        console.log('----------- Login Finalizado -----------');
                    }
                }
                else {
                    console.log('ERROR: Password Incorrect - ');
                    res.json({
                        token: "ERROR",
                        expires: "Password Incorrect"
                    });
                }
            }
            else {
                console.log('ERROR: User Not Found - ');
                res.json({
                    token : "ERROR",
                    expires: "User Not Found"
                });
            }
            console.log('----------- Generamos Claves para el cliente -----------');

            var keys = require('node-rsa');
            var paircliente = new keys({b: 1024})
            console.log('Claves Cliente:');
            console.log('e:'+ paircliente.keyPair.e);
            console.log('d:'+ paircliente.keyPair.d);
            console.log('n:'+ paircliente.keyPair.n);
            console.log('----------- FIN generación Claves para el cliente -----------');
            console.log('');
            console.log('----------- Generamos cegado -----------');
            var PID = paircliente.exportKey('pkcs8');
            console.log('PID sin cegar:'+ PID);
            precegado = require("crypto")

                .createHash("sha1")
                .update(PID)
                .digest("hex");
            precegado = bignum(precegado, 16);
            console.log('Hash PID:'+ precegado);

            App.findById('55672288b7d50fce1c000001', function (err, app) {
                if (!err) {
                    var keys = require('node-rsa');
                    var bignum = require('bignum');
                    var pairCA = new keys();

                    pairCA.importKey(app.privateKey);

                    var n = bignum(pairCA.keyPair.n, 10);
                    var e = bignum(pairCA.keyPair.e, 10);
                    var r = bignum.rand(pairCA.keyPair.n);
                    var r2 = r.powm(e, n);

                    console.log('-------------');
                    var cegado = (precegado.mul(r2)).mod(n);

                    console.log('PID cegado: ' + cegado);

                    console.log('----------- Fin cegado -----------');
                    console.log('');
                    console.log('----------- Firma ciega -----------');

                    var d = bignum(pairCA.keyPair.d, 10);

                    //COMPROBAR SI EL TOKEN ES VALIDO!
                    if (token) {
                        console.log('Miramos si el token es valido: Token: ' + token);
                        console.log('Decoding Token');
                        var decoded = jwt.decode(token, appjwt.get('jwtTokenSecret'));
                        var moment = require('moment');
                        console.log('Expires: ' + moment(decoded).format('MMMM Do YYYY, h:mm:ss a'));
                        console.log('Now: ' + moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'));
                        if (decoded <= Date.now()) {
                            console.log('Access token has expired');
                            res.send('Access token has expired', 400);
                        }
                        else {
                            console.log('Token Valido');
                            var signcegado = cegado.powm(d, n);
                            console.log('PID cegado firmado: ' + signcegado);
                        }

                        console.log('----------- Fin Firma ciega -----------');
                        console.log('');

                        console.log('----------- Descegado -----------');
                        var rinv = r.invertm(n);
                        var sign = (signcegado.mul(rinv)).mod(n);
                        console.log('sign: '+sign);
                        console.log('----------- Fin descegado -----------');
                        console.log('');

                        console.log('----------- Generación de Voto -----------');


                        table.findById('5567286436e9dadc1e000001', function (err, etable) {
                            var bigint = require('bignum');
                            var big= require('big-integer');
                            var contador=0;
                            var Cvote;
                            var ntabla=bigint(etable.n);
                            var n2 = ntabla.pow(2);
                            var g=bigint(etable.g);
                            var m;
                            var rvoto;
                            var candidatoparseado;
                            switch(req.body.vote){
                                case 'Messi':
                                    candidatoparseado=0;
                                    break;
                                case 'Suarez':
                                    candidatoparseado=1;
                                    break;
                                case 'Neymar':
                                    candidatoparseado=2;
                                    break;
                                case 'Xavi':
                                    candidatoparseado=3;
                                    break;
                                case 'Iniesta':
                                    candidatoparseado=4;
                                    break;
                                case 'Busquets':
                                    candidatoparseado=5;
                                    break;
                                case 'Alves':
                                    candidatoparseado=6;
                                    break;
                                case 'Pique':
                                    candidatoparseado=7;
                                    break;
                                case 'Mascherano':
                                    candidatoparseado=8;
                                    break;
                                case 'Alba':
                                    candidatoparseado=9;
                                    break;
                                /*case 'Bravo':
                                    candidatoparseado=10;
                                    break;*/
                                default:
                                    res.send("Jugador invalido, usa uno de los siguientes: ['Bravo','Alba','Mascherano','Pique','Alves','Busquets','Iniesta','Xavi','Neymar','Suarez','Messi']");
                                    break;
                            }

                            var candidato = candidatoparseado;
                            console.log('voto al candidato:'+candidato);

                            m= Math.pow(100,candidato);

                            console.log('m: '+ m.toString());
                            rvoto = bignum.rand(ntabla);
                            Cvote = ((g.powm(m,n2)).mul(rvoto.powm(ntabla,n2))).mod(n2);
                            console.log('Cvoto: '+Cvote);

                            console.log('----------- Fin generación del voto -----------');
                            console.log('');

                            console.log('----------- Generar Digest del Voto -----------');
                            var ncliente = bignum(paircliente.keyPair.n,10);
                            var dcliente = bignum(paircliente.keyPair.d,10);

                            predigest = require("crypto")

                                .createHash("sha1")
                                .update(Cvote.toString())
                                .digest("hex");
                            predigest = bignum(predigest, 16);

                            var digest = predigest.powm(dcliente,ncliente);

                            console.log('digest: '+digest);
                            console.log('----------- Fin generación del digest -----------');
                            console.log('');

                            console.log('----------- Vamos a mandar el voto -----------');
                            console.log('');
                            console.log('PID: ');
                            console.log(PID);
                            console.log('');
                            console.log('sign: '+ sign);
                            console.log('vote: '+ Cvote);
                            console.log('digest: '+ digest);

                            console.log('');

                            console.log('----------- Mesa comprueba el voto -----------');
                            var open = false;
                            table.findById('5567286436e9dadc1e000001', function (err, etable) {
                                console.log('Mesa:');
                                console.log(etable.open);
                                if (etable.open == true) {
                                    open = true;
                                }

                                console.log('Votación abierta: ' + open);
                                if (open == true) {
                                    console.log('mesa abierta, miramos si has votado');
                                    var evote = require('../models/vote/schema.js');

                                    evote.findOne({'PID': PID}, function (err, votedb) {
                                        console.log("Voto encontrado");
                                        console.log(votedb);
                                        if (votedb != null) {
                                            console.log('Ya has votado');
                                            res.send('400: Ya has votado');
                                        }
                                        else {
                                            console.log('Mesa abierta y no has votado');

                                            console.log('Decrypt sign + hash al PID:');

                                            var decryptSign = (big(sign).modPow(e, n));
                                            var hashPID = require("crypto")
                                                .createHash("sha1")
                                                .update(PID)
                                                .digest("hex");

                                            hashPID = big(hashPID, 16).toString();
                                            console.log('HashPID:');
                                            console.log(hashPID.toString());
                                            console.log('decrypt Sign:');
                                            console.log(decryptSign.toString());

                                            var paircompareclient = new keys();
                                            paircompareclient.importKey(PID);

                                            var PIDe = bignum(paircompareclient.keyPair.e, 10);
                                            var PIDn = bignum(paircompareclient.keyPair.n, 10);


                                            var decryptDigest = (bignum(digest).powm(PIDe, PIDn));

                                            var hashVote = require("crypto")
                                                .createHash("sha1")
                                                .update(Cvote.toString())
                                                .digest("hex");
                                            hashVote = bignum(hashVote, 16);

                                            console.log('HashVote:');
                                            console.log(hashVote.toString());
                                            console.log('decrypt digest:');
                                            console.log(decryptDigest.toString());

                                            console.log('------------------');
                                            if (hashPID.toString() === decryptSign.toString()) {

                                                if (hashVote.toString() === decryptDigest.toString()) {
                                                    console.log('Guardamos el voto');

                                                    var savedvote = new vote({
                                                        PID: PID,
                                                        sign: sign,
                                                        vote: Cvote,
                                                        digest: digest
                                                    });
                                                    console.log(savedvote);

                                                    savedvote.save(function (err) {
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
                                            else {
                                                console.log('401: Sign invalido.');
                                                res.send('401: Sign invalido.')

                                            }
                                        }
                                    });
                                }
                                else{
                                    console.log('Votación cerrada');
                                    res.send('Votación cerrada')

                                }
                            });
                    });
                    }

                }
            });

        });
    }

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

    app.get('/EU/Close',closeVote);
    app.get('/EU/results',getResults);
    //Op Aux
    app.get('/EU/aux',aux);
    app.get('/EU/Aux/CreateVotes', createVotes);

    //Simulación
    app.post('/Simulacion', simul);
};



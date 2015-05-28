module.exports = function(app) {

    var User = require('../models/user/schema.js');
    var App = require('../models/app/schema.js');
    var jwt = require('jwt-simple');
    var express = require('express');
    var appjwt = express();
    appjwt.set('jwtTokenSecret', 'FifaVoting');

    var big = require('big-integer');

    //GET - Return all users in the DB
    findAllUsers = function (req, res) {
        User.find(function (err, users) {
            if (!err) {
                console.log('GET /users')
                res.send(users);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    //POST - Insert a new User in the DB
    addUser = function(req, res) {
        console.log('POST');
        console.log(req.body);

        var user = new User({
            username:    req.body.username,
            password: 	 req.body.password
        });

        user.save(function(err) {
            if(!err) {
                console.log('Created');
            } else {
                console.log('ERROR: ' + err);
            }

            //pair.encryptPrivate(req.body.username, 'pkcs8')
        });

        res.send(user);
    }

        //POST - Insert a new User in the DB
        logUser = function(req, res) {
            console.log('/Login:');

            var user = new User({
                username:    req.body.username,
                password: 	 req.body.password
                //pair.encryptPrivate(req.body.username, 'pkcs8')
            });
            console.log('User: '+user.username+' Pass: '+user.password);
            var token = new String;


            User.findOne({ 'username': user.username }, function(err, userdb) {
                if (userdb != null) {
                    console.log('User Found');
                    console.log(userdb);
                    if(userdb.password === user.password){
                        console.log('Password Correct');
                        //Metodo generacion Token Token
                        var moment = require('moment');
                        var expires = moment().add(1,'days').valueOf();
                        var token = jwt.encode(expires,appjwt.get('jwtTokenSecret'));
                        console.log('Token Expires: '+moment(expires).format('MMMM Do YYYY, h:mm:ss a'));
                        res.json({
                            token : token,
                            expires: moment(jwt.decode(token, appjwt.get('jwtTokenSecret'))).format('MMMM Do YYYY, h:mm:ss a')
                        });

                    }
                    else{
                        console.log('ERROR: Password Incorrect - ');
                        res.json({
                            token : "ERROR",
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
                res.send('Token:'+token);
            });



    };

    //DELETE - Delete a TVShow with specified ID
    deleteUsers = function(req, res) {
        /*User.findById(req.params.id, function(err, user) {
            user.remove(function(err) {
                if(!err) {
                    console.log('Removed');
                    res.send("Deleted correctly");
                } else {
                    console.log('ERROR: ' + err);
                    res.send("Deleted correctly");
                }
            })
        });
        */
        var Db = require('mongodb').Db;
        var Server = require('mongodb').Server;
        var db = new Db('test', new Server('localhost', 27017));
// Establish connection to db
        db.open(function(err, db) {
            var usersdelete = db.collection("user");
            usersdelete.remove({},function(err,numberRemoved){
                console.log("inside remove call back" + numberRemoved);
            });
        });

        console.log("Deleted correctly");
        res.send("Deleted correctly");
    }


    //PUT - Update a register already exists
    updateUser = function(req, res) {
        User.findById(req.params.id, function(err, user) {
            user.username   = req.body.username;
            user.password    = req.body.password;


            user.save(function(err) {
                if(!err) {
                    console.log('Updated');
                } else {
                    console.log('ERROR: ' + err);
                }
                res.send(user);
            });
        });
    }

    getModulus = function(req,res){
        App.findById('55672288b7d50fce1c000001', function (err, app) {
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

    getExponent = function(req,res){
        App.findById('55672288b7d50fce1c000001', function (err, app) {
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
    };

    signCA = function(req,res){

        //Comprobar Token
        var token = (req.body.token);
        var PID = (req.body.PID);
        console.log('Checking Token');
        if (token) {
            console.log('Token: ' + req.body.token);
            console.log('Decoding Token');
            var decoded = jwt.decode(token, appjwt.get('jwtTokenSecret'));
            var moment = require('moment');
            console.log('Expires: ' + moment(decoded).format('MMMM Do YYYY, h:mm:ss a'));
            console.log('Now: ' + moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'));
            if (decoded <= Date.now()) {
                console.log('Access token has expired');
                res.end('Access token has expired', 400);
            }
            else {


                App.findById('55672288b7d50fce1c000001', function (err, app) {
                    if (!err) {
                        var keys = require('node-rsa');
                        var pair = new keys();
                        console.log('GET PRIVATE KEY');
                        pair.importKey(app.privateKey);
                        console.log('A firmar');
                        console.log(PID.toString());
                        console.log('Firmando');
                        var sign = big(PID).modPow(pair.keyPair.d, pair.keyPair.n).toString();
                        console.log(sign);
                        res.send(sign);
                        console.log('firmado');
                        console.log('-----------');
                    } else {
                        console.log('ERROR: ' + err);
                    }

                });
            }
        }
    };

    app.get('/CA/users', findAllUsers);
    app.post('/CA/user/Register',addUser);
    app.post('/CA/user/Login',logUser);
    app.delete('/CA/users', deleteUsers);
    app.put('/CA/user/:id', updateUser);
    app.get('/CA/getModulus',getModulus);
    app.get('/CA/getExponent',getExponent);
    app.post('/CA/signCA', signCA);
}
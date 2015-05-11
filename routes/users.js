module.exports = function(app) {

    var User = require('../models/user/schema.js');
    var App = require('../models/app/schema.js');
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

        var keys = require('node-rsa');
        var pair = new keys();

        App.findById('55080390e5f4114c13000001', function (err, app) {
            if (!err) {
                console.log('GET PRIVATE KEY');
                pair.importKey(app.privateKey);
                console.log('Public Key:' + pair.exportKey('pkcs8'));
                } else {
                console.log('ERROR: ' + err);
            }
      });

        var user = new User({
            username:    req.body.username,
            age: 	 req.body.age,
            sign: ''
            //pair.encryptPrivate(req.body.username, 'pkcs8')
        });

        user.save(function(err) {
            if(!err) {
                console.log('Created');
            } else {
                console.log('ERROR: ' + err);
            }
        });

        res.send(user);
    };

//DELETE - Delete a TVShow with specified ID
    deleteUser = function(req, res) {
        User.findById(req.params.id, function(err, user) {
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
    }


    //PUT - Update a register already exists
    updateUser = function(req, res) {
        User.findById(req.params.id, function(err, user) {
            user.username   = req.body.username;
            user.age    = req.body.age;
            user.sign= req.body.sign;

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
    app.get('/users', findAllUsers);
    app.post('/user',addUser);
    app.delete('/user/:id', deleteUser);
    app.put('/user/:id', updateUser);

}
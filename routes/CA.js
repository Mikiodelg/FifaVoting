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


            User.find({username:"Isra"}, function(err, userdb) {
                if (!err) {
                    console.log('User Found');
                    console.log('Username: '+userdb.username);
                    console.log('Password: '+userdb.password);
                    if(userdb.password === user.password){
                        console.log('Password Correct');
                        //Metodo generacion Token Token
                        token='Token Generado';
                    }
                    else{
                        console.log('ERROR: Password Incorrect - '+err);
                    }
                }
                else {
                    console.log('ERROR: User Not Found - '+err);
                    }
            });


        res.send(token);
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
    app.get('/CA/users', findAllUsers);
    app.post('/CA/user/Register',addUser);
    app.post('/CA/user/Login',logUser);
    app.delete('/CA/user/:id', deleteUser);
    app.put('/CA/user/:id', updateUser);
    //app.post('/CA/signCA', signCA);
}
var mongoose = require('mongoose');
var express = require('express');
var userRouter = express.Router();
var userModel = mongoose.model('user')
var responseGenerator = require('../../lib/responseGenerator');
var auth = require("../../middlewares/auth");

module.exports.controller = function (app) {

    userRouter.get('/', function (req, res) {
        res.render('index');
    });

    userRouter.get('/login/screen', function (req, res) {
        res.render('login');
    });
    //end get login screen

    userRouter.get('/signup/screen', function (req, res) {

        res.render('signup');

    }); //end get signup screen

    userRouter.get('/forgotpassword/screen', function (req, res) {

        res.render('forgotpassword');

    }); //end get signup screen

    userRouter.get('/dashboard', auth.isLoggedIn, function (req, res) {

        res.render('dashboard', {
            user: req.session.user
        });


    }); //end get dashboard

    
    userRouter.get('/logout', function (req, res) {

        req.session.destroy(function (err) {

            res.redirect('/users/login/screen');

        })

    }); //end logout

    
    userRouter.post('/signup', function (req, res) {

        if (req.body.firstName != undefined && req.body.lastName != undefined && req.body.email != undefined && req.body.password != undefined) {

            var newUser = new userModel({
                userName: req.body.firstName + '' + req.body.lastName + Math.floor(Math.random() * 100 + 1),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.emailId,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password


            }); // end new user 

            console.log(req.body.firstName + '' + req.body.lastName + Math.floor(Math.random() * 100 + 1));


            newUser.save(function (err) {
                if (err) {
                    console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "some error " + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });

                } else {

                    req.session.user = newUser;
                    console.log(req.session);
                    delete req.session.user.password;
                    res.redirect('/users/dashboard');
                    //res.redirect('/')
                }

            }); //end new user save


        } else {

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

            //res.send(myResponse);

            res.render('error', {
                message: myResponse.message,
                error: myResponse.data
            });

        }


    }); //end get all users



    userRouter.post('/login', function (req, res) {

        userModel.findOne({
            $and: [{
                'email': req.body.emailId
            }, {
                'password': req.body.password
            }]
        }, function (err, foundUser) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundUser == null || foundUser == undefined || foundUser.userName == undefined) {

                var myResponse = responseGenerator.generate(true, "user not found. Check your email and password", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {


                console.log(req.session);
                req.session.user = foundUser;
                delete req.session.user.password;
                res.redirect('/users/dashboard')

            }

        }); // end find

    }); //end get signup screen

    //forgot password module
    userRouter.post('/forgotpassword', function (req, res) {

        userModel.findOne({
            'email': req.body.emailId
        }, function (err, foundUser) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundUser == null || foundUser == undefined || foundUser.userName == undefined) {

                var myResponse = responseGenerator.generate(true, "user not found. Check your email and password", 404, null);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {


                console.log(req.session);
                req.session.user = foundUser;
                res.render('lostpassword', {
                    password: req.session.user.password
                });


            }

        }); // end find

    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (err.status == 404) {
            res.render('404', {
                message: err.message,
                error: err
            });
        } else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });

    app.use('/users', userRouter);

} 


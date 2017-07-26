const express = require('express');
const passport = require('passport');

module.exports = (app, controllers) => {
    const router = new express.Router();
    const controller = controllers.user;
    const authPaths = ['/myProfile', '/updateProfile', '/logout', '/myCart'];

    router
        .get('/signup', (req, res) => {
            return controller.getSignUpForm(req, res);
        })
        .get('/login', (req, res) => {
            return controller.getLogInForm(req, res);
        })
        .post('/signup', (req, res) => {
            return controller.registerNewUser(req, res);
        })
        .post('/login',
            passport.authenticate('local', {
                successRedirect: '/auth/myProfile',
                failureRedirect: '/auth/signup',
                failureFlash: true,
            })
        )
        .all(authPaths, (req, res, next) => {
            if (!req.user) {
                res.redirect('/');
                return;
            }
            next();
        })
        .get('/myProfile', (req, res) => {
            return controller.getProfile(req, res);
        })
        .get('/updateProfile', (req, res) => {
            return controller.getUpdateProfile(req, res);
        })
        .get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        })
        .get('/myCart', (req, res) => {
            return controller.getMyCart(req, res);
        });

    app.use('/auth', router);
    // app.use('/', router);

    return router;
};
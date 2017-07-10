const express = require('express');

module.exports = (app, controllers) => {
    let router = new express.Router();
    let controller = controllers.home;

    router
        .get('/', controller.loadHome)
        .get('/home', controller.loadHome);

    app.use('/', router);

    return router;
};
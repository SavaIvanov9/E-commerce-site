const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

module.exports = (config, constants, errorHandler, componentLoader) => {
    const app = express();

    process.env.ENV_MODE = config.Environment;

    if (process.env.ENV_MODE === 'PRODUCTION') {
        app.use('/static', express.static('build'));
    } else {
        app.use('/static', express.static('public'));
    }

    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(
        session({
            secret: 'ebikes',
            resave: true,
            saveUninitialized: true
        })
    );

    const contexts = componentLoader.initializeContexts();
    const unitOfWork = componentLoader.initializeRepositories(contexts, constants, errorHandler);
    //app.use(flash())
    require('./modules/authentication-module')(app, unitOfWork, errorHandler);

    app.use((req, res, next) => {
        res.locals.user = req.user; // for pug calling only user
        res.locals.authenticated = req.isAuthenticated();
        // console.log(req.isAuthenticated());
        next();
    });

    app.set('view engine', 'pug');
    app.set('views', './src/views');

    const controllers = componentLoader.initializeControllers(unitOfWork);
    componentLoader.initializeRoutes(app, controllers);

    errorHandler.handleErrors(app);

    return app;
};
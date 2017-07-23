const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const async = () => {
    return Promise.resolve();
};

module.exports = {
    init(config, constants, errorHandler, componentLoader) {
        return new Promise((resolve, reject) => {
            const app = express();

            async()
            .then(() => {
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
                    app.use(require('connect-flash')());
                    app.use(bodyParser.json());
                    app.use(cookieParser());
                    app.use(
                        session({
                            secret: 'ebikes',
                            resave: true,
                            saveUninitialized: true
                        })
                    );
                })
                .then(() => componentLoader.initializeContexts(constants))
                .then((contexts) => contexts.mongo.init(constants.DB_URL))
                .then((context) => {
                    let factories = componentLoader.initializeFactories(constants);
                    let unitOfWork = componentLoader.initializeRepositories(context,
                        constants,
                        factories.dataModels,
                        errorHandler);

                    return unitOfWork;
                })
                .then((unitOfWork) => {
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

                    //errorHandler.handleErrors(app);

                    resolve(app);
                });
        });
    }
};
const fs = require('fs');
const path = require('path');

module.exports = {
    initializeRoutes(app, controllers) {
        fs.readdirSync('./src/routes')
            .filter((x) => x.includes('-router'))
            .forEach((file) => {
                //  console.log('Loading router:', '../../routes/' + file);

                require(path.join('../../routes/', file))(app, controllers);
            });

        //  console.log('All routers loaded.');
        //  console.log();
    },
    initializeControllers(data, factories, constants, errorHandler) {
        const controllers = {};

        fs.readdirSync('./src/controllers')
            .filter((x) => x.includes('-controller'))
            .forEach((file) => {
                const controllerModule = require(path
                    .join('../../controllers/', file))(data,
                    factories,
                    constants,
                    errorHandler);
                // console.log('Loading controller:', 
                //  '../../controllers/' + file);
                controllers[file
                    .substring(0, file.indexOf('-'))] = controllerModule;
            });

        //  console.log('All controllers loaded.');
        //  console.log();

        return controllers;
    },
    initializeRepositories(context, constants, factory, errorHandler) {
        const repositories = {};

        fs.readdirSync('./src/data/repositories')
            .filter((x) => x.includes('-repository'))
            .forEach((file) => {
                const Repoitory = require(path
                    .join('../../data/repositories', file));

                const repositoryModule = new Repoitory(context,
                    constants,
                    factory,
                    errorHandler);
                //  console.log('Loading repository:', 
                // '../../data/repositories/' + file);

                repositories[file
                    .substring(0, file.indexOf('-'))] = repositoryModule;
            });

        //  console.log('All repositories loaded.');
        //  console.log();

        return repositories;
    },
    initializeContexts(constants) {
        const contexts = {};

        fs.readdirSync('./src/data/dbContexts')
            .filter((x) => x.includes('-dbContext'))
            .forEach((file) => {
                const contextModule = require(path
                    .join('../../data/dbContexts', file));
                //  console.log('Loading context:',
                // '../../data/dbContexts/' + file);

                contexts[file.substring(0, file.indexOf('-'))] = contextModule;
            });

        //  console.log("All contexts loaded.");
        //  console.log();

        return contexts;
    },
    initializeFactories(constants) {
        const factories = {};

        fs.readdirSync('./src/factories')
            .filter((x) => x.includes('-factory'))
            .forEach((file) => {
                const factoryModule = require(path
                    .join('../../factories/', file));
                //  console.log('Loading context:', 
                //  '../../data/dbContexts/' + file);

                factories[file.substring(0, file.indexOf('-'))] = factoryModule;
            });

        //  console.log("All factories loaded.");
        //  console.log();

        return factories;
    },
}; // eslint-disable-line
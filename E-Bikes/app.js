const constants = require('./src/common/constants');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./configuration/config.json', 'utf8'));
const componentLoader = require('./src/core/componentLoader');
const errorHandler = require('./src/core/errorHandler');
const socket = require('socket.io');

const app = require('./src/core/engine')(config,
    constants,
    errorHandler,
    componentLoader);

const server = app.listen(constants.APP_PORT, () => {
    console.log('----|  Startup log  |----');
    console.log(`   >Started on: ${new Date().toLocaleTimeString()}`);
    console.log(`   >Environment: ${process.env.ENV_MODE}`);
    console.log(`   >App running at port: ${constants.APP_PORT}`);
});

// Socket setup
let io = socket(server);

io.on('connection', (socket) => {
    console.log('Websocket connection has been made', socket.id);

    // Handle chat event
    socket.on('chat', (data) => {
        console.log('Test na SOCKET.On');
        io.sockets.emit('chat', data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
});
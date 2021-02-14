const mongoose = require('mongoose');
const httpServer = require('http').createServer;
const socketIo = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const socketHandler = require('./services/socket.service');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = httpServer(app);
  const options = {
    cors: true,
    origins: ['http://localhost:3000', 'http://localhost:8080', 'https://twitter-rp.herokuapp.com'],
    credentials: true,
  };
  socketHandler(socketIo(server, options));

  server.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

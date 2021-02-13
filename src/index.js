const mongoose = require('mongoose');
const httpServer = require('http').createServer;
const socketIo = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const socketHandler = require('./services/socket.service');

const server = httpServer(app);
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  const options = {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? 'https://twitter-rp.herokuapp.com' : 'http://localhost:3000',
      credentials: true,
    },
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

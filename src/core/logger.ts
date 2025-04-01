import pino from 'pino';
import config from '../config';

// Configure Pino logger
const logger = pino({
  level: config.nodeEnv === 'production' ? 'info' : 'debug', // Log level based on environment
  transport: config.nodeEnv !== 'production' ? {
    target: 'pino-pretty', // Use pino-pretty for development logs
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined, // Use default JSON output in production
});

// Install pino-pretty as a dev dependency if you want pretty logs locally:
// npm install -D pino-pretty

export default logger; 
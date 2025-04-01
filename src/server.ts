import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet'; // Import helmet
import pinoHttp from 'pino-http'; // Import pino-http
import rateLimit from 'express-rate-limit'; // Import rate-limit
import logger from './core/logger'; // Import the logger instance
import config from './config'; // Import config to potentially use PORT
import chatRoutes from './modules/chat/chat.routes'; // Import chat routes

// Define a custom error type if needed, or extend Error
interface AppError extends Error {
  statusCode?: number;
}

// Load environment variables
dotenv.config();

const app: Express = express();
// Use port from config
const port = config.port;

// Middlewares
app.use(pinoHttp({ logger })); // Use pino-http for request logging
app.use(helmet()); // Apply security headers
app.use(express.json()); // Parse JSON bodies

// Rate Limiting (apply before routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    logger.warn({ ip: req.ip }, `Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});
app.use('/api', apiLimiter); // Apply the limiter to all /api routes

// Basic Ping Route (for health checks)
app.get('/ping', (req: Request, res: Response) => {
  res.status(200).send('pong');
});

// Mount module routes
app.use('/api/chat', chatRoutes); // Mount chat routes under /api/chat

// Centralized Error Handling Middleware
// This should be the LAST middleware added
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  // Use request logger if available, otherwise use the base logger
  const reqLogger = (req as any).log || logger;
  reqLogger.error({ err }, '[Error Handler]'); // Log the error object

  // Avoid sending stack traces in production
  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' && statusCode === 500
    ? 'Internal Server Error'
    : err.message;
  res.status(statusCode).json({ error: message });
});

// Start the server
const server = app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    // Add any other cleanup logic here (e.g., close database connections)
    process.exit(0);
  });

  // Force shutdown after a timeout if server.close() doesn't finish
  setTimeout(() => {
    logger.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app; // Export for potential testing 
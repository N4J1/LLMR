import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import logger from '../core/logger';

/**
 * Creates an Express middleware function to validate the request body against a Zod schema.
 *
 * @param schema The Zod schema to validate against.
 * @returns An Express middleware function.
 */
export const validateRequest = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const reqLogger = (req as any).log || logger;
    try {
      // Validate the request body
      await schema.parseAsync(req.body);
      reqLogger.debug('Request body validation successful');
      // If validation succeeds, proceed to the next middleware/handler
      next();
    } catch (error) {
      reqLogger.warn({ err: error }, 'Request body validation failed');
      if (error instanceof ZodError) {
        // Format Zod errors for a user-friendly response
        const formattedErrors = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        // Send a 400 Bad Request response with validation details
        res.status(400).json({ error: 'Validation failed', details: formattedErrors });
      } else {
        // Pass other unexpected errors to the centralized error handler
        next(error);
      }
    }
  }; 
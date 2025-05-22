import { Router } from 'express';
import openRouterController from './openrouter.controller';

// Create a new Express Router instance
const router = Router();

// Define a GET route for listing free models
// This route will be handled by the listFreeModels method of the openRouterController
router.get('/free-models', (req, res) => openRouterController.listFreeModels(req, res));

// Export the router instance as the default export
export default router;

import { Router } from 'express';
import { ChatController } from './chat.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { chatRequestSchema } from './chat.types';

const router = Router();
const chatController = new ChatController();

// Define the route for chat requests
// POST /api/chat (assuming we mount this router under /api)
router.post('/', validateRequest(chatRequestSchema), chatController.handleChatRequest);

// You could add other chat-related routes here (e.g., fetching history)

export default router; 
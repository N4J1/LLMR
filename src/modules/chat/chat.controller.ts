import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { ChatRequestBody } from './chat.types';
import logger from '../../core/logger';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
    this.handleChatRequest = this.handleChatRequest.bind(this);
  }

  async handleChatRequest(req: Request<{}, {}, ChatRequestBody>, res: Response, next: NextFunction): Promise<void> {
    const reqLogger = (req as any).log || logger;
    const requestBody = req.body;

    reqLogger.info('Processing chat request after validation');
    try {
      const response = await this.chatService.handleChat(requestBody);
      reqLogger.info('Chat request successful');
      res.status(200).json(response);
    } catch (error) {
      reqLogger.error({ err: error }, 'Chat request failed in controller');
      next(error);
    }
  }
}

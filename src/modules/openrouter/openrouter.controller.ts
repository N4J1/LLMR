import { OpenRouterService } from './openrouter.service';
import { Request, Response } from 'express'; // Using Express types

export class OpenRouterController {
  private openRouterService: OpenRouterService;

  constructor() {
    this.openRouterService = new OpenRouterService();
  }

  /**
   * Handles the request to list free models from OpenRouter.
   * @param req Express Request object
   * @param res Express Response object
   */
  public async listFreeModels(req: Request, res: Response): Promise<void> {
    try {
      const freeModels = await this.openRouterService.getFreeModels();
      res.status(200).json(freeModels);
    } catch (error) {
      console.error('Error in listFreeModels controller:', error);
      res.status(500).json({ error: "Failed to fetch free models" });
    }
  }
}

// Export an instance of the controller for easier use in routing
export default new OpenRouterController();

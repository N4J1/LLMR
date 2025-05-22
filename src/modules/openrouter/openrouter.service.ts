import axios from 'axios';

// Interface for the pricing object within a model
interface ModelPricing {
  prompt: string | number;
  completion: string | number;
  request: string | number;
}

// Interface for the model object received from the API
interface OpenRouterModel {
  id: string;
  name: string;
  pricing: ModelPricing;
}

// Interface for the response from the OpenRouter API
interface OpenRouterResponse {
  data: OpenRouterModel[];
}

// Interface for the simplified model data returned by getFreeModels
interface FreeModel {
  id: string;
  name: string;
}

export class OpenRouterService {
  /**
   * Fetches the list of models from the OpenRouter API and filters for free models.
   * A model is considered free if its ID ends with ":free" or if its pricing
   * for prompt, completion, and request are all "0" or 0.
   * @returns A Promise resolving to an array of free models, each with id and name.
   */
  public async getFreeModels(): Promise<FreeModel[]> {
    try {
      const response = await axios.get<OpenRouterResponse>('https://openrouter.ai/api/v1/models');

      if (response.status !== 200) {
        console.error(`Error fetching models from OpenRouter: Status ${response.status}`);
        return []; // Or throw an error as per requirements, returning empty array for now
      }

      const models = response.data.data;

      const freeModels = models.filter(model => {
        // Check if the model ID ends with ":free"
        if (model.id.endsWith(':free')) {
          return true;
        }

        // Check if pricing information indicates it's a free model
        if (model.pricing) {
          const { prompt, completion, request } = model.pricing;
          const isFreePrice = (price: string | number | undefined) => price === "0" || price === 0;

          if (isFreePrice(prompt) && isFreePrice(completion) && isFreePrice(request)) {
            return true;
          }
        }
        return false;
      });

      // Map to the desired return format
      return freeModels.map(model => ({
        id: model.id,
        name: model.name,
      }));

    } catch (error) {
      console.error('Failed to fetch or process models from OpenRouter:', error);
      // Depending on requirements, could throw the error or return empty array
      // throw error; 
      return [];
    }
  }
}

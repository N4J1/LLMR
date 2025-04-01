import OpenAI from 'openai';
import config from '../../config';
import logger from '../../core/logger';
import { ChatRequestBody, ChatResponse } from './chat.types';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Configure the OpenAI SDK to use OpenRouter
const openai = new OpenAI({
  baseURL: config.openRouter.baseURL,
  apiKey: config.openRouter.apiKey,
  // Optional: Set default headers, timeout, etc.
  // defaultHeaders: {
  //   "HTTP-Referer": YOUR_SITE_URL, // Optional, for OpenRouter identification
  //   "X-Title": YOUR_SITE_NAME, // Optional, for OpenRouter identification
  // }
});

/**
 * Service to handle chat logic, primarily interacting with the AI model.
 */
export class ChatService {
  /**
   * Sends a chat request to the OpenRouter API using the model specified in the request.
   *
   * @param requestBody - The validated request body containing messages and the required model.
   * @returns A promise resolving to the chat response.
   */
  async handleChat(requestBody: ChatRequestBody): Promise<ChatResponse> {
    const { messages, model, stream } = requestBody;
    const modelToUse = model;

    if (stream) {
      logger.warn('Streaming responses are requested but not implemented in this service.');
    }

    try {
      logger.info({ model: modelToUse, messageCount: messages.length }, 'Sending chat request to OpenRouter');
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: messages as ChatCompletionMessageParam[],
        stream: false,
        // Add other validated parameters here if needed (e.g., temperature)
      });

      const reply = completion.choices[0]?.message?.content;
      logger.info({ model: modelToUse, replyLength: reply?.length ?? 0 }, 'Received reply from OpenRouter');

      return {
        reply: reply || null,
      };
    } catch (error) {
      logger.error({ err: error, model: modelToUse }, 'Error calling OpenRouter API');
      if (error instanceof OpenAI.APIError) {
        const appError = new Error(`OpenRouter API Error (${error.status}): ${error.message}`) as any;
        appError.statusCode = error.status || 500;
        throw appError;
      } else {
        const appError = new Error('Failed to get response from AI model.') as any;
        appError.statusCode = 502;
        throw appError;
      }
    }
  }
} 
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { z } from 'zod';

// --- Allowed Models ---
// Define the list of models users can choose from.
// Keep this updated with the models you want to support.
export const ALLOWED_MODELS = [
  'mistralai/mistral-7b-instruct:free',
  'deepseek/deepseek-v3-base:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'deepseek/deepseek-r1:free',
  'google/gemini-2.5-pro-exp-03-25:free',
  'qwen/qwq-32b:free',
  'qwen/qwen2.5-vl-32b-instruct:free',


  // Add more models here as needed
] as const; // Use 'as const' for a tuple type

// Create a Zod enum from the allowed models array
const allowedModelsEnum = z.enum(ALLOWED_MODELS);

// Zod schema for message validation
const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  // Add other potential fields if needed (e.g., name)
}).strict(); // Disallow extra fields in messages

// Zod schema for the request body validation
export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1, { message: 'Messages array cannot be empty' }),
  // Model is now required and must be one of the allowed models
  model: allowedModelsEnum,
  stream: z.boolean().optional(),
  // Add other optional parameters with their types here
  // temperature: z.number().min(0).max(2).optional(),
  // max_tokens: z.number().int().positive().optional(),
}).strict(); // Disallow extra fields in the main request body

// Infer the TypeScript type from the Zod schema
export type ChatRequestBody = z.infer<typeof chatRequestSchema>;

// Define a basic structure for the response
export interface ChatResponse {
  reply: string | null; // The assistant's reply message content
  // You might want to include more details like finish reason, usage tokens, etc.
} 
import { z } from 'zod';

// --- Allowed Models ---
// Define the list of models users can choose from.
// Keep this updated with the models you want to support.
export const ALLOWED_MODELS = [
  "mistralai/devstral-small:free",
  "google/gemma-3n-e4b-it:free",
  "meta-llama/llama-3.3-8b-instruct:free",
  "nousresearch/deephermes-3-mistral-24b-preview:free",
  "microsoft/phi-4-reasoning-plus:free",
  "microsoft/phi-4-reasoning:free",
  "qwen/qwen3-4b:free",
  "opengvlab/internvl3-14b:free",
  "opengvlab/internvl3-2b:free",
  "deepseek/deepseek-prover-v2:free",
  "qwen/qwen3-30b-a3b:free",
  "qwen/qwen3-8b:free",
  "qwen/qwen3-14b:free",
  "qwen/qwen3-32b:free",
  "qwen/qwen3-235b-a22b:free",
  "tngtech/deepseek-r1t-chimera:free",
  "thudm/glm-z1-9b:free",
  "thudm/glm-4-9b:free",
  "microsoft/mai-ds-r1:free",
  "thudm/glm-z1-32b:free",
  "thudm/glm-4-32b:free",
  "shisa-ai/shisa-v2-llama3.3-70b:free",
  "arliai/qwq-32b-arliai-rpr-v1:free",
  "agentica-org/deepcoder-14b-preview:free",
  "moonshotai/kimi-vl-a3b-thinking:free",
  "nvidia/llama-3.3-nemotron-super-49b-v1:free",
  "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
  "meta-llama/llama-4-maverick:free",
  "meta-llama/llama-4-scout:free",
  "deepseek/deepseek-v3-base:free",
  "qwen/qwen2.5-vl-3b-instruct:free",
  "google/gemini-2.5-pro-exp-03-25",
  "qwen/qwen2.5-vl-32b-instruct:free",
  "deepseek/deepseek-chat-v3-0324:free",
  "featherless/qwerky-72b:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "open-r1/olympiccoder-32b:free",
  "google/gemma-3-1b-it:free",
  "google/gemma-3-4b-it:free",
  "google/gemma-3-12b-it:free",
  "rekaai/reka-flash-3:free",
  "google/gemma-3-27b-it:free",
  "deepseek/deepseek-r1-zero:free",
  "qwen/qwq-32b:free",
  "moonshotai/moonlight-16b-a3b-instruct:free",
  "nousresearch/deephermes-3-llama-3-8b-preview:free",
  "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
  "cognitivecomputations/dolphin3.0-mistral-24b:free",
  "qwen/qwen2.5-vl-72b-instruct:free",
  "mistralai/mistral-small-24b-instruct-2501:free",
  "deepseek/deepseek-r1-distill-qwen-32b:free",
  "deepseek/deepseek-r1-distill-qwen-14b:free",
  "deepseek/deepseek-r1-distill-llama-70b:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.2-1b-instruct:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "qwen/qwen-2.5-vl-7b-instruct:free",
  "meta-llama/llama-3.1-405b:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-nemo:free",
  "google/gemma-2-9b-it:free",
  "mistralai/mistral-7b-instruct:free"
] as const; // Use 'as const' for a tuple type

// Create a Zod enum from the allowed models array
const allowedModelsEnum = z.enum(ALLOWED_MODELS);

// Schema for the image_url field
const imageUrlSchema = z.object({
  url: z.string().url().or(z.string().startsWith('data:image/')),
}).strict();

// Schema for content parts (text or image)
const contentPartSchema = z.union([
  z.object({ 
    type: z.literal('text'), 
    text: z.string() 
  }).strict(),
  z.object({ 
    type: z.literal('image_url'), 
    image_url: imageUrlSchema // image_url is an object with a url field
  }).strict(),
]);

// Zod schema for message validation
const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  // content can be a string or an array of parts
  content: z.union([
    z.string(),
    z.array(contentPartSchema).min(1),
  ]),
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
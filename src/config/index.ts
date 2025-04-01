import dotenv from 'dotenv';

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '3000',
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
  },
};

if (!config.openRouter.apiKey) {
}

export default config; 
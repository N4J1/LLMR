# Express TypeScript Backend Architecture

## Goal
Build a scalable and maintainable Express.js backend using TypeScript to handle requests from various clients (Discord, Telegram, Web Frontend, etc.), interact with OpenRouter via the OpenAI SDK, and be deployable on Heroku.

## Core Principles
-   **Layered Architecture:** Separate concerns into distinct layers (Routes, Controllers, Services, Config).
-   **Modular Design:** Group code by feature/domain within a `modules` directory.
-   **Dependency Injection:** (Optional but recommended for testability) Inject dependencies (like services) into controllers.
-   **Configuration Management:** Use environment variables (`.env` locally, Heroku Config Vars in production).
-   **TypeScript:** Leverage static typing for robustness.

## Directory Structure (`src/`)
src/
├── config/ # Environment variables, external service configs (OpenRouter API Key/Base URL)
├── core/ # Shared utilities, base classes, common interfaces (e.g., API response structure)
├── middlewares/ # Express middlewares (auth, logging, error handling)
├── modules/ # Feature-specific code
│ └── chat/ # Example module
│ ├── chat.controller.ts
│ ├── chat.service.ts
│ ├── chat.routes.ts
│ └── chat.types.ts
├── types/ # Global TypeScript definitions
└── server.ts # Express app setup, middleware registration, route mounting, server start

## Key Technologies & Dependencies
-   Node.js
-   Express.js (`express`)
-   TypeScript (`typescript`, `@types/node`, `@types/express`)
-   Environment variables (`dotenv`)
-   OpenAI SDK (`openai`)

## Request Flow
1.  Client Request hits an endpoint defined in a module's `routes.ts`.
2.  Route maps the request to a specific method in the module's `controller.ts`.
3.  Controller validates input (using middleware or validation library), calls the appropriate `service.ts` method.
4.  Service contains business logic, interacts with external APIs (like OpenRouter using the configured OpenAI SDK client), or other services.
5.  Service returns data/results to the Controller.
6.  Controller formats the response and sends it back to the client.

## Implementation Details
-   **OpenRouter:** Configure the OpenAI SDK instance (likely in `config/` or a dedicated setup file) to use the OpenRouter base URL (`https://openrouter.ai/api/v1`) and your OpenRouter API key (from environment variables). Inject or import this configured client into services that need it.
-   **Error Handling:** Implement centralized error handling middleware.
-   **Client Diversity:** Design services to return generic data structures. Controllers can adapt data slightly if needed per client type, but aim for minimal client-specific logic in the backend.
-   **Typing:** Define clear interfaces/types for request bodies, responses, and service layer data structures.

## Deployment (Heroku)
-   **`Procfile`:** Define the command to start the application (e.g., `web: node dist/server.js`).
-   **Build Script:** Add a `build` script to `package.json` (e.g., `tsc`). Heroku typically runs this.
-   **Start Script:** Add a `start` script to `package.json` (e.g., `node dist/server.js`).
-   **Configuration:** Set environment variables (like `NODE_ENV=production`, `OPENROUTER_API_KEY`, etc.) in Heroku Config Vars.
-   **`PORT`:** Bind the Express server to `process.env.PORT`.

## Next Steps (for AI Agent)
1.  Initialize project (`npm init -y`, `tsc --init`).
2.  Install dependencies (`npm install express dotenv openai`, `npm install -D typescript @types/node @types/express`).
3.  Create the directory structure as outlined above.
4.  Implement `server.ts` with basic Express setup.
5.  Implement configuration loading (`config/`).
6.  Create a sample module (e.g., `ping` or `chat`) following the structure.
7.  Configure OpenAI SDK for OpenRouter usage.
8.  Set up build and start scripts in `package.json`.
9.  Create `Procfile`.

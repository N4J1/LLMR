import { OpenRouterService } from '../src/modules/openrouter/openrouter.service';

/**
 * This script fetches free models from the OpenRouter API using the OpenRouterService,
 * extracts their IDs, and prints them as a string formatted as a TypeScript array of strings.
 */
async function main() {
  const openRouterService = new OpenRouterService();

  try {
    const freeModels = await openRouterService.getFreeModels(); // This already returns { id: string, name: string }[]

    // Extract only the IDs
    const freeModelIds = freeModels.map(model => model.id);

    // Format the array as a TypeScript constant string
    let outputString = '[\n';
    freeModelIds.forEach((id, index) => {
      outputString += `  "${id}"`;
      if (index < freeModelIds.length - 1) {
        outputString += ',\n';
      } else {
        outputString += '\n';
      }
    });
    outputString += ']';

    // Output the formatted string
    // Using process.stdout.write to avoid any extra newlines from console.log
    process.stdout.write(outputString);

  } catch (error) {
    // In case of an error, print an empty TypeScript array string to stdout.
    // Log the actual error to stderr so it doesn't interfere with the stdout output.
    console.error('Error fetching or processing free models:', error);
    process.stdout.write('[]');
  }
}

// Execute the main function
main();

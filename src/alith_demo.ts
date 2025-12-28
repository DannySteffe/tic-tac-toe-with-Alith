import { Agent } from "alith";

async function runDemo() {
    try {
        // Example 1: Using OpenAI (Default)
        // const agent = new Agent({
        //   model: "gpt-4",
        //   preamble: "You are a comedian...",
        //   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        // });

        // Example 2: Using Grok (xAI)
        // Grok is OpenAI-compatible. We point the baseURL to xAI's API.
        const grokAgent = new Agent({
            model: "grok-2-1212", // Latest stable model
            preamble: "You are a helpful AI assistant powered by Grok.",
            apiKey: import.meta.env.VITE_GROK_API_KEY,
            baseURL: "https://api.x.ai/v1", // Standard OpenAI-compatible endpoint for Grok
        } as any);

        console.log("Asking Grok...");
        console.log(await grokAgent.prompt("What is the meaning of life?"));

    } catch (error) {
        console.error("Error running agent:", error);
    }
}

runDemo();

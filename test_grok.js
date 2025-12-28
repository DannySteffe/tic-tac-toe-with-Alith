import { Agent } from "alith";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTest() {
    try {
        // 1. Read .env manually to get the key (since we are in Node, not Vite)
        const envPath = path.join(__dirname, ".env");
        if (!fs.existsSync(envPath)) {
            console.error("Error: .env file not found!");
            return;
        }

        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(/VITE_GROK_API_KEY=(.+)/);

        if (!match || !match[1]) {
            console.error("Error: VITE_GROK_API_KEY not found in .env");
            return;
        }

        const apiKey = match[1].trim();
        console.log("Found API Key length:", apiKey.length); // Log length to verify read, don't log key

        // 2. Initialize Agent with Grok config
        const agent = new Agent({
            model: "grok-beta",
            apiKey: apiKey,
            baseURL: "https://api.x.ai/v1",
            preamble: "You are a helpful assistant.",
        });

        console.log("Sending request to Grok...");
        const response = await agent.prompt("Hello! Are you ready to play Tic Tac Toe?");
        console.log("\n--- Grok Response ---");
        console.log(response);
        console.log("---------------------");

    } catch (error) {
        console.error("Error running Grok test:", error);
    }
}

runTest();

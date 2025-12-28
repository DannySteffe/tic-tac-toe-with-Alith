import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runDirectTest() {
    try {
        const envPath = path.join(__dirname, ".env");
        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(/VITE_GROK_API_KEY=(.+)/);
        const apiKey = match[1].trim();

        console.log("Testing Direct API Call to xAI...");

        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "grok-2-1212",
                messages: [
                    { role: "system", content: "You are a test script." },
                    { role: "user", content: "Say 'Connection Successful' if you can hear me." }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} ${response.statusText}`);
            console.error("Details:", errorText);
            return;
        }

        const data = await response.json();
        console.log("\n--- Success! ---");
        console.log(data.choices[0].message.content);

    } catch (error) {
        console.error("Network/Script Error:", error);
    }
}

runDirectTest();

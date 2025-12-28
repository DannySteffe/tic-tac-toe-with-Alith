import type { BoardState, Player } from './alith';
import { getBestMove } from './alith';

// Direct fetch to Grok API to avoid Node.js dependencies in browser
async function callGrokApi(prompt: string) {
    const apiKey = import.meta.env.VITE_GROK_API_KEY;
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "grok-2-1212",
            messages: [
                {
                    role: "system",
                    content: `You are a competitive Tic Tac Toe player named Alith.
          You are playing against a human.
          Your goal is to win, or at least draw.
          You will receive the board state as an array of 9 elements (0-8).
          'X' is the first player, 'O' is the second.
          Null represents an empty space.

          You must output ONLY a JSON object with the following format:
          { "move": <index_0_to_8>, "comment": "<short_witty_comment>" }

          Do not output markdown or any other text. Just the JSON.`
                },
                { role: "user", content: prompt }
            ],
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

export async function getAiMove(board: BoardState, aiSymbol: Player): Promise<{ move: number, comment: string }> {
    try {
        // Calculate the mathematically perfect move to guide the AI
        const perfectMove = getBestMove(board, aiSymbol, 'hard');

        const prompt = `
    Current Board: ${JSON.stringify(board)}
    You are playing as: ${aiSymbol}
    Available moves: ${board.map((c, i) => c === null ? i : null).filter(i => i !== null).join(', ')}

    STRATEGIC HINT: The mathematically optimal move to ensure a win or draw is index ${perfectMove}.

    You should highly consider taking this move unless you see a guaranteed win elsewhere.
    Make a witty comment about your move.
    `;

        const response = await callGrokApi(prompt);

        // Parse the JSON response
        // Grok might wrap it in markdown code blocks, so we clean it
        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanResponse);

        return result;
    } catch (error) {
        console.error("Error getting AI move from Grok:", error);
        // Fallback to Minimax if API fails
        const perfectMove = getBestMove(board, aiSymbol, 'hard');
        return { move: perfectMove, comment: "I'm calculating purely on logic now." };
    }
}

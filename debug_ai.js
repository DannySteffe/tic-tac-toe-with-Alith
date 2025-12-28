
// Mocking the types and logic from alith.ts to run in Node.js without TS setup issues
const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function checkWinner(board) {
    for (const combo of WIN_COMBOS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== null)) return 'Draw';
    return null;
}

function minimax(board, depth, isMaximizing, aiSymbol, opponentSymbol) {
    const result = checkWinner(board);
    if (result === aiSymbol) return 10 - depth;
    if (result === opponentSymbol) return depth - 10;
    if (result === 'Draw') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = aiSymbol;
                const score = minimax(board, depth + 1, false, aiSymbol, opponentSymbol);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = opponentSymbol;
                const score = minimax(board, depth + 1, true, aiSymbol, opponentSymbol);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getBestMove(board, aiSymbol) {
    const opponentSymbol = aiSymbol === 'X' ? 'O' : 'X';
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = aiSymbol;
            const score = minimax(board, 0, false, aiSymbol, opponentSymbol);
            board[i] = null;

            console.log(`Move ${i}, Score: ${score}`);

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Test Case 1: Block Win
// X X .
// . O .
// . . .
// AI is O. X is about to win at 2.
console.log("Test Case 1: Block Win");
const board1 = ['X', 'X', null, null, 'O', null, null, null, null];
const move1 = getBestMove(board1, 'O');
console.log(`Best Move: ${move1} (Expected: 2)`);

// Test Case 2: Take Center if available (User played corner)
// X . .
// . . .
// . . .
// AI is O.
console.log("\nTest Case 2: Response to Corner");
const board2 = ['X', null, null, null, null, null, null, null, null];
const move2 = getBestMove(board2, 'O');
console.log(`Best Move: ${move2} (Expected: 4)`);

// Test Case 3: Block Fork (Tricky)
// X . .
// . O .
// . . X
// AI is O. X has corners. AI must play edge (not corner) to force X to block.
// If AI plays corner, X plays other corner -> Fork.
// Actually, let's see what Minimax says.
console.log("\nTest Case 3: Corner Trap");
const board3 = ['X', null, null, null, 'O', null, null, null, 'X'];
const move3 = getBestMove(board3, 'O');
console.log(`Best Move: ${move3} (Expected: 1, 3, 5, or 7 - Edges)`);


export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardState = CellValue[];
export type Difficulty = 'easy' | 'medium' | 'hard';

// Winning combinations indices
const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function checkWinner(board: BoardState): Player | 'Draw' | null {
    for (const combo of WIN_COMBOS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== null)) return 'Draw';
    return null;
}

function minimax(board: BoardState, depth: number, isMaximizing: boolean, aiSymbol: Player, opponentSymbol: Player): number {
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

function getRandomMove(board: BoardState): number {
    const availableMoves = board
        .map((val, idx) => val === null ? idx : null)
        .filter((val) => val !== null) as number[];

    if (availableMoves.length === 0) return -1;
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

export function getBestMove(board: BoardState, aiSymbol: Player, difficulty: Difficulty = 'hard'): number {
    // Guardrail: Validate input
    if (!board || board.length !== 9) return -1;

    // Easy: 100% Random
    if (difficulty === 'easy') {
        return getRandomMove(board);
    }

    // Medium: 70% Optimal, 30% Random
    if (difficulty === 'medium') {
        const isOptimal = Math.random() < 0.7;
        if (!isOptimal) {
            return getRandomMove(board);
        }
    }

    // Hard: 100% Optimal (Minimax)
    // Optimization: Always take center if available.
    // This is the best move for X (first move) and the best response for O (if X didn't take it).
    if (board[4] === null) return 4;

    const opponentSymbol = aiSymbol === 'X' ? 'O' : 'X';

    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = aiSymbol;
            const score = minimax(board, 0, false, aiSymbol, opponentSymbol);
            board[i] = null;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

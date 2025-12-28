import { useState, useEffect } from 'react';
import { Cell } from './components/Cell';
import { getBestMove } from './engine/alith';
import { getAiMove } from './engine/alith_llm';
import type { Player, BoardState, Difficulty } from './engine/alith';
import './index.css';

function App() {
  const [gameStage, setGameStage] = useState<'welcome' | 'playing'>('welcome');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [aiComment, setAiComment] = useState<string>("");
  const [isThinking, setIsThinking] = useState(false);
  
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isGameActive, setIsGameActive] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [humanSymbol, setHumanSymbol] = useState<Player>('X');
  const [turn, setTurn] = useState<Player>('X'); // X always goes first

  const aiSymbol = humanSymbol === 'X' ? 'O' : 'X';

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStage('playing');
    setAiComment("");
    resetGame();
  };

  const backToMenu = () => {
    setGameStage('welcome');
    resetGame();
  };

  const checkGameStatus = (currentBoard: BoardState) => {
    // Check winner
    const WIN_COMBOS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of WIN_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        setWinner(currentBoard[a]);
        setIsGameActive(false);
        return;
      }
    }

    if (currentBoard.every(cell => cell !== null)) {
      setWinner('Draw');
      setIsGameActive(false);
    }
  };

  const handleCellClick = (index: number) => {
    if (!isGameActive || board[index] !== null || turn !== humanSymbol || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = humanSymbol;
    setBoard(newBoard);
    setTurn(aiSymbol);
    checkGameStatus(newBoard);
  };

  // AI Turn
  useEffect(() => {
    if (!isGameActive || turn !== aiSymbol) return;

    const makeMove = async () => {
      setIsThinking(true);
      
      let move = -1;
      let comment = "";

      if (difficulty === 'hard') {
        // Use Actual Alith AI (Grok)
        try {
          const result = await getAiMove(board, aiSymbol);
          move = result.move;
          comment = result.comment;
        } catch (e) {
          console.error("AI failed", e);
          // Fallback to Minimax if LLM fails
          move = getBestMove(board, aiSymbol, 'hard');
        }
      } else {
        // Use Algorithmic AI for Easy/Medium
        // Small delay for realism
        await new Promise(resolve => setTimeout(resolve, 600));
        move = getBestMove(board, aiSymbol, difficulty);
      }

      if (move !== -1) {
        const newBoard = [...board];
        newBoard[move] = aiSymbol;
        setBoard(newBoard);
        setTurn(humanSymbol);
        if (comment) setAiComment(comment);
        checkGameStatus(newBoard);
      }
      setIsThinking(false);
    };

    makeMove();

  }, [turn, isGameActive, board, aiSymbol, humanSymbol, difficulty]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsGameActive(true);
    setWinner(null);
    setTurn('X'); // Reset to X starts
    setAiComment("");
  };

  if (gameStage === 'welcome') {
    return (
      <div className="game-container welcome-container">
        <h1>Tic Tac Toe with Alith</h1>
        <p className="subtitle">Choose your challenge level</p>
        
        <div className="difficulty-selection">
          <button className="difficulty-btn easy" onClick={() => startGame('easy')}>
            <span className="btn-title">Easy</span>
            <span className="btn-desc">Alith makes mistakes</span>
          </button>
          
          <button className="difficulty-btn medium" onClick={() => startGame('medium')}>
            <span className="btn-title">Medium</span>
            <span className="btn-desc">A balanced challenge</span>
          </button>
          
          <button className="difficulty-btn hard" onClick={() => startGame('hard')}>
            <span className="btn-title">Hard</span>
            <span className="btn-desc">A real challenge</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="header">
        <button className="back-btn" onClick={backToMenu}>← Menu</button>
        <div className="difficulty-badge">{difficulty === 'hard' ? 'ALITH AI' : difficulty.toUpperCase()}</div>
      </div>

      <h1>Alith vs You</h1>
      
      <div className="status">
        {winner ? (
          <span className={`winner-text ${winner === 'Draw' ? 'draw' : ''}`}>
            {winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}
          </span>
        ) : (
          <span>Turn: <span style={{ color: turn === 'X' ? 'var(--accent-x)' : 'var(--accent-o)' }}>{turn}</span></span>
        )}
      </div>

      {/* AI Comment Display */}
      <div style={{ minHeight: '3rem', fontSize: '1rem', color: '#cbd5e1', fontStyle: 'italic', maxWidth: '300px' }}>
        {isThinking ? (
          <span className="thinking">Alith is thinking...</span>
        ) : (
          aiComment && <span className="fade-in">"{aiComment}"</span>
        )}
      </div>

      <div className="board">
        {board.map((value, index) => (
          <Cell 
            key={index} 
            value={value} 
            onClick={() => handleCellClick(index)} 
            disabled={!isGameActive || (value !== null)}
          />
        ))}
      </div>

      <div className="controls">
        <button className="reset" onClick={resetGame}>
          New Game
        </button>
      </div>
      
      <div className="footer-controls">
        Playing as <strong style={{ color: humanSymbol === 'X' ? 'var(--accent-x)' : 'var(--accent-o)' }}>{humanSymbol}</strong>
        <span className="separator">•</span>
        <span className="switch-sides" onClick={() => {
          setHumanSymbol(humanSymbol === 'X' ? 'O' : 'X');
          resetGame();
        }}>
          Switch Sides
        </span>
      </div>
    </div>
  );
}

export default App;

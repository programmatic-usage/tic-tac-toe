import { useState, useEffect, useCallback } from 'react';
import './TicTacToe.css';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface WinInfo {
  winner: Player;
  line: number[];
}

function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [animatingCells, setAnimatingCells] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const calculateWinner = useCallback((squares: Board): WinInfo | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }, []);

  const handleClick = useCallback((index: number) => {
    if (board[index] || winInfo) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    // Add animation class
    setAnimatingCells(prev => new Set(prev).add(index));
    setTimeout(() => {
      setAnimatingCells(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 300);
  }, [board, isXNext, winInfo]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinInfo(null);
    setIsDraw(false);
    setAnimatingCells(new Set());
  }, []);

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinInfo(result);
      setScores(prev => ({
        ...prev,
        [result.winner!]: prev[result.winner!] + 1
      }));
    } else if (board.every(cell => cell !== null)) {
      setIsDraw(true);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [board, calculateWinner]);

  const getCellClassName = (index: number): string => {
    const classes = ['cell'];
    if (board[index]) classes.push('filled');
    if (animatingCells.has(index)) classes.push('animating');
    if (winInfo?.line.includes(index)) classes.push('winning');
    if (winInfo && !winInfo.line.includes(index)) classes.push('dimmed');
    if (!board[index] && !winInfo) classes.push('hoverable');
    return classes.join(' ');
  };

  const getStatusMessage = () => {
    if (winInfo) return `🎉 Player ${winInfo.winner} wins!`;
    if (isDraw) return '🤝 It\'s a draw!';
    return `Player ${isXNext ? 'X' : 'O'}'s turn`;
  };

  const getCurrentPlayerIcon = () => {
    return isXNext ? 'X' : 'O';
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">
          <span className="title-x">X</span>
          <span className="title-o">O</span>
        </h1>
        <p className="game-subtitle">Tic Tac Toe</p>
      </div>

      <div className="score-board">
        <div className={`score-card x-score ${isXNext && !winInfo && !isDraw ? 'active' : ''}`}>
          <span className="score-label">Player X</span>
          <span className="score-value">{scores.X}</span>
        </div>
        <div className="score-card draw-score">
          <span className="score-label">Draws</span>
          <span className="score-value">{scores.draws}</span>
        </div>
        <div className={`score-card o-score ${!isXNext && !winInfo && !isDraw ? 'active' : ''}`}>
          <span className="score-label">Player O</span>
          <span className="score-value">{scores.O}</span>
        </div>
      </div>

      <div className={`status-bar ${winInfo ? 'winner' : ''} ${isDraw ? 'draw' : ''}`}>
        <span className="status-icon">{!winInfo && !isDraw ? getCurrentPlayerIcon() : ''}</span>
        <span className="status-text">{getStatusMessage()}</span>
      </div>

      <div className={`game-board ${winInfo ? 'game-over' : ''}`}>
        {winInfo && (
          <div 
            className="win-line" 
            style={{
              '--line-start': winInfo.line[0],
              '--line-end': winInfo.line[2],
            } as React.CSSProperties}
          />
        )}
        {board.map((cell, index) => (
          <button
            key={index}
            className={getCellClassName(index)}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winInfo}
            aria-label={`Cell ${index + 1}`}
          >
            {cell && (
              <span className={`mark ${cell.toLowerCase()}-mark`}>
                {cell}
              </span>
            )}
            {!cell && !winInfo && (
              <span className={`preview-mark ${isXNext ? 'x-preview' : 'o-preview'}`}>
                {isXNext ? 'X' : 'O'}
              </span>
            )}
          </button>
        ))}
      </div>

      <button 
        className={`reset-btn ${winInfo || isDraw ? 'pulse' : ''}`}
        onClick={resetGame}
      >
        <span className="reset-icon">↻</span>
        New Game
      </button>

      <div className="game-footer">
        <p>First to 3 wins!</p>
      </div>
    </div>
  );
}

export default TicTacToe;

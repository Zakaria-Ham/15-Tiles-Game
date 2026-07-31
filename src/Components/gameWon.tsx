type GameWonProps = {
  onNewGame: () => void;
  onRestart: () => void;
};

function GameWon({ onNewGame, onRestart }: GameWonProps) {
  return (
    <div className="gamewon-overlay">
      <div className="gamewon-box">
        <h2>You won!</h2>
        <p>The board is solved. Start a fresh board or replay this one.</p>
        <div className="gamewon-actions">
          <button type="button" className="primary" onClick={onNewGame}>
            New Game
          </button>
          <button type="button" className="secondary" onClick={onRestart}>
            Restart Same Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameWon;

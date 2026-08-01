import { useState } from "react";

type GameWonProps = {
  onNewGame: () => void;
  onRestart: () => void;
  scoreSeconds: number;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

function GameWon({ onNewGame, onRestart, scoreSeconds }: GameWonProps) {
  const [shareStatus, setShareStatus] = useState("");

  const handleShare = async () => {
    const shareText = `I solved the 15 Tiles Game in ${formatTime(scoreSeconds)}!`;
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "15 Tiles Game",
          text: shareText,
          url: shareUrl,
        });
        setShareStatus("Score shared successfully!");
        return;
      }

      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShareStatus("Score copied to clipboard!");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setShareStatus("Share canceled.");
        return;
      }

      setShareStatus("Sharing is unavailable on this device.");
    }
  };

  return (
    <div className="gamewon-overlay">
      <div className="gamewon-box">
        <div className="gamewon-header">
          <div className="gamewon-badge" aria-hidden="true">
            🏆
          </div>
          <span className="gamewon-kicker">Victory</span>
        </div>

        <h2>You won!</h2>
        <p>
          Final score: <strong>{formatTime(scoreSeconds)}</strong>
        </p>

        <div className="gamewon-actions">
          <button type="button" className="primary" onClick={onNewGame}>
            New Game
          </button>
          <button type="button" className="secondary" onClick={onRestart}>
            Replay
          </button>
          <button type="button" className="share-button" onClick={handleShare}>
            Share score
          </button>
        </div>

        {shareStatus && <p className="gamewon-status">{shareStatus}</p>}
      </div>
    </div>
  );
}

export default GameWon;

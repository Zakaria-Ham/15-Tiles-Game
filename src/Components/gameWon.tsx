import { useState } from "react";

type GameWonProps = {
  onNewGame: () => void;
  onRestart: () => void;
  scoreSeconds: number;
  moveCounts: number;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

function GameWon({ onNewGame, onRestart, scoreSeconds, moveCounts }: GameWonProps) {
  const [shareStatus, setShareStatus] = useState("");

  const handleShare = async () => {
    const shareText = `I solved the 15 Tiles Game in ${formatTime(scoreSeconds)}!
      play it here: https://15-tiles-game.vercel.app`;
    const shareData = {
      title: "15 Tiles Game",
      text: shareText,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setShareStatus("Score shared successfully!");
        return;
      }

      const copiedText = `${shareText}`;

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copiedText);
        setShareStatus("Score copied to clipboard!");
        return;
      }

      const textArea = document.createElement("textarea");
      textArea.value = copiedText;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();

      const wasCopied = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (wasCopied) {
        setShareStatus("Score copied to clipboard!");
        return;
      }

      setShareStatus("Sharing is unavailable on this device.");
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
          Final score: <strong>{formatTime(scoreSeconds)}</strong> <br />
          Done in: <strong>{moveCounts}</strong>
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

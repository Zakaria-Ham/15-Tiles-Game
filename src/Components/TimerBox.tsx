import "./styles/TimerBox.css";

type TimerBoxProps = {
  timerSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  onNewGame: () => void;
  onHint: () => void;
  onFullSolution: () => void;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

function TimerBox({
  timerSeconds,
  isPaused,
  onTogglePause,
  onRestart,
  onNewGame,
  onHint,
  onFullSolution,
}: TimerBoxProps) {
  return (
    <aside className="info-box timer-box">
      <div className="timer-header">
        <span className="timer-icon">⏱️</span>
        <span>Timer</span>
      </div>

      <div className="timer-display">{formatTime(timerSeconds)}</div>

      <div className="timer-actions">
        <button
          type="button"
          className="icon-button pause-button"
          onClick={onTogglePause}
          aria-label={isPaused ? "Resume timer" : "Pause timer"}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? "▶" : "⏸"}
        </button>

        <button
          type="button"
          className="icon-button danger-button"
          onClick={onRestart}
          aria-label="Restart same game"
          title="Restart"
        >
          ↺
        </button>

        <button
          type="button"
          className="icon-button newgame-button"
          onClick={onNewGame}
          aria-label="Start new game"
          title="New Game"
        >
          🔄
        </button>

        <button
          type="button"
          className="icon-button hint-button"
          onClick={onHint}
          aria-label="Get a hint"
          title="Hint"
        >
          💡
        </button>

        <button
          type="button"
          className="icon-button solution-button"
          onClick={onFullSolution}
          aria-label="Show full solution"
          title="Full Solution"
        >
          🧩
        </button>
      </div>
    </aside>
  );
}

export default TimerBox;

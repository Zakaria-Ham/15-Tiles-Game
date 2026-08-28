import "./styles/TimerBox.css";
import type { Square } from "../App";

type TimerBoxProps = {
  timerSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  onNewGame: () => void;
  boardArray: Square[];
  onHintTile: (tileNumber: string) => void;
  onSolution: (solution: string[]) => void;
  onClearHighlight: () => void;
};

const MAX_MOVES = 80;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const getAdjacentIndices = (index: number): number[] => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const neighbors: number[] = [];

  if (row > 0) neighbors.push(index - 4);
  if (row < 3) neighbors.push(index + 4);
  if (col > 0) neighbors.push(index - 1);
  if (col < 3) neighbors.push(index + 1);

  return neighbors;
};

const isSolved = (board: Uint8Array): boolean => {
  for (let i = 0; i < 15; i++) {
    if (board[i] !== i + 1) {
      return false;
    }
  }

  return board[15] === 0;
};

const createBoard = (squares: Square[]): Uint8Array => {
  const board = new Uint8Array(16);

  for (let i = 0; i < 16; i++) {
    board[i] = squares[i].number === "" ? 0 : Number(squares[i].number);
  }

  return board;
};

const getManhattan = (board: Uint8Array): number => {
  let distance = 0;

  for (let index = 0; index < 16; index++) {
    const value = board[index];

    if (value === 0) {
      continue;
    }

    const target = value - 1;

    const row = Math.floor(index / 4);
    const col = index % 4;

    const targetRow = Math.floor(target / 4);
    const targetCol = target % 4;

    distance += Math.abs(row - targetRow) + Math.abs(col - targetCol);
  }

  return distance;
};

const getLinearConflict = (board: Uint8Array): number => {
  let conflicts = 0;

  for (let row = 0; row < 4; row++) {
    const start = row * 4;

    for (let a = 0; a < 4; a++) {
      const indexA = start + a;
      const valueA = board[indexA];

      if (valueA === 0 || Math.floor((valueA - 1) / 4) !== row) {
        continue;
      }

      const targetColA = (valueA - 1) % 4;

      for (let b = a + 1; b < 4; b++) {
        const indexB = start + b;
        const valueB = board[indexB];

        if (valueB === 0 || Math.floor((valueB - 1) / 4) !== row) {
          continue;
        }

        const targetColB = (valueB - 1) % 4;

        if (targetColA > targetColB) {
          conflicts += 2;
        }
      }
    }
  }

  for (let col = 0; col < 4; col++) {
    for (let a = 0; a < 4; a++) {
      const indexA = a * 4 + col;
      const valueA = board[indexA];

      if (valueA === 0 || (valueA - 1) % 4 !== col) {
        continue;
      }

      const targetRowA = Math.floor((valueA - 1) / 4);

      for (let b = a + 1; b < 4; b++) {
        const indexB = b * 4 + col;
        const valueB = board[indexB];

        if (valueB === 0 || (valueB - 1) % 4 !== col) {
          continue;
        }

        const targetRowB = Math.floor((valueB - 1) / 4);

        if (targetRowA > targetRowB) {
          conflicts += 2;
        }
      }
    }
  }

  return conflicts;
};

const getHeuristic = (board: Uint8Array): number => {
  return getManhattan(board) + getLinearConflict(board);
};

const getBoardKey = (board: Uint8Array): string => {
  return Array.from(board).join(",");
};

const solvePuzzle = (startingSquares: Square[]): string[] | null => {
  const board = createBoard(startingSquares);

  if (isSolved(board)) {
    return [];
  }

  const path: string[] = [];
  const currentPathStates = new Set<string>();

  let emptyIndex = board.indexOf(0);
  let solution: string[] | null = null;

  const dfs = (
    depth: number,
    bound: number,
    previousEmptyIndex: number,
  ): boolean => {
    const heuristic = getHeuristic(board);
    const estimatedCost = depth + heuristic;

    if (estimatedCost > bound) {
      return false;
    }

    if (isSolved(board)) {
      solution = [...path];
      return true;
    }

    if (depth >= MAX_MOVES) {
      return false;
    }

    const moves = getAdjacentIndices(emptyIndex);

    const orderedMoves = moves
      .filter((index) => index !== previousEmptyIndex)
      .filter((index) => board[index] !== 0)
      .map((tileIndex) => {
        const oldEmptyIndex = emptyIndex;
        const tile = board[tileIndex];

        board[oldEmptyIndex] = tile;
        board[tileIndex] = 0;
        emptyIndex = tileIndex;

        const score = getHeuristic(board);

        board[tileIndex] = tile;
        board[oldEmptyIndex] = 0;
        emptyIndex = oldEmptyIndex;

        return {
          tileIndex,
          tileNumber: tile,
          score,
        };
      })
      .sort((a, b) => a.score - b.score);

    for (const move of orderedMoves) {
      const tileIndex = move.tileIndex;
      const tileNumber = move.tileNumber;
      const oldEmptyIndex = emptyIndex;

      board[oldEmptyIndex] = tileNumber;
      board[tileIndex] = 0;
      emptyIndex = tileIndex;

      const key = getBoardKey(board);

      if (!currentPathStates.has(key)) {
        currentPathStates.add(key);
        path.push(String(tileNumber));

        if (dfs(depth + 1, bound, oldEmptyIndex)) {
          return true;
        }

        path.pop();
        currentPathStates.delete(key);
      }

      board[tileIndex] = tileNumber;
      board[oldEmptyIndex] = 0;
      emptyIndex = oldEmptyIndex;
    }

    return false;
  };

  let bound = getHeuristic(board);

  while (bound <= MAX_MOVES) {
    path.length = 0;
    solution = null;
    emptyIndex = board.indexOf(0);

    currentPathStates.clear();
    currentPathStates.add(getBoardKey(board));

    if (dfs(0, bound, -1)) {
      return solution;
    }

    bound++;
  }

  return null;
};

function TimerBox({
  timerSeconds,
  isPaused,
  onTogglePause,
  onRestart,
  onNewGame,
  boardArray,
  onHintTile,
  onSolution,
  onClearHighlight,
}: TimerBoxProps) {
  const onFullSolution = () => {
    const solution = solvePuzzle(boardArray);

    if (solution === null) {
      console.log("NO SOLUTION FOUND");
      onSolution([]);
      return;
    }

    console.log(
      "SOLUTION:",
      solution.length > 0 ? solution.join(" → ") : "Already solved",
    );

    onSolution(solution);
  };

  const onHint = () => {
    const solution = solvePuzzle(boardArray);

    if (!solution || solution.length === 0) {
      return;
    }

    onHintTile(solution[0]);
  };

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

        <button
          type="button"
          className="icon-button clear-button"
          onClick={onClearHighlight}
          aria-label="Clear highlights"
          title="Clear Highlights"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}

export default TimerBox;

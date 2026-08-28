import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./Components/footer";
import GameWon from "./Components/gameWon";
import TimerBox from "./Components/TimerBox.tsx";
import TopBar from "./Components/topBar";

export type Square = {
  number: string;
  bgcolor: string;
};

const NORMAL_COLOR = "#4f46e5";
const HIGHLIGHT_COLOR = "green";

const createSolvedBoard = (): Square[] =>
  Array.from({ length: 16 }, (_, index) => ({
    number: index === 15 ? "" : String(index + 1),
    bgcolor: index === 15 ? "transparent" : NORMAL_COLOR,
  }));

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

const createDeck = (): Square[] => {
  const cards = createSolvedBoard();

  let emptyIndex = 15;
  let lastMoved = -1;

  const SHUFFLE_MOVES = Math.floor(Math.random() * 200) + 1;

  for (let i = 0; i < SHUFFLE_MOVES; i++) {
    const neighbors = getAdjacentIndices(emptyIndex).filter(
      (n) => n !== lastMoved,
    );

    const next = neighbors[Math.floor(Math.random() * neighbors.length)];

    [cards[emptyIndex], cards[next]] = [cards[next], cards[emptyIndex]];

    lastMoved = emptyIndex;
    emptyIndex = next;
  }

  return cards;
};

const isAdjacentToEmpty = (index: number, emptyIndex: number): boolean => {
  const row = Math.floor(index / 4);
  const col = index % 4;

  const emptyRow = Math.floor(emptyIndex / 4);
  const emptyCol = emptyIndex % 4;

  return Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
};

const swapSquares = (
  squares: Square[],
  index1: number,
  index2: number,
): Square[] => {
  if (index1 === index2 || !isAdjacentToEmpty(index1, index2)) {
    return squares;
  }

  const newSquares = [...squares];

  [newSquares[index1], newSquares[index2]] = [
    newSquares[index2],
    newSquares[index1],
  ];

  return newSquares;
};

const resetColors = (board: Square[]): Square[] =>
  board.map((square) => ({
    ...square,
    bgcolor: square.number === "" ? "transparent" : NORMAL_COLOR,
  }));

const isGameWon = (squares: Square[]): boolean =>
  squares.every((square, index) => {
    const expected = index === 15 ? "" : String(index + 1);

    return square.number === expected;
  });

function App() {
  const [startingBoard, setStartingBoard] = useState<Square[]>(() =>
    createDeck(),
  );

  const [squares, setSquares] = useState<Square[]>(startingBoard);

  const [hasWon, setHasWon] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [solutionPath, setSolutionPath] = useState<string[]>([]);

  const [solutionStep, setSolutionStep] = useState(0);

  useEffect(() => {
    if (hasWon || !hasStarted || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimerSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasWon, hasStarted, isPaused]);

  useEffect(() => {
    if (isGameWon(squares)) {
      setHasWon(true);
      setIsPaused(false);
    }
  }, [squares]);

  const resetTimer = () => {
    setTimerSeconds(0);
    setHasStarted(false);
    setIsPaused(false);
  };

  const startNewGame = () => {
    const nextBoard = createDeck();

    setStartingBoard(nextBoard);
    setSquares(nextBoard);
    setSolutionPath([]);
    setSolutionStep(0);
    setHasWon(false);

    resetTimer();
  };

  const restartSameGame = () => {
    setSquares(resetColors(startingBoard));
    setSolutionPath([]);
    setSolutionStep(0);
    setHasWon(false);

    resetTimer();
  };

  const handleHintTile = (tileNumber: string) => {
    setSolutionPath([]);
    setSolutionStep(0);

    setSquares((current) =>
      current.map((square) => ({
        ...square,
        bgcolor:
          square.number === ""
            ? "transparent"
            : square.number === tileNumber
              ? HIGHLIGHT_COLOR
              : NORMAL_COLOR,
      })),
    );
  };

  const handleSolution = (solution: string[]) => {
    setSolutionPath(solution);
    setSolutionStep(0);

    if (solution.length === 0) {
      setSquares(resetColors);
      return;
    }

    const nextTile = solution[0];

    setSquares((current) =>
      current.map((square) => ({
        ...square,
        bgcolor:
          square.number === ""
            ? "transparent"
            : square.number === nextTile
              ? HIGHLIGHT_COLOR
              : NORMAL_COLOR,
      })),
    );
  };

  const handleClearHighlight = () => {
    setSolutionPath([]);
    setSolutionStep(0);

    setSquares((current) => resetColors(current));
  };

  const handleSquareClick = (index: number) => {
    if (hasWon || isPaused || squares[index].number === "") {
      return;
    }

    const emptyIndex = squares.findIndex((square) => square.number === "");

    if (emptyIndex === -1 || !isAdjacentToEmpty(index, emptyIndex)) {
      return;
    }

    const clickedTile = squares[index].number;

    const expectedTile = solutionPath[solutionStep];

    const movedSquares = swapSquares(squares, index, emptyIndex);

    let nextStep = solutionStep;

    if (solutionPath.length > 0 && clickedTile === expectedTile) {
      nextStep++;
    }

    setSolutionStep(nextStep);

    const nextTile = solutionPath[nextStep];

    const nextSquares = movedSquares.map((square) => ({
      ...square,
      bgcolor:
        square.number === ""
          ? "transparent"
          : nextTile && square.number === nextTile
            ? HIGHLIGHT_COLOR
            : NORMAL_COLOR,
    }));

    setSquares(nextSquares);

    if (!hasStarted) {
      setHasStarted(true);
    }

    if (isGameWon(nextSquares)) {
      setHasWon(true);
      setIsPaused(false);
      setSolutionPath([]);
      setSolutionStep(0);
    }
  };

  return (
    <div className="App">
      <TopBar />

      <div className="app-frame">
        <div className="game-shell">
          <div className="left-column">
            <TimerBox
              timerSeconds={timerSeconds}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused((value) => !value)}
              onRestart={restartSameGame}
              onNewGame={startNewGame}
              boardArray={squares}
              onHintTile={handleHintTile}
              onSolution={handleSolution}
              onClearHighlight={handleClearHighlight}
            />

            <aside className="info-box rules-box">
              <p className="game-rules-title">The Rules</p>

              <ul>
                <li>Slide tiles into the empty space to rebuild the order.</li>

                <li>
                  Arrange the numbers from 1 to 15 with the blank tile last.
                </li>
              </ul>
            </aside>
          </div>

          <div className="board-panel">
            <div className="game-box">
              {squares.map((square, index) => (
                <button
                  type="button"
                  key={`${square.number}-${index}`}
                  className={`game-square${
                    square.number === "" ? " empty" : ""
                  }`}
                  style={{
                    backgroundColor:
                      square.number === "" ? "transparent" : square.bgcolor,
                    border:
                      square.number === ""
                        ? "2px dashed rgba(148, 163, 184, 0.6)"
                        : "2px solid rgba(255,255,255,0.1)",
                  }}
                  onClick={() => handleSquareClick(index)}
                  disabled={hasWon || isPaused}
                >
                  {square.number || ""}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hasWon && (
        <GameWon
          onNewGame={startNewGame}
          onRestart={restartSameGame}
          scoreSeconds={timerSeconds}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;

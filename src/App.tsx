import { useEffect, useState } from "react";
import "./App.css";
import GameWon from "./Components/gameWon";
import TimerBox from "./Components/TimerBox.tsx";

type Square = {
  number: string;
  bgcolor: string;
};

const createDeck = (): Square[] => {
  const cards: Square[] = Array.from({ length: 16 }, (_, index) => {
    const number = index + 1;
    return {
      number: number === 16 ? "" : String(number),
      bgcolor: number === 16 ? "transparent" : "#4f46e5",
    };
  });

  for (let i = cards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
  }

  return cards;
};

const isAdjacentToEmpty = (index: number, emptyIndex: number) => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const emptyRow = Math.floor(emptyIndex / 4);
  const emptyCol = emptyIndex % 4;

  return Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
};

const swapSquares = (squares: Square[], index1: number, index2: number) => {
  if (index1 === index2 || !isAdjacentToEmpty(index1, index2)) {
    return squares;
  }

  const newSquares = [...squares];
  [newSquares[index1], newSquares[index2]] = [newSquares[index2], newSquares[index1]];
  return newSquares;
};

const gameSolution: Square[] = Array.from({ length: 16 }, (_, index) => ({
  number: index === 15 ? "" : String(index + 1),
  bgcolor: index === 15 ? "transparent" : "#4f46e5",
}));

const isGameWon = (squares: Square[]) =>
  squares.every((square, index) => {
    const solutionSquare = gameSolution[index];
    return (
      square.number === solutionSquare.number &&
      square.bgcolor === solutionSquare.bgcolor
    );
  });

function App() {
  const [startingBoard, setStartingBoard] = useState<Square[]>(() => createDeck());
  const [squares, setSquares] = useState<Square[]>(startingBoard);
  const [hasWon, setHasWon] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
    setHasWon(false);
    resetTimer();
  };

  const restartSameGame = () => {
    setSquares(startingBoard);
    setHasWon(false);
    resetTimer();
  };

  const handleSquareClick = (index: number) => {
    if (hasWon || isPaused || squares[index].number === "") {
      return;
    }

    const emptyIndex = squares.findIndex((square) => square.number === "");
    if (emptyIndex === -1 || !isAdjacentToEmpty(index, emptyIndex)) {
      return;
    }

    const nextSquares = swapSquares(squares, index, emptyIndex);
    setSquares(nextSquares);

    if (!hasStarted) {
      setHasStarted(true);
    }

    if (isGameWon(nextSquares)) {
      setHasWon(true);
      setIsPaused(false);
    }
  };

  return (
    <div className="App">
      <div className="game-shell">
        <div className="left-column">
          <TimerBox
            timerSeconds={timerSeconds}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused((value) => !value)}
            onRestart={restartSameGame}
            onNewGame={startNewGame}
            onHint={() => undefined}
            onFullSolution={() => undefined}
          />

          <aside className="info-box rules-box">
            <p className="game-rules-title">The Rules</p>
            <ul>
              <li>Slide tiles into the empty space to rebuild the order.</li>
              <li>Arrange the numbers from 1 to 15 with the blank tile last.</li>
            </ul>
          </aside>
        </div>

        <div className="board-panel">
          <div className="game-box">
            {squares.map((square, index) => (
              <button
                type="button"
                key={`${square.number}-${index}`}
                className={`game-square${square.number === "" ? " empty" : ""}`}
                style={{
                  backgroundColor: square.number === "" ? "transparent" : square.bgcolor,
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

      {hasWon && <GameWon onNewGame={startNewGame} onRestart={restartSameGame} />}
    </div>
  );
}

export default App;

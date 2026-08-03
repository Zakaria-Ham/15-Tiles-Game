import "./styles/topBar.css";

function TopBar() {
  return (
    <header className="top-bar">
      <div className="brand-wrap">
        <span className="brand-name">RedLabs</span>
        <span className="brand-subtitle">by redled</span>
      </div>
      <h1 className="game-title">15 Tiles Game</h1>
    </header>
  );
}

export default TopBar;

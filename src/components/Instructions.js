import React from "react";
import "../styles/instructions.css";

export default function Instructions({ startGame }) {
  return (
    <div className="InstructionsBoard">
      <h3>Word Race</h3>
      <button className="start-btn" onClick={startGame}>
        Start Game
      </button>
    </div>
  );
}

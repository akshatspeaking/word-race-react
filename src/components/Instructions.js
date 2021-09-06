import React from "react";

export default function Instructions({ startGame }) {
  return (
    <div className="InstructionsBoard">
      <button onClick={startGame}>Start</button>
    </div>
  );
}

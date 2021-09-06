import { useEffect, useRef, useState } from "react";
import Instructions from "./components/Instructions";
import Keyboard from "./components/Keyboard";
import Scoreboard from "./components/Scoreboard";
import WordsList from "./components/WordsList";
import { wordBank } from "./data/wordbank";
import useGameRules from "./hooks/useGameRules";
import("./styles/gameboard.css");

function App() {
  const [isLoggingKeys, setIsLoggingKeys] = useState(false);

  const {
    wordStack,
    addWordToStack,
    moveToNextChar,
    stackWordIndex,
    startTimer,
    isGameEnded,
    checkForCharMatch,
    nextChar,
    score,
    delay,
    isMistype,
    pressedChar,
    setPressedChar,
    multiplier,
  } = useGameRules();

  function startGame() {
    startTimer();
    setIsLoggingKeys(true);
  }

  useEffect(() => {
    function handleKeyUp(e) {
      if (e.key !== " ") {
        checkForCharMatch(e.key);
        setPressedChar(e.key);
      }
    }

    function handleKeyDown(e) {
      setPressedChar("");
    }
    if (isLoggingKeys && !isGameEnded) {
      console.log("adding listener");
      document.addEventListener("keyup", handleKeyUp);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      console.log("removing listener");
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoggingKeys, isGameEnded]);

  if (isLoggingKeys) {
    return (
      <div className="GameBoard">
        <Scoreboard multiplier={multiplier} score={score} delay={delay} />
        <WordsList stack={wordStack} currentIndex={stackWordIndex} />
        <Keyboard
          nextChar={nextChar}
          pressedChar={pressedChar}
          isMistype={isMistype}
        />
      </div>
    );
  } else if (isGameEnded) {
    return <Scoreboard />;
  } else {
    return <Instructions startGame={startGame} />;
  }
}

export default App;

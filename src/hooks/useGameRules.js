import { useEffect, useRef, useState } from "react";

const randomWords = require("random-words");
const wordBank = randomWords({ exactly: 50 });

export default function useGameRules() {
  const [wordStack, setWordStack] = useState([]);

  const [numberOfWordsAdded, setNumberOfWordsAdded] = useState(0);
  const [numberOfWordsCompleted, setNumberOfWordsCompleted] = useState(0);

  const noWordsAdded = useRef(0);

  const noWordsRemoved = useRef(0);

  const stackWordIndex = useRef(0);

  const nextChar = useRef("");

  const [isGameEnded, setIsGameEnded] = useState(false);

  const [pressedChar, setPressedChar] = useState("");

  const timer = useRef(null);

  const delay = useRef(2000);

  const rateOfWords = useRef(50);

  const [wordStartTime, setWordStartTime] = useState(0);

  const [score, setScore] = useState(0);

  const [multiplier, setMultiplier] = useState(1);
  const [isMistype, setIsMistype] = useState(false);

  useEffect(() => {
    setWordStack(wordBank.slice(noWordsRemoved.current, noWordsAdded.current));
    console.log(wordBank.slice(noWordsRemoved.current, noWordsAdded.current));
  }, [numberOfWordsAdded, numberOfWordsCompleted]);

  function endGame() {
    clearInterval(timer.current);
    setIsGameEnded(true);
  }

  function resetTimer() {
    clearInterval(timer.current);
    startTimer();
  }

  function startTimer() {
    console.log("starting timer");
    timer.current = setInterval(() => {
      if (noWordsAdded.current - noWordsRemoved.current < 10) {
        addWordToStack();
        if (delay.current > 1000) {
          delay.current -= rateOfWords.current;
          resetTimer();
        }
      } else {
        endGame();
      }
    }, delay.current);
  }

  function completeWord() {}

  function removeWordFromStack() {
    setNumberOfWordsCompleted(
      (numberOfWordsCompleted) => numberOfWordsCompleted + 1
    );
    noWordsRemoved.current++;
    stackWordIndex.current = 0;
    nextChar.current = wordBank[noWordsRemoved.current][0];
  }

  function addWordToStack() {
    if (noWordsAdded.current === 0) {
      updateWordTime();
      console.log(Date.now());
      nextChar.current = wordBank[0][0];
    }
    setNumberOfWordsAdded((numberOfWordsAdded) => numberOfWordsAdded + 1);
    console.log("adding", noWordsAdded.current);
    noWordsAdded.current++;
  }

  function checkForCharMatch(char) {
    if (char === nextChar.current) {
      console.log("Correct");
      setIsMistype(false);
      moveToNextChar();
    } else {
      console.log("Incorrect", nextChar.current);
      setIsMistype(true);
      setMultiplier(1);
    }
  }

  function updateWordTime() {
    setWordStartTime((wordStartTime) => {
      if (wordStartTime) {
        let timeTaken = (Date.now() - wordStartTime) / 1000;
        console.log(timeTaken);
        setScore((score) => Math.ceil((score + 10 / timeTaken) * multiplier));
        setMultiplier((multiplier) => multiplier + 0.5);
      }
      return Date.now();
    });
  }

  function moveToNextChar() {
    if (
      stackWordIndex.current ===
      wordBank[noWordsRemoved.current].length - 1
    ) {
      // reached last character
      removeWordFromStack();
      updateWordTime();
    } else {
      nextChar.current =
        wordBank[noWordsRemoved.current][stackWordIndex.current + 1];
      console.log();
      stackWordIndex.current++;
    }
  }

  return {
    startTimer,
    addWordToStack,
    moveToNextChar,
    isGameEnded,
    checkForCharMatch,
    wordStack,
    nextChar: nextChar.current,
    score,
    delay: delay.current,
    isMistype,
    pressedChar,
    setPressedChar,
    multiplier,
    stackWordIndex: stackWordIndex.current,
  };
}

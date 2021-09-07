import React, { useState } from "react";
import "../styles/leaderboard.css";

export default function Leaderboard({ finalScore }) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [rank, setRank] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(null);
  const [averageScore, setAverageScore] = useState(null);

  function saveScore() {
    setIsLoading(true);
    fetch("https://word-race-db.herokuapp.com/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        score: finalScore,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRank(data.rank + 1);
        setLeaderboardData(data.scoreList);
        setGamesPlayed(data.numberOfGames);
        setAverageScore(data.averageScore);
        setIsLoading(false);
      });
  }

  function showLeaderboard() {
    setIsLoading(true);
    fetch("https://word-race-db.herokuapp.com/scores")
      .then((res) => res.json())
      .then((data) => {
        setLeaderboardData(data.scoreList);
        setGamesPlayed(data.numberOfGames);
        setAverageScore(data.averageScore);
        console.log(data);
        setIsLoading(false);
      });
  }

  if (isLoading) {
    return (
      <div className="loadContainer">
        <div id="loading"></div>
      </div>
    );
  } else if (leaderboardData.length) {
    return (
      <div className="leaderboard">
        {rank ? <h2>Your Rank: {rank}</h2> : null}
        <h1>LeaderBoard</h1>
        <div class="tbl-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="tbl-content">
          <table cellpadding="0" cellspacing="0" border="0">
            <tbody>
              {leaderboardData.map((obj, i) => (
                <tr className={rank === i + 1 ? "highlight" : null}>
                  <td>{i + 1}</td>
                  <td>{obj.name} </td>
                  <td>{obj.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Total Games Played : {gamesPlayed}</h2>
        <h2>Average Score : {Math.ceil(averageScore)}</h2>
      </div>
    );
  } else {
    return (
      <div className="submitform">
        <p>Your final score is {finalScore}</p>
        <p> Enter your name to submit your score.</p>
        <input
          type="text"
          valueu={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className={username.length ? "btn" : "disabled"}
          disabled={!username.length}
          onClick={saveScore}
        >
          Submit
        </button>
        <button className="btn" onClick={showLeaderboard}>
          Skip
        </button>
      </div>
    );
  }
}

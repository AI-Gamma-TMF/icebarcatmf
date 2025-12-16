import React from "react";

const BiggestWinnerAndLooserFormula = () => {
  return (
    <>
      <p>
        {" "}
        <strong>Biggest Winners = </strong> TotalWins + Rollback - TotalBets
        (+ve value) in last 7 days
      </p>
      <p>
        <strong>Biggest losers = </strong> TotalWins + Rollback - TotalBets (-
        ve value) in last 7 days
      </p>
      <ul>
        <li>
          <strong>TotalWins : </strong>Total amount the user has won in the last
          7 days.
        </li>
        <li>
          <strong>Rollback : </strong>Amount refunded or returned to the user
          (e.g., due to canceled bets or technical issues).
        </li>
        <li>
          <strong>TotalBets : </strong>Total amount the user has bet in the last
          7 days.
        </li>
      </ul>
      <p>
        <strong>Net = </strong>TotalWins + Rollback - TotalBets
      </p>
      <ul>
        <li>If Net &gt; 0 , the user has gained money → they are a winner</li>
        <li>If Net &lt; 0 , the user has lost money → they are a loser</li>
      </ul>
      <p>
        <strong>Examples:</strong>
      </p>
      <p>Example 1 - Winner: </p>
      <ul>
        <li> TotalWins = 500 SC </li>
        <li>Rollback = 50 SC </li>
        <li>TotalBets = 400 SC</li>
      </ul>

      <p>
        Net = 500 + 50 - 400 = 150 (positive) → This user is a winner with a net
        profit of 150 SC
      </p>

      <p> Example 2 - Loser:</p>
      <ul>
        <li>TotalWins = 300 SC </li>
        <li>Rollback = 0 SC </li>
        <li>TotalBets = 500 SC </li>
      </ul>

      <p>
        Net = 300 + 0 - 500 = -200 (negative) → This user is a loser with a net
        loss of 200 SC
      </p>
    </>
  );
};

export default BiggestWinnerAndLooserFormula;

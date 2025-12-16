import React from 'react';

const TotalBets = () => {
  return (
    <div>
      <p><strong>Definition:</strong> Total Bets refers to the cumulative sum of all bets placed by the user over time. This includes all bets made regardless of the time period. It represents the total amount wagered by the user.</p>
      <p><strong>Formula:</strong> Total Bets = Σ (All Bet Amounts)</p>
      <p><strong>Example:</strong> If a user placed bets of 100 SC in January, 200 SC in February, and 150 SC in March, the total bet amount would be:</p>
      <p><strong>Total Bets = 100 + 200 + 150 = 450 SC</strong></p>

      <h5> YTD (Year-to-Date) Total Bets</h5>
      <p><strong>Definition:</strong> YTD (Year-to-Date) Total Bets refers to the total value of bets placed from the beginning of the current year to the present day. This metric helps track how much the user has bet so far in the current year.</p>
      <p><strong>Formula:</strong> YTD Total Bets = Σ (All Bets from the Start of the Year to Present)</p>
      <p><strong>Example:</strong> If a user placed bets of 50 SC in January, 100 SC in February, and 50 SC in March, the YTD total bet amount would be:</p>
      <p><strong>YTD Total Bets = 50 + 100 + 50 = 200 SC</strong></p>

      <h5> Average Monthly Total Bets</h5>
      <p><strong>Definition:</strong> Average Monthly Total Bets represents the average amount bet by the user per month, calculated over the months up to and including the current month. This metric is useful for evaluating user betting behavior on a monthly basis. It is calculated for the current calendar year, starting from January 1st to the present date.</p>
      <p><strong>Formula:</strong> <strong>Average Monthly Total Bets = Σ (Monthly Bets) ÷ Number of Months Passed</strong></p>
      <p><strong>Example:</strong> Let&apos;s say the user placed bets as follows:</p>
      <ul>
        <li>January - 1200 SC</li>
        <li>February - 1500 SC</li>
        <li>March - 1000 SC</li>
        <li>April - 1300 SC (Let&apos;s say we are in the 15th of April)</li>
      </ul>
      <p>To calculate the average monthly total bets, we sum the total bet amounts for the months up to and including the current month (April):</p>
      <p><strong>Total Bets = 1200 + 1500 + 1000 + 1300 = 5000 SC</strong></p>

      <p><strong>Note: Assuming it is the 15th of a 30-day month, if we are calculating the average when the current month is not complete, we use the following formula to account for the number of days in the current month.</strong></p>
      <p><strong>Avg Monthly Total Bets = Total Bets from Jan 1st to Present / [No. of Months Passed + (No. of Days Until Present / Total Days in Current Month)]</strong></p>
      <p>For example, if we are in the 15th of April and have made bets totaling 5000 SC from January 1st to the present, with 3 months completed (January, February, March), and the current month (April) having 30 days, we would calculate as:</p>
      <p><strong>Avg Total Bets = 5000 / [3 + (15 / 30)]</strong></p>

      <h5> MTD (Month-to-Date) Total Bets</h5>
      <p><strong>Definition:</strong> MTD (Month-to-Date) Total Bets refers to the total value of bets placed by the user from the beginning of the current calendar month to the present date. It is useful for understanding the user’s betting behavior within the current month.</p>
      <p><strong>Formula:</strong> MTD Total Bets = Σ (Bets from the 1st of the Month to Present)</p>
      <p><strong>Example:</strong> If the user placed bets of 200 SC, 350 SC, and 450 SC in the current month, the total MTD bet would be:</p>
      <p><strong>MTD Total Bets = 200 + 350 + 450 = 1000 SC</strong></p>

      <h5> Last 7 Days Total Bets</h5>
      <p><strong>Definition:</strong> Last 7 Days Total Bets refers to the total amount wagered by the user over the most recent 7-day period. This metric provides a short-term view of user betting behavior.</p>
      <p><strong>Formula:</strong> Last 7 Days Total Bets = Σ (Bets from Last 7 Days Including Today)</p>
      <p><strong>Example:</strong> If the user placed bets of 20 SC, 40 SC, 30 SC, 50 SC, 100 SC, 200 SC, and 60 SC over the last 7 days, the total bet amount would be:</p>
      <p><strong>Last 7 Days Total Bets = 20 + 40 + 30 + 50 + 100 + 200 + 60 = 500 SC</strong></p>
    </div>
  );
};

export default TotalBets;
import React from 'react';

const HoldPercentage = () => {
  return (
    <div>
     
      <p><strong>Definition:</strong> Hold Percentage measures the proportion of total Sweep Coins wagered that is retained by the operator, expressed as a percentage of total SC won by users.</p>
      <p><strong>Formula:</strong> Hold Percentage = (Total SC Bet ÷ Total SC Win) * 100</p>
      <p><strong>Example:</strong> If total SC bet = 2000 and total SC win = 1500:<br />
        <strong>Hold Percentage = (2000 ÷ 1500) * 100 = 133.33%</strong></p>

      <h5> YTD (Year to Date) Hold Percentage</h5>
      <p><strong>Definition:</strong> YTD Hold Percentage calculates the hold percentage over all SC wagering from the start of the year to today.</p>
      <p><strong>Formula:</strong> YTD Hold % = (Σ SC Bet YTD ÷ Σ SC Win YTD) * 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>January: Bet 500, Win 400</li>
        <li>February: Bet 600, Win 550</li>
        <li>March: Bet 700, Win 600</li>
      </ul>
      <p>Σ SC Bet YTD = 500 + 600 + 700 = 1800<br />
        Σ SC Win YTD = 400 + 550 + 600 = 1550</p>
      <p><strong>YTD Hold % = (1800 ÷ 1550) * 100 ≈ 116.13%</strong></p>

      <h5> Average Monthly Hold Percentage</h5>
      <p><strong>Definition:</strong> Average Monthly Hold Percentage is the average of each month&apos;s Hold % over the months up to and including the current (possibly incomplete) month. It smooths out month to month volatility.It is calculated for the current calendar year, starting from January 1st to the present date.</p>
      <p><strong>Formula (Full Months):</strong><br />
        Average Monthly Hold % = Σ ((Monthly SC Bet ÷ Monthly SC Win) * 100) ÷ Number of Months passed</p>
      {/* <p><strong>Note for Incomplete Month:</strong><br/>
      When the current month isn&apos;t complete, adjust the denominator:<br/>
      <em>Adjusted Denominator</em> = Completed Months + (Days Passed in Current Month ÷ Total Days in Current Month)</p> */}
      <p><strong>Example:</strong></p>
      <ul>
        <li>January Hold % = 125%</li>
        <li>February Hold % = 109.09%</li>
        <li>March Hold % = 116.67%</li>
        <strong>April :</strong>   $114.29 (Let&apos;s say we are in the 15th of April)
      </ul>
      <p>Σ Monthly Hold % = 125 + 109.09 + 116.67 + 114.29 = 465.05</p>
      <p>
  <strong>
    Note: If the current month is not complete, we use the following formula to account for the number of days in the current month.
  </strong>
</p>

      <p>
        <strong>
          Avg Monthly Hold Percentage = Total hold Percentage from Jan 1st to Present /
          [No. of Months Passed + (No. of Days Until Present / Total Days in
          Current Month)]
        </strong>
      </p>
      <p>
        For example, if we are in the 15th of April and hold percentage
        totaling $465.05 from January 1st to present, with 3 months completed
        (January, February, March), and the current month (April) having 30
        days, we would calculate as:
      </p>

      <p><strong>Average Monthly Hold % = 465.05 ÷ (3+(15/30)) ≈ 132.87%</strong></p>

      <h5> MTD (Month to Date) Hold Percentage</h5>
      <p><strong>Definition:</strong> MTD Hold Percentage calculates hold over all SC wagering from the 1st of the current month through today.</p>
      <p><strong>Formula:</strong><br />
        MTD Hold % = (Σ SC Bet MTD ÷ Σ SC Win MTD) * 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>MTD SC Bet Total = 400 + 500 = 900</li>
        <li>MTD SC Win Total = 350 + 450 = 800</li>
      </ul>
      <p><strong>MTD Hold % = (900 ÷ 800) * 100 = 112.50%</strong></p>

      <h5> Last 7 Days Hold Percentage</h5>
      <p><strong>Definition:</strong> Last 7 Days Hold Percentage measures hold over SC wagering in the most recent 7 day window.</p>
      <p><strong>Formula:</strong><br />
        Last 7 Days Hold % = (Σ SC Bet 7d ÷ Σ SC Win 7d) * 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>7 Day SC Bet Total = 100 + 200 + 150 + 120 + 180 + 130 + 160 = 1040</li>
        <li>7 Day SC Win Total =  80 + 180 + 140 + 110 + 150 + 120 + 140 = 920</li>
      </ul>
      <p><strong>Last 7 Days Hold % = (1040 ÷ 920) * 100 ≈ 113.04%</strong></p>
    </div>
  );
};

export default HoldPercentage;

import React from "react";

const TotalPurchase = () => {
  return (
    <div>

      <p>
        <strong>Definition:</strong> Total Purchase refers to the cumulative amount of money a player has spent for playing casino games.
      </p>
      <p>
        <strong>Formula:</strong> Total Purchase = Σ (All Purchase Amounts)
      </p>
      <p>
        <strong>Example:</strong>A player makes the following purchases:

        <ul><li>FTP Package — $9.99</li></ul>
        <ul><li>Basic Package — $49.99</li></ul>

        The Total Purchase would be:
      </p>
      <p>
        <strong>Total Purchase = 9.99 + 49.99 = $59.98</strong>
      </p>

      <h5> YTD (Year-to-Date) Total Purchase</h5>
      <p>
        <strong>Definition:</strong> YTD (Year-to-Date) Total Purchase refers to
        the total value of purchases made from the beginning of the current year
        to the present day. This metric is used to track how much a user has
        spent so far in the current year.
      </p>
      <p>
        <strong>Formula:</strong> YTD Total Purchases = Σ (All Purchases from
        the Start of the Year to Today)
      </p>
      <p>
        <strong>Example:</strong> If a user spent $100 in January, $200 in
        February, and $50 in March, the YTD total purchase would be:
      </p>
      <p>
        <strong>YTD Total Purchase = 100 + 200 + 50 = $350</strong>
      </p>

      <h5> Average Monthly Total Purchase</h5>
      <p>
        <strong>Definition:</strong> Average Monthly Total Purchase represents
        the average amount spent by the user per month, calculated over the
        months up to and including the current month. This metric is useful for
        evaluating user spending behavior on a monthly basis.It is calculated for the current calendar year, starting from January 1st to the present date.
      </p>
      <p>
        <strong>Formula:</strong> Average Monthly Total Purchase = Σ (Monthly
        Purchases) ÷ Number of Months Passed
      </p>
      <p>
        <strong>Example:</strong> Let&apos;s say the user made purchases as follows:
      </p>
      <ul>
        <li>
          <strong>January</strong> - $1000
        </li>
        <li>
          <strong>February</strong> - $2000
        </li>
        <li>
          <strong>March</strong> - $1500
        </li>
        <li>
          <strong>April</strong> - $1300 (Let’s say we are in the 15th of April)
        </li>
      </ul>
      <p>
        To calculate the average monthly total purchase, we sum the total
        purchase amounts for the months up to and including the current month
        (April):
      </p>
      <p>
        <strong>Total Purchases = 1000 + 2000 + 1500 + 1300 = $5800</strong>
      </p>

      <p>
        <strong>Note: If the current month is not complete, we use the
        following formula to account for the number of days in the current
        month.
        </strong>
      </p>
      <p>
        <strong>
          Avg Monthly Total Purchase = Total Purchase from Jan 1st to Present /
          [No. of Months Passed + (No. of Days Until Present / Total Days in
          Current Month)]
        </strong>
      </p>
      <p>
        For example, if we are in the 15th of April and have made purchases
        totaling $5800 from January 1st to present, with 3 months completed
        (January, February, March), and the current month (April) having 30
        days, we would calculate as:
      </p>
      <p>
        <strong>Avg Total Purchase = 5800 / [3 + (15 / 30)]</strong>
      </p>

      <h5> MTD (Month-to-Date) Total Purchase</h5>
      <p>
        <strong>Definition:</strong> MTD (Month-to-Date) Total Purchase refers
        to the total value of purchases made by the user from the beginning of
        the current calendar month to the present date. It is useful for
        understanding the user’s purchasing behavior within the current month
        and evaluating how the user is performing relative to monthly goals or
        trends.
      </p>
      <p>
        <strong>Formula:</strong> MTD Total Purchases = Σ (Purchases from the
        1st of the Month to Today)
      </p>
      <p>
        <strong>Example:</strong> If the user made purchases of $200, $350, and
        $450 in the current month, the total MTD purchase would be:
      </p>
      <p>
        <strong>MTD Total Purchase = 200 + 350 + 450 = $1000</strong>
      </p>

      <h5> Last 7 Days Total Purchase</h5>
      <p>
        <strong>Definition:</strong> Last 7 Days Total Purchase refers to the
        total amount spent by the user over the most recent 7-day period. This
        metric provides a short-term view of user purchasing behavior and is
        useful for tracking recent trends in purchasing activity.
      </p>
      <p>
        <strong>Formula:</strong> Last 7 Days Total Purchases = Σ (Purchases
        from last 7 days including today)
      </p>
      <p>
        <strong>Example:</strong> If the user made purchases of $50, $25, $10,
        $15, $75, $1000, and $50 over the last 7 days, the total purchase amount
        for this period would be:
      </p>
      <p>
        <strong>
          Last 7 Days Total Purchase = 50 + 25 + 10 + 15 + 75 + 1000 + 50 =
          $1225
        </strong>
      </p>
    </div>
  );
};

export default TotalPurchase;

import React from "react";

const TotalRedemption = () => {
  return (
    <div>
      <p>
        <strong>Definition:</strong> Total Redemption refers to the cumulative
        sum of all redemptions made by the user over time. This includes all
        redemptions made regardless of the time period. It represents the total
        amount redeemed by the user.
      </p>
      <p>
        <strong>Formula:</strong> Total Redemption = Σ (All Redemption Amounts)
      </p>
      <p>
        <strong>Example:</strong> If a user made redemptions of $50 in January,
        $100 in February, and $75 in March, the total redemption would be:
      </p>
      <p>
        <strong>Total Redemption = 50 + 100 + 75 = $225</strong>
      </p>

      <h5> YTD (Year-to-Date) Total Redemption</h5>
      <p>
        <strong>Definition:</strong> YTD (Year-to-Date) Total Redemption refers
        to the total value of redemptions made from the beginning of the current
        year to the present day. This metric helps track how much the user has
        redeemed so far in the current year.
      </p>
      <p>
        <strong>Formula:</strong> YTD Total Redemptions = Σ (All Redemptions
        from the Start of the Year to Today)
      </p>
      <p>
        <strong>Example:</strong> If a user redeemed $50 in January, $100 in
        February, and $50 in March, the YTD total redemption would be:
      </p>
      <p>
        <strong>YTD Total Redemption = 50 + 100 + 50 = $200</strong>
      </p>

      <h5> Average Monthly Total Redemption</h5>
      <p>
        <strong>Definition:</strong> Average Monthly Total Redemption represents
        the average amount redeemed by the user per month, calculated over the
        months up to and including the current month. This metric is useful for
        evaluating user redemption behavior on a monthly basis.It is calculated
        for the current calendar year, starting from January 1st to the present
        date.
      </p>
      <p>
        <strong>Formula:</strong> Average Monthly Total Redemption = Σ (Monthly
        Redemptions) ÷ Number of Months passed
      </p>
      <p>
        <strong>Example:</strong> Let&apos;s say the user made redemptions as
        follows:
      </p>
      <ul>
        <li>January - $500</li>
        <li>February - $700</li>
        <li>March - $600</li>
        <li>April - $800 (Let&apos;s say we are in the 15th of April)</li>
      </ul>
      <p>
        To calculate the average monthly total redemption, we sum the total
        redemption amounts for the months up to and including the current month
        (April):
      </p>
      <p>
        <strong>Total Redemptions = 500 + 700 + 600 + 800 = $2600</strong>
      </p>

      <p>
        <strong>Note: Assuming it is the 15th of a 30-day month, if we
        are calculating the average when the current month is not complete, we
        use the following formula to account for the number of days in the
        current month.
        </strong>
      </p>
      <p>
        <strong>
          Avg Monthly Total Redemption = Total Redemption from Jan 1st to Today
          / [No. of Months Passed + (No. of Days Until Today / Total Days in
          Current Month)]
        </strong>
      </p>
      <p>
        For example, if we are in the 15th of April and have made redemptions
        totaling $2600 from January 1st to present, with 3 months completed
        (January, February, March), and the current month (April) having 30
        days, we would calculate as:
      </p>
      <p>
        <strong>Avg Total Redemption = 2600 / [3 + (15 / 30)]</strong>
      </p>

      <h5> MTD (Month-to-Date) Total Redemption</h5>
      <p>
        <strong>Definition:</strong> MTD (Month-to-Date) Total Redemption refers
        to the total value of redemptions made by the user from the beginning of
        the current calendar month to the present date. It is useful for
        understanding the user’s redemption behavior within the current month
        and evaluating how the user is performing relative to monthly goals or
        trends.
      </p>
      <p>
        <strong>Formula:</strong> MTD Total Redemptions = Σ (Redemptions from
        the 1st of the Month to Today)
      </p>
      <p>
        <strong>Example:</strong> If the user made redemptions of $200, $350,
        and $450 in the current month, the total MTD redemption would be:
      </p>
      <p>
        <strong>MTD Total Redemption = 200 + 350 + 450 = $1000</strong>
      </p>

      <h5> Last 7 Days Total Redemption</h5>
      <p>
        <strong>Definition:</strong> Last 7 Days Total Redemption refers to the
        total amount redeemed by the user over the most recent 7-day period.
        This metric provides a short-term view of user redemption behavior and
        is useful for tracking recent trends in redemption activity.
      </p>
      <p>
        <strong>Formula:</strong> Last 7 Days Total Redemptions = Σ (Redemptions
        from last 7 days including today)
      </p>
      <p>
        <strong>Example:</strong> If the user made redemptions of $20, $40, $30,
        $50, $100, $200, and $60 over the last 7 days, the total redemption
        amount for this period would be:
      </p>
      <p>
        <strong>
          Last 7 Days Total Redemption = 20 + 40 + 30 + 50 + 100 + 200 + 60 =
          $500
        </strong>
      </p>
    </div>
  );
};

export default TotalRedemption;

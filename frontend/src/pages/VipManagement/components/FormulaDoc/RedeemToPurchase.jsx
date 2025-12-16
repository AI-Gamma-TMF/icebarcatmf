import React from 'react'

const RedemptionToPurchaseRatio = () => {
  return (
    <div>
    
      <p><strong>Definition:</strong> This metric measures the percentage of total redemption amount relative to total purchase amount. It helps gauge how much of the purchased value is being redeemed.</p>
      <p><strong>Formula:</strong> Redemption to Purchase Ratio = (Total Redemption Amount / Total Purchase Amount) × 100</p>
      <p><strong>Example:</strong> If a user redeemed $500 and made purchases worth $2000:<br />
        <strong>Redemption to Purchase Ratio = (500 / 2000) × 100 = 25%</strong></p>

      <h5> YTD (Year-to-Date) Redemption to Purchase Ratio</h5>
      <p><strong>Definition:</strong> YTD Redemption to Purchase Ratio measures the percentage of redemptions relative to purchases from the beginning of the year up to the current date.</p>
      <p><strong>Formula:</strong> YTD RPR = (Σ YTD Redemption Amount / Σ YTD Purchase Amount) × 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>YTD Redemption = $400 (Jan) + $300 (Feb) + $500 (Mar) = $1200</li>
        <li>YTD Purchase = $1000 (Jan) + $1500 (Feb) + $2000 (Mar) = $4500</li>
      </ul>
      <p><strong>YTD Redemption to Purchase Ratio = (1200 / 4500) × 100 = 26.67%</strong></p>

      <h5> MTD (Month-to-Date) Redemption to Purchase Ratio</h5>
      <p><strong>Definition:</strong> MTD Redemption to Purchase Ratio shows how much users have redeemed in the current month compared to what they have purchased.</p>
      <p><strong>Formula:</strong> MTD RPR = (Σ MTD Redemption Amount / Σ MTD Purchase Amount) × 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>MTD Redemption = $150 (pending + approved)</li>
        <li>MTD Purchase = $600</li>
      </ul>
      <p><strong>MTD Redemption to Purchase Ratio = (150 / 600) × 100 = 25%</strong></p>

      <h5> Average Monthly Redemption to Purchase Ratio</h5>
      <p><strong>Definition:</strong> This represents the average monthly percentage of redemption relative to purchase, adjusted if the current month is not complete.It is calculated for the current calendar year, starting from January 1st to the present date.</p>
      <p><strong>Formula:</strong></p>
      <p>Average Monthly Redemption to Purchase Ratio = ((Total Redemption Jan 1 to Today / Total Purchase Jan 1 to Today) ÷ Effective Month Count) × 100</p>
      <p><strong>Effective Month Count =</strong> Completed Months + (Days in Current Month / Total Days in Current Month)</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>Total Redemption Jan 1–Apr 15 = $1400</li>
        <li>Total Purchase Jan 1–Apr 15 = $4800</li>
        <li>Completed Months = 3 (Jan, Feb, Mar)</li>
        <li>Current day = 15, Total days in April = 30</li>
        <li>Effective Month Count = 3 + (15 / 30) = 3.5</li>
      </ul>
      <p>Average Monthly RPR = ((1400 / 4800) ÷ 3.5 )× 100 = (0.2917 ÷ 3.5 )× 100 ≈ 8.33%</p>

      <h5> Last 7 Days Redemption to Purchase Ratio</h5>
      <p><strong>Definition:</strong> This metric represents the redemption percentage compared to purchases over the most recent 7-day period.</p>
      <p><strong>Formula:</strong> Last 7 Days RPR = (Σ Redemption (7 days) / Σ Purchase (7 days)) × 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>Redemption over last 7 days = $400</li>
        <li>Purchase over last 7 days = $1600</li>
      </ul>
      <p><strong>Last 7 Days Redemption to Purchase Ratio = (400 / 1600) × 100 = 25%</strong></p>
    </div>
  )
}

export default RedemptionToPurchaseRatio

import React from 'react'

const ReinvestmentPercentage = () => {
  return (
    <div>
      <p><strong>Definition:</strong> Reinvestment Percentage measures the portion of total SC losses that are reinvested back into users through various bonuses (Site Bonus, Admin Bonus, and Purchase Bonus). A higher percentage indicates greater SC returned to users.</p>
      <p><strong>Formula:</strong> Reinvestment Percentage = [(Site Bonus SC + Admin Bonus SC + Purchase Bonus SC) / Total SC Loss] × 100</p>

      <h6>Where:</h6>
      <ul>
        <li><strong>Site Bonus SC</strong> = CRM Bonus + Package Purchase Bonus + Affiliate Bonus + Daily Bonus + Weekly Bonus + Monthly Bonus + Refer-a-Friend Bonus + Tournament Bonus + Giveaway Bonus (only SC)</li>
        <li><strong>Admin Bonus SC</strong> = SC added by Admin − SC deducted by Admin</li>
        <li><strong>Total SC Loss</strong> = Total SC Bets − Total SC Wins</li>
      </ul>

      <p><strong>Example:</strong> If a user receives 200 Site Bonus SC, 100 Admin Bonus SC, and 150 Purchase Bonus SC, and their total SC loss is 1000.</p>
      <p><strong>Reinvestment % = [ (200 + 100 + 150) / 1000 ] × 100 = 45%</strong></p>

      <h5>YTD (Year-to-Date) Reinvestment Percentage</h5>
      <p><strong>Definition:</strong> YTD Reinvestment Percentage calculates the total SC bonuses given to users year-to-date as a proportion of their total SC losses over the same period.</p>
      <p><strong>Formula:</strong> YTD Reinvestment % = [ (Σ Site + Σ Admin + Σ Purchase Bonuses YTD) / (Σ Total SC Loss YTD) ] × 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>YTD Bonuses till now in this year: Site = 500, Admin = 400, Purchase = 300</li>
        <li>Total SC Loss YTD = 2500</li>
      </ul>
      <p><strong>YTD Reinvestment % = [(500 + 400 + 300) / 2500] × 100 = 48%</strong></p>

      <h5>MTD (Month-to-Date) Reinvestment Percentage</h5>
      <p><strong>Definition:</strong> MTD Reinvestment Percentage represents the reinvestment rate for the current calendar month.</p>
      <p><strong>Formula:</strong> MTD Reinvestment % = [(Σ Site + Σ Admin + Σ Purchase Bonuses MTD) / (Σ Total SC Loss MTD)] × 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>MTD Bonuses till now in this month: Site = 100, Admin = 80, Purchase = 70</li>
        <li>MTD SC Loss = 700</li>
      </ul>
      <p><strong>MTD Reinvestment % = [(100 + 80 + 70) / 700] × 100 = 35.71%</strong></p>

      <h5>Average Monthly Reinvestment Percentage</h5>
      <p><strong>Definition:</strong> This metric shows the average percentage of SC bonuses reinvested each month relative to SC losses, adjusting for incomplete months. It is calculated for the current calendar year, starting from January 1st to the present date.</p>
      <p><strong>Formula:</strong> Avg Monthly Reinvestment % = [(Σ Site + Σ Admin + Σ Purchase Bonuses MTD) / (Σ Total SC Loss MTD) ÷ Effective Month Count] × 100</p>
      <p><strong>Effective Month Count:</strong> Completed Months + (Days Passed in Current Month / Total Days in Current Month)</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>Bonuses Jan 1–Apr 15 = Site (400), Admin (300), Purchase (250) = 950</li>
        <li>Total SC Loss Jan 1–Apr 15 = 3100</li>
        <li>Completed Months = 3</li>
        <li>Days Passed = 15, Total Days = 30 ⇒ Effective Month Count = 3 + (15/30) = 3.5</li>
      </ul>
      <p><strong>Average Monthly Reinvestment % = [(950 / 3100) ÷ 3.5] × 100 ≈ 8.73%</strong></p>

      <h5>Last 7 Days Reinvestment Percentage</h5>
      <p><strong>Definition:</strong> This version of the metric focuses on bonuses given and SC losses from the past 7 days only.</p>
      <p><strong>Formula:</strong> Last 7 Days Reinvestment % = (Σ Bonuses Last 7 Days / Σ SC Loss Last 7 Days) × 100</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>Site Bonus = 60, Admin Bonus = 40, Purchase Bonus = 30</li>
        <li>Total SC Loss = 500</li>
      </ul>
      <p><strong>Last 7 Days Reinvestment % = [(60 + 40 + 30) / 500 ] × 100 = 26%</strong></p>
    </div>
  )
}

export default ReinvestmentPercentage

import React from "react";

const ScRewardBonus = () => {

  return (
    <div>
      <p>
        The <strong>SC Reward Bonus </strong>is a performance-based incentive
        awarded to users. It begins with a base SC for completing the
        questionnaire and increases based on the user&apos;s Net Gaming Revenue
        (NGR). The bonus is capped at maximum SC and is rounded to the nearest
        multiplier of 5.
      </p>
      <p>
        <strong>SC Reward = </strong> MIN( MAX ( RoundToNearest5 ( Minimum VIP
        Questionnaire SC Reward + ( VIP questionnaire NGR multiplier * NGR ) ),
        Minimum VIP Questionnaire SC Reward) , Maximum VIP Questionnaire SC
        Reward)
        <p>
          <strong>Note : </strong> Admins can update the Minimum VIP
          Questionnaire SC Reward (SC Base Value) , Maximum VIP Questionnaire SC
          Reward (Cap Value) , and Vip Questionnaire NGR multiplier from the
          Site Configuration settings.
        </p>
        <p> For Example:</p>
        <ul>
          <li>Minimum VIP Questionnaire SC Reward / SC Base Value - 5 SC </li>
          <li>Maximum VIP Questionnaire SC Reward / Cap Value - 150 SC</li>
          <li>Vip Questionnaire NGR multiplier - 0.0075</li>
        </ul>
      </p>
      <p>
        <strong>NGR : </strong> Net Gaming Revenue
      </p>
      <li>
        Base Reward = 5 SC
        <p>
          Every user who completes the questionnaire automatically earns a base
          reward of 5 SC.
        </p>
      </li>
      <li>
        {" "}
        NGR Bonus: NGR * 0.0075
        <p>
          An additional 0.75% bonus is calculated based on Net Gaming Revenue
          (NGR).
        </p>
        <p>
          Example: If NGR is 100 SC = 100 x 0.0075 = {eval(100 * 0.0075)} SC
        </p>
      </li>
      <li>
        Maximum Cap = 150 SC
        <p>
          The total reward will never exceed 150 SC, no matter how high NGR
          goes.
        </p>
      </li>
      <li>
        Rounded to nearest 5 
        <p>
          Once the total is calculated, it is rounded to the nearest multiple of
          5  for simplicity.
        </p>
        <ul>
          <li>132 SC =&gt; 130 SC</li>
          <li>133 SC =&gt; 135 SC</li>
          <li>127 SC =&gt; 125 SC</li>
        </ul>
      </li>
      <h6>Examples : </h6>
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">NGR</th>
            <th className="border px-4 py-2">Calculation</th>
            <th className="border px-4 py-2">SC Reward (before clamp)</th>
            <th className="border px-4 py-2">SC Reward (after clamp)</th>
          </tr>
        </thead>
        <tbody>
          {[
            [
              "1000",

              "5 + (1000 x 0.0075)",

              "5 + 7.5",

              "15 (nearest multiplier of 5 to 12.5)",
            ],
            [
              "1,00,500",
              "5 + (100500 x 0.0075) ",
              "5 + 753.75",

              "150 (maximum capped value is 758.75)",
            ],
            [
              "-10",
              "-10 + (-10 x 0.0075)",
              "-10 + (-0.075)",
              "5 (base value -10.075)",
            ],
          ].map(([ngr, calculation, scRewardBefore, scRewardAfter], index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{ngr}</td>
              <td className="border px-4 py-2">{calculation}</td>
              <td className="border px-4 py-2">{scRewardBefore}</td>
              <td className="border px-4 py-2">{scRewardAfter}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScRewardBonus;

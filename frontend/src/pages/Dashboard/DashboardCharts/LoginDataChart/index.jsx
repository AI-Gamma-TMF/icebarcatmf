import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useDashboardDataListing from "../../hooks/useDashboardData";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LoginDataChart({ loginData }) {
  const { t } = useDashboardDataListing();
  const logindata = loginData.filter(x=> x.label != 'loginKeys.CURRENT_LOGIN')
  const labelList = logindata.map((data) => `${t(data.label)}`);
  const totalData = logindata.map((data) => t(data.TODAY));
  const data = {
    labels: labelList,
    datasets: [
      {
        data: totalData,
        backgroundColor: ["rgb(194,230,153)", "rgb(49,163,84)"],
        borderColor: ["rgb(0, 136, 254)", "rgb(0, 196, 159)"],
        borderWidth: 1,
        width: "300px",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Online Players",
      },
    },
  };

  return (
    <div className="login-pie-chart-container">
      <Doughnut data={data} options={options} />
    </div>
  );
}

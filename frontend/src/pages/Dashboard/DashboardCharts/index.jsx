import React from "react"
import "./dashboardChart.scss";
import { originalObject } from "../constants";
import { prepareGroupedObject } from "./utils";
import MultiChartContainer from "./MultiChartContainer";
import { Card, Col } from "@themesberg/react-bootstrap";
import Ticker from "./Ticker";
const DashboardCharts = ({
  customerData,
  loginData,
  economyData,
  transactionData,
  dashboardDataV2,
}) => {
  Object.keys(originalObject).forEach((section) => {
    originalObject[section].TODAY = Math.floor(Math.random() * 50);
    originalObject[section].YESTERDAY = Math.floor(Math.random() * 50);
    originalObject[section].MONTH_TO_DATE = Math.floor(Math.random() * 50) + 1;
    originalObject[section].LAST_MONTH = Math.floor(Math.random() * 50);
    originalObject[section].CUSTOM = Math.floor(Math.random() * 50) + 1;
  });

  const dashboardData = prepareGroupedObject(
    originalObject,
    customerData,
    loginData,
    transactionData,
    economyData
  );

  return (
    <>
      <div className="customer-chart-container w-100">
        <div className="w-100">
          <Col sm={12} className="d-flex justify-center">
            <MultiChartContainer data={dashboardDataV2} />
          </Col>
          {/* <Col lg={4} sm={12}> */}
          {/* <LoginDataChart loginData={dashboardData.Login_Data} /> */}
          {/* </Col> */}
          <Col lg={12} sm={12} className="card-ticker">
            <Card className="border-0 w-100">
              <Ticker
                loginData={dashboardData.Login_Data}
                data={dashboardDataV2}
              />
            </Card>
          </Col>
        </div>
      </div>
      {/* <CustomerDataChart customerData={dashboardData.Customers_Data} /> */}
    </>
  );
};

export default React.memo(DashboardCharts);

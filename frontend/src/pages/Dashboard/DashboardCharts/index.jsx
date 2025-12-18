import React from "react"
import "./dashboardChart.scss";
import MultiChartContainer from "./MultiChartContainer";
import { Card, Col } from "@themesberg/react-bootstrap";
import Ticker from "./Ticker";
const DashboardCharts = ({
  customerData,
  loginData,
  economyData,
  transactionData,
  dashboardDataV2,
  bonusDataV2,
  bonusRefetchV2,
}) => {
  // Perf: Legacy "prepareGroupedObject" and randomization were unused by the current UI.
  // Keeping props for future charts but avoiding extra CPU work on every render.

  return (
    <>
      <div className="customer-chart-container w-100">
        <div className="w-100">
          <Col sm={12} className="d-flex justify-center">
            <MultiChartContainer
              data={dashboardDataV2}
              bonusDataV2={bonusDataV2}
              bonusRefetchV2={bonusRefetchV2}
            />
          </Col>
          {/* <Col lg={4} sm={12}> */}
          {/* <LoginDataChart loginData={dashboardData.Login_Data} /> */}
          {/* </Col> */}
          <Col lg={12} sm={12} className="card-ticker">
            <Card className="border-0 w-100">
              <Ticker
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

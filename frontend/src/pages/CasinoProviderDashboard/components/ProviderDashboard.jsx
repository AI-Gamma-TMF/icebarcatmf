import { Row, Col, Card } from "@themesberg/react-bootstrap";

import "../_provider.scss";
import ProviderDashboardTable from "./ProviderDashboardTable";
import { InlineLoader } from "../../../components/Preloader";
import { PieChart } from "../charts/PieChart";
import useProviderRateMatrixListing from "../hooks/useProviderRateMatrixListing";

const ProviderDashboard = ({ isHitoricalTab }) => {
  const {
    providerId,
    setProviderId,
    providerNameOptions,
    providerInfo,
    providerInfoLoading,
    aggregatorNameOptions,
    aggregatorId,
    setAggregatorId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useProviderRateMatrixListing(isHitoricalTab)


  return (
    <Row className="mb-2 mt-4 provider-dashboard-content">
      <Col xs={12}>
        <h5 className="provider-dashboard-content__subtitle mb-3">Provider Details</h5>
      </Col>

      <Col md={12} sm={12} className="my-3">
        <Card className="provider-dashboard-content__chart-card">
          <Card.Body>
            <h4 className="provider-dashboard-content__chart-title">Provider GGR % Share</h4>
            {providerInfo?.percentageTotalGGRSum > 0 ? <>
              {providerInfoLoading ? (
                <InlineLoader />
              ) : (
                <PieChart
                  providerInfo={providerInfo}
                  providerInfoLoading={providerInfoLoading}
                />)
              }</> :
              <div className="text-center provider-dashboard-content__no-data">
                There is no graph data available.
              </div>}
          </Card.Body>
        </Card>
      </Col>
      <Row>
        <Col>
          <ProviderDashboardTable
            isHitoricalTab={isHitoricalTab}
            providerId={providerId}
            setProviderId={setProviderId}
            providerNameOptions={providerNameOptions}
            providerInfo={providerInfo}
            providerInfoLoading={providerInfoLoading}
            aggregatorNameOptions={aggregatorNameOptions}
            aggregatorId={aggregatorId}
            setAggregatorId={setAggregatorId}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />

        </Col>
      </Row>
    </Row>
  );
};

export default ProviderDashboard;

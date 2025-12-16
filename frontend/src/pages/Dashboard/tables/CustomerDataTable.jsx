import { Col, Row, Table } from "@themesberg/react-bootstrap";
import { totalTablesList, tableData } from "../constants";
import { InlineLoader } from "../../../components/Preloader";
import { formatPriceWithCommas } from "../../../utils/helper";

const CustomerTable = ({

  t,
  customerDataV2,
  customerLoadingV2,
  playerType,
          // customerRefetchV2
          // customerRefetchV2
}) => {

  return (
    <>
        <Row className="mt-4 align-items-center">
          <Col>
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <h5 className="mb-0">
                {t(`headers.customerDataKeys`)} {t("headers.data")}
              </h5>
            
            </div>
          </Col>
        </Row>

        <hr></hr>

        <div className="table-responsive">
          <Table bordered striped hover size="sm" className="text-center">
            <thead className="thead-dark">
              <tr>
                <th className="text-left" style={{ width: "500px" }}>
                  {t("table.parameters")}
                </th>
                <th>{t("table.today")}</th>
                <th>{t("table.yesterday")}</th>
                <th>{t("table.monthToDate")}</th>
                <th>{t("table.lastMonth")}</th>
                <th>{t("table.tillDate")}</th>
                <th>{t("table.selectedDate")}</th>
              </tr>
            </thead>

            { (playerType !== "internal" ?
              <tbody>
                {customerLoadingV2 ? (
                  <tr>
                    <td colSpan={10}>
                      <InlineLoader />
                    </td>
                  </tr>
                ) : customerDataV2 && Object.keys(customerDataV2)?.length ? (
                  Object.keys(customerDataV2)?.map((data, i) => {
                    return (
                      Object.keys(
                        totalTablesList["customerDataKeysV2"]
                      ).includes(data) && (
                        <tr key={i}>
                          <td className="text-left">
                            {t(totalTablesList["customerDataKeysV2"][data])}
                          </td>
                          {tableData?.map((ele) => (
                            <td key={ele}>
                              {formatPriceWithCommas(
                                customerDataV2?.[data]?.[ele] || 0
                              )}
                            </td>
                          ))}
                        </tr>
                      )
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center text-danger">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>:
              (
                <tbody>
                {customerLoadingV2 ? (
                  <tr>
                    <td colSpan={10}>
                      <InlineLoader />
                    </td>
                  </tr>
                ) : customerDataV2 && Object.keys(customerDataV2)?.length ? (
                  Object.keys(customerDataV2)?.map((data, i) => {
                    return (
                      Object.keys(
                        totalTablesList["customerDataKeysInternal"]
                      ).includes(data) && (
                        <tr key={i}>
                          <td className="text-left">
                            {t(totalTablesList["customerDataKeysInternal"][data])}
                          </td>
                          {tableData?.map((ele) => (
                            <td key={ele}>
                              {formatPriceWithCommas(
                                customerDataV2?.[data]?.[ele] || 0
                              )}
                            </td>
                          ))}
                        </tr>
                      )
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center text-danger">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
              )
            )}
          </Table>
        </div>
    </>
  );
};
export default CustomerTable;

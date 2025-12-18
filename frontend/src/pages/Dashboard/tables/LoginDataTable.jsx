import React from "react";
import { Row, Table, Button, Spinner } from "@themesberg/react-bootstrap";
import { totalTablesList, tableData } from "../constants";
import { InlineLoader } from "../../../components/Preloader";
import { formatPriceWithCommas } from "../../../utils/helper";

const LoginDataTable = ({
  reportLoading,
  reportData,
  t,
  reportTillData,
  reportTillLoading,
  reportTillRefetch,
  isReportTillRefetching,
}) => {
  const isTillBusy = reportTillLoading || isReportTillRefetching;



 
  

  
  return (
    <>
        <Row className="mt-4 dashboard-section-heading">
          <h5>
            {t(`headers.loginData`)} {t("headers.data")}
          </h5>
        </Row>
        <hr className="dashboard-section-divider" />

        <div className="table-responsive dashboard-table">
          <Table size="sm" className="text-center dashboard-data-table">
            <thead>
              <tr>
                <th className="text-left dashboard-data-table__param">
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

            <tbody>
  {reportLoading ? (
    <tr>
      <td colSpan={10}>
        <InlineLoader />
      </td>
    </tr>
  ) : reportData && Object.keys(reportData)?.length ? (
    Object.keys(reportData)?.map((data, i) => {
      return (
        Object.keys(totalTablesList["loginData"]).includes(data) && (
          <tr key={i}>
            <td className="text-left dashboard-data-table__param">
              {t(totalTablesList["loginData"][data])}
            </td>
            {tableData?.map((ele) => (
             <td key={ele}>
             {ele === 'TILL_DATE' ? (
               reportTillData?.[data] ? (
                 formatPriceWithCommas(reportTillData[data])
               ) : (
                 <Button
                   className="dashboard-table__action-btn"
                   onClick={() => reportTillRefetch()}
                   disabled={isTillBusy}
                 >
                   {isTillBusy ? (
                     <>
                       Loading
                       <Spinner
                         as="span"
                         animation="border"
                         size="sm"
                         role="status"
                         aria-hidden="true"
                       />
                     </>
                   ) : (
                     "Show"
                   )}
                 </Button>
               )
             ) : (
               formatPriceWithCommas(reportData?.[data]?.[ele] || 0)
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


          </Table>
        </div>
    </>
  );
};
export default LoginDataTable;

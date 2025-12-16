import React from "react";
import { Modal,  Table } from "@themesberg/react-bootstrap";
import { getDateTime } from "../../../utils/dateFormatter";
import { InlineLoader } from "../../../components/Preloader";
import { STATUS_LABELS } from "../constant";

const ImortedPromocodesCsvModel = ({
  show,
  setShow,
  // handleYes,
  loading,
  importedPromocodesData
}) => {

  return (
    <Modal
      size="lg"
      show={show}
      onHide={() => {
        setShow(false);
        //setImportedFile(null)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Imported Promocodes Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h5 style={{ textAlign: 'center', fontWeight: 700 }}>
            {importedPromocodesData?.message}
          </h5>
        </div>

        {importedPromocodesData?.data?.createdPromocodes.length > 0 &&
          <>
            <h5>
              Created Promocode details :
            </h5>
            <Table
              bordered
              striped
              responsive
              hover
              size="sm"
              className="text-center"
            >
              <thead className="thead-dark">
                <tr>
                  <th>promocode</th>
                  <th>Discount/Bonus %</th>
                  {/* <th>max Users Availed</th> */}
                  {/* <th>per User Limit</th> */}
                  <th>Status</th>
                  <th>valid From</th>
                  <th>valid Till</th>
                  {/* <th>description</th> */}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : importedPromocodesData?.data?.createdPromocodes.length > 0 ? (
                  importedPromocodesData?.data?.createdPromocodes.map(
                    ({
                      promocode,
                      discountOnAmount,
                      discountPercentage,
                      validFrom,
                      validTill,
                      status
                    }) => (
                      <tr key={promocode}>
                        <td>{promocode}</td>
                        <td>{discountPercentage} {discountOnAmount ? "% Discount" : "% Bonus"}</td>
                        {/* <td>{maxUsersAvailed === null ? "-" : maxUsersAvailed}</td> */}
                        {/* <td>{perUserLimit}</td> */}
                        <td>{STATUS_LABELS[status] || '-'}</td>
                        <td>{validFrom === null ? "-" : getDateTime(validFrom)}</td>
                        <td>{validTill === null ? "-" : getDateTime(validTill)}</td>
                        {/* <td>{description}</td> */}

                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-danger text-center">
                      No Data Found
                    </td>
                  </tr>
                )
                }
              </tbody>
            </Table>
          </>
        }

        {importedPromocodesData?.data?.rejectedPromocodes.length > 0 &&
          <>
            <h5>
              Rejected Promocode details :
            </h5>

            <Table
              bordered
              striped
              responsive
              hover
              size="sm"
              className="text-center"
            >
              <thead className="thead-dark">
                <tr>
                  <th>promocode</th>
                  {/* <th>Discount/Bonus %</th> */}
                  {/* <th>max Users Availed</th> */}
                  {/* <th>per User Limit</th> */}
                  {/* <th>description</th> */}
                  <th>valid From</th>
                  <th>valid Till</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : importedPromocodesData?.data?.rejectedPromocodes.length > 0 ? (
                  importedPromocodesData?.data?.rejectedPromocodes.map(
                    ({
                      promocode,
                      validFrom,
                      validTill,
                      reason
                    }) => (
                      <tr key={promocode}>
                        <td>{promocode}</td>
                        {/* <td>{discountPercentage} {discountOnAmount ? "% Discount" : "% Bonus"}</td> */}
                        {/* <td>{maxUsersAvailed === null ? "-" : maxUsersAvailed}</td> */}
                        {/* <td>{perUserLimit}</td> */}
                        {/* <td>{description}</td> */}
                        <td>{validFrom === null ? "-" : getDateTime(validFrom)}</td>
                        <td>{validTill === null ? "-" : getDateTime(validTill)}</td>
                        <td>{reason}</td>

                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-danger text-center">
                      No Data Found
                    </td>
                  </tr>
                )
                }
              </tbody>
            </Table>
          </>
        }

        </Modal.Body>
    </Modal>
  );
};

export default ImortedPromocodesCsvModel;

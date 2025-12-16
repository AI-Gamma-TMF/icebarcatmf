import React from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Table,
} from "@themesberg/react-bootstrap";
import useUnarchive from "../hooks/useUnarchive";
import { InlineLoader } from "../../../components/Preloader";
import PaginationComponent from "../../../components/Pagination";
import { faRedoAlt ,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  RestoreConfirmationModal,
} from "../../../components/ConfirmationModal";
import { AdminRoutes } from "../../../routes";

function UnarchivePage() {
  const {
    navigate,
    limit,
    setLimit,
    page,
    setPage,
    // setOrderBy,
    // sort,
    // setSort,
    // search,
    // setSearch,
    // over,
    // setOver,
    // handleShow,
    // selected,
    // active,
    // handleDeleteYes,
    // setHot,
    // setIsActive,
    // isActive,
    // fetchData,
    // handleRestoreModal,
    show,
    setShow,
    data,
    totalPages,
    handleYes,
    loading,
    packageName,
    setPackageName,
    restoreLoading,
  } = useUnarchive();
  const resetFilters = () => {
    setLimit(15);
    setPage(1), setPackageName("");
  };
  return (
    <>
      <Row>
        <Col xs="9">
          <h3>Archived Packages</h3>
        </Col>
      </Row>

      <Row className="w-100 m-auto">
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{
              marginBottom: "0",
              marginRight: "15px",
              marginTop: "5px",
            }}
          >
            Package Name
          </Form.Label>

          <Form.Control
            type="text"
            value={packageName}
            placeholder="Search by Package Name "
            onChange={(event) => {
              setPage(1);
              setPackageName(
                event.target.value
                  .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric characters (except spaces)
                  .replace(/\s+/g, " ") // Replace multiple spaces with a single space
              );
            }}
          />
        </Col>

        <Col
          xs="12"
          sm="6"
          lg="1"
          className="d-flex align-items-end mt-2 mt-sm-0 mb-0 mb-sm-3"
        >
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            className=""
            onClick={resetFilters}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>
        </Col>
      </Row>

      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className="text-center mt-4"
      >
        <thead className="thead-dark">
          <tr>
            {[
              "ID",
              "PACKAGE NAME",
              "AMOUNT",
              "GC + Bonus GC Coin",
              "SC + Bonus SC Coin",

              "PACKAGE TYPE",
              "ACTION",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.rows?.map(
              ({
                packageId,
                packageName,
                amount,
                gcCoin,
                scCoin,
                welcomePurchaseBonusApplicable,
                isSpecialPackage,
                firstPurchaseApplicable,
                bonusGc,
                bonusSc,
              }) => {
                return (
                  <tr key={packageId}>
                    <td>
                      {packageId}{" "}
                      {welcomePurchaseBonusApplicable && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </td>

                    <td>{packageName ? packageName : "-"}</td>
                    <td>
                      <span>{amount}</span>
                    </td>
                    <td>
                      <span>
                        {gcCoin} + {bonusGc}
                      </span>
                    </td>
                    <td>
                      {scCoin} + {bonusSc}
                    </td>

                    <td>
                      {welcomePurchaseBonusApplicable
                        ? "Welcome Purchase Package"
                        : firstPurchaseApplicable && isSpecialPackage
                        ? "Special First Purchase Package"
                        : firstPurchaseApplicable
                        ? "First Purchase Package"
                        : isSpecialPackage
                        ? "Special Package"
                        : "Basic Package"}
                    </td>
                    <td>
                      <>
                        <Trigger message={"View"} id={packageId + "view"} />
                        <Button
                          id={packageId + "view"}
                          className="m-1"
                          size="sm"
                          variant="info"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.ViewArchivePackages.split(
                                ":"
                              ).shift()}${packageId}`
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        {/* <Trigger
                          message={"restore packages"}
                          id={packageId + "restore"}
                        />
                        <Button
                          id={packageId + "restore"}
                          className="m-1"
                          size="sm"
                          variant="warning"
                          onClick={() => handleRestoreModal(packageId)}
                        >
                          <FontAwesomeIcon icon={faBoxArchive} />
                        </Button> */}
                      </>
                    </td>
                  </tr>
                );
              }
            )}
          {data?.count === 0 && (
            <tr>
              <td colSpan={9} className="text-danger text-center">
                NO DATA FOUND
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {loading && <InlineLoader />}
      {data?.count !== 0 && (
        <PaginationComponent
          page={data?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      {show && (
        <RestoreConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          loading={restoreLoading}
        />
      )}
    </>
  );
}

export default UnarchivePage;

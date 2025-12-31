import React, { useRef } from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Card
} from "@themesberg/react-bootstrap";
import { tableHeaders, STATUS_LABELS } from "./constant";
import { getDateTime } from "../../utils/dateFormatter";
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown, faArrowAltCircleUp, faEdit, faEye } from "@fortawesome/free-regular-svg-icons";
import { faInfoCircle , faTrash, faRecycle } from "@fortawesome/free-solid-svg-icons";
import { AdminRoutes } from "../../routes";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../components/Pagination";
import { InlineLoader } from "../../components/Preloader";
import { ConfirmationModal, DeleteConfirmationModal } from "../../components/ConfirmationModal";
import { ReuseConfirmationModal } from "./component/ReuseConfirmationModal";
import { formatPriceWithCommas } from "../../utils/helper";
import useCheckPermission from "../../utils/checkPermission";
import usePromoCodeListing from "./hooks/usePromoCodeListing";
import ImportCsvModal from "../EmailCenter/components/importCsvModel";
// import { timeZones } from "../Dashboard/constants";
import { getItem } from "../../utils/storageUtils";
import ImortedPromocodesCsvModel from "./component/ImortedPromocodesCsvModel";
import PurchasePromocodeFilters from "./component/PromocodeFilters/PurchasePromocodeFilters";
import "./promocodeListing.scss";

const PromoCodeBonus = () => {
  const navigate = useNavigate()
  const { promoCodeList, selected, loading, page, totalPages, setPage, limit, setLimit, show, setShow, handleYes, active,
    handleDelete, handleDeleteYes, deleteModalShow, setDeleteModalShow, setSearch, search, setOrderBy, sort, over, setOver, setSort, deleteLoading, updateloading, reuseModalShow, setReuseModalShow, handleReusePromocodeYes, handleReuseModal, reuseLoading,
    status, setStatus, selectedMaxUsersAvailed, selectedPerUserLimit,

    importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    uploadCSV,
    importAction,
    setImportAction,
    discountPercentage,
    setDiscountPercentage,
    maxUsersAvailed,
    setMaxUsersAvailed,
    validTill,
    setValidTill,
    validFrom,
    setValidFrom,
    showImportedPromocodes, setShowImportedPromocodes, importedPromocodesData
  }
    = usePromoCodeListing();
  const { isHidden } = useCheckPermission()
                                                                       

  const fileInputRef = useRef(null);

  const handleImportChange = (e) => {
    const file = e.target.files[0];
    setImportedFile(e.target.files[0]);
    if (file) {
      setImportModalShow(true);
    }
    // Reset the input value to allow re-selection
    e.target.value = null;
  };

  const timeZone = getItem("timezone");

  // const timezoneOffset =
  //   timeZone != null
  //     ? timeZones.find((x) => x.code === timeZone).value
  //     : getFormattedTimeZoneOffset();

  const handleCSVSumbit = () => {
    const formData = new FormData();
    formData.append("file", importedFile);
    formData.append("timezone", timeZone);
    uploadCSV(formData);
  };

  const handlePromocodeSumbit = () => {
    setShowImportedPromocodes(false)
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleDownload = () => {
    // using Hardcoded URL as the file is already uploaded in Prod
    // const downloadUrl = "https://mfactory-prod-storage.s3.us-east-1.amazonaws.com/players_csv_download/SampleCSVforCreatePromocode.csv";
    const downloadUrl = "https://docs.google.com/spreadsheets/d/1nhuADEGdLQ9R9r01d8xXZwJQKjb5v3S2074vkJPQ8RQ/edit?usp=sharing"

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
                                                          
  return (
    <>
      <div className="dashboard-typography purchase-promocode-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="purchase-promocode-page__title">Purchase Promo Codes</h3>
            <p className="purchase-promocode-page__subtitle">
              Create and manage purchase promo codes and their status
            </p>
          </div>

          <div className="purchase-promocode-page__actions">
            <Button
              variant="primary"
              className="purchase-promocode-page__create-btn"
              hidden={isHidden({ module: { key: "Promocode", value: "C" } })}
              size="sm"
              onClick={() => {
                navigate(AdminRoutes.PromoCodeCreate);
              }}
            >
              Create
            </Button>

            <div>
              <Trigger
                message="Please download the CSV file, fill in the details, and then import it here."
                id={"csvFileInput"}
              />
              <Button
                variant="secondary"
                className="purchase-promocode-page__action-btn"
                size="sm"
                onClick={handleImportClick}
                type="button"
                id={"csvFileInput"}
                hidden={isHidden({
                  module: { key: "Promocode", value: "C" },
                })}
              >
                Import CSV
              </Button>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleImportChange}
                style={{ display: "none" }}
              />
            </div>

            <Button
              variant="outline-warning"
              className="purchase-promocode-page__action-btn"
              hidden={isHidden({ module: { key: "Promocode", value: "C" } })}
              size="sm"
              onClick={() => {
                navigate(AdminRoutes.PromocodeArchived);
              }}
            >
              Archived
            </Button>

            <Trigger message="Click to download a sample CSV file for reference" id="sampleCsvTooltip" />
            <Button
              id="sampleCsvTooltip"
              className="purchase-promocode-page__icon-btn"
              variant="link"
              size="sm"
              onClick={handleDownload}
              hidden={isHidden({
                module: { key: "Promocode", value: "C" },
              })}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters purchase-promocode-filters mb-4">
          <Card.Body>
            <PurchasePromocodeFilters
              setPage={setPage}
              search={search}
              setSearch={setSearch}
              discountPercentage={discountPercentage}
              setDiscountPercentage={setDiscountPercentage}
              maxUsersAvailed={maxUsersAvailed}
              setMaxUsersAvailed={setMaxUsersAvailed}
              validTill={validTill}
              setValidTill={setValidTill}
              validFrom={validFrom}
              setValidFrom={setValidFrom}
              status={status}
              setStatus={setStatus}
            />
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="purchase-promocode-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== "" && h.value !== "Action" && setOrderBy(h.value)}
                      style={{
                        cursor: h.value !== "" && h.value !== "Action" ? "pointer" : "default",
                      }}
                      className={selected(h) ? "sortable active" : "sortable"}
                    >
                      {h.labelKey}{" "}
                      {selected(h) &&
                        (sort === "ASC" ? (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowAltCircleUp}
                            onClick={() => setSort("DESC")}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ) : (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowAltCircleDown}
                            onClick={() => setSort("ASC")}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ))}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : promoCodeList?.promocodeDetail?.count > 0 ? (
                  promoCodeList?.promocodeDetail?.rows?.map(
              ({
                promocodeId,
                promocode,
                discountPercentage,
                perUserLimit,
                maxUsersAvailed,
                // isActive,
                isDiscountOnAmount,
                validFrom,
                validTill,
                maxUsersAvailedCount,
                status
              }) => (
                <tr key={promocodeId}>
                  <td>{promocodeId}</td>
                  <td>{promocode}</td>
                  <td>{discountPercentage} {isDiscountOnAmount ? "% Discount" : "% Bonus"}</td>
                  {/* <td>{bonusPercentage}</td> */}
                  <td>{perUserLimit}</td>
                  <td>{maxUsersAvailed === null ? "0" : formatPriceWithCommas(maxUsersAvailed)}</td>
                  <td>{maxUsersAvailedCount}</td>
                  {/* <td>
                    {isActive ? (
                      <span className="text-success">
                        {t("Active")}
                      </span>
                    ) : (
                      <span className="text-danger">
                        {t("Inactive")}
                      </span>
                    )}</td> */}
                  {/* <td>{formatDateMDY(createdAt)}</td> */}
                  <td>{validFrom === null ? "-" : getDateTime(validFrom)}</td>
                  <td>{validTill === null ? "-" : getDateTime(validTill)}</td>
                  <td>
                    <span
                      className={[
                        "purchase-promocode-pill",
                        status === 1
                          ? "purchase-promocode-pill--active"
                          : status === 0
                            ? "purchase-promocode-pill--upcoming"
                            : "purchase-promocode-pill--expired",
                      ].join(" ")}
                    >
                      {STATUS_LABELS[status] || "-"}
                    </span>
                  </td>

                  {/* <td>{validFrom === null ? "-" : getDateTime(convertToTimeZone(validFrom, timezoneOffset))}</td> */}
                  {/* <td>{validTill === null ? "-" : getDateTime(convertToTimeZone(validTill, timezoneOffset))}</td> */}
                  <td>
                    <div className="purchase-promocode-actions">
                      <Trigger message={"View"} id={promocodeId + "view"} />
                      <Button
                        id={promocodeId + "view"}
                        className="purchase-promocode-icon-btn"
                        size="sm"
                        variant="info"
                        onClick={() =>
                          navigate(`${AdminRoutes.PromoCodeView.split(":").shift()}${promocodeId}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>

                      <Trigger message="Edit" id={promocodeId + "edit"} />
                      <Button
                        id={promocodeId + "edit"}
                        hidden={isHidden({ module: { key: "Promocode", value: "U" } })}
                        disabled={status === 2 || status === 3}
                        className="purchase-promocode-icon-btn"
                        size="sm"
                        variant="warning"
                        onClick={() =>
                          navigate(`${AdminRoutes.PromoCodeEdit.split(":").shift()}${promocodeId}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>

                      <Trigger message="Delete" id={promocodeId + "delete"} />
                      <Button
                        id={promocodeId + "delete"}
                        hidden={isHidden({ module: { key: "Promocode", value: "D" } })}
                        className="purchase-promocode-icon-btn"
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(promocode)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    {/* {!isActive ? (
                      <>
                        <Trigger
                          message="Set Status Active"
                          id={promocodeId + "active"}
                        />
                        <Button
                          id={promocodeId + "active"}
                          hidden={isHidden({ module: { key: 'Promocode', value: 'U' } })}
                          className="m-1"
                          size="sm"
                          variant="success"
                          onClick={() => handleShow(promocodeId, isActive)}
                        >
                          <FontAwesomeIcon icon={faCheckSquare} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Trigger
                          message="Set Status In-Active"
                          id={promocodeId + "inactive"}
                        />
                        <Button
                          id={promocodeId + "inactive"}
                          hidden={isHidden({ module: { key: 'Promocode', value: 'U' } })}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          onClick={() => handleShow(promocodeId, isActive)}
                        >
                          <FontAwesomeIcon icon={faWindowClose} />
                        </Button>
                      </>
                    )} */}
                    <>
                      <Trigger message="Reuse promocode" id={promocodeId + "resuePromocode"} />
                      <Button
                        id={promocodeId + "resuePromocode"}
                        className="purchase-promocode-icon-btn"
                        size="sm"
                        variant="warning"
                        onClick={() =>
                          handleReuseModal(promocodeId, maxUsersAvailed, perUserLimit)
                        }
                        disabled={(maxUsersAvailedCount === 0 && status !== 2) || status === 0 || status === 3}
                        hidden={isHidden({
                          module: { key: "Promocode", value: "C" },
                        })}
                      >
                        <FontAwesomeIcon icon={faRecycle} />
                      </Button>
                    </>
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={tableHeaders.length} className="text-center py-4 purchase-promocode-empty">
                No Data Found
              </td>
            </tr>
          )
          }
              </tbody>
            </Table>
          </div>
        </div>

      {promoCodeList?.promocodeDetail?.count !== 0 && (
        <PaginationComponent
          page={promoCodeList?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={updateloading}
        />
      )}
      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
            loading={deleteLoading}
          />)
      }
      {reuseModalShow && (
        <ReuseConfirmationModal
          reuseModalShow={reuseModalShow}
          setReuseModalShow={setReuseModalShow}
          handleReusePromocodeYes={handleReusePromocodeYes}
          loading={reuseLoading}
          selectedMaxUsersAvailed={selectedMaxUsersAvailed}
          selectedPerUserLimit={selectedPerUserLimit}
        />
      )}

      {importModalShow && (
        <ImportCsvModal
          setShow={setImportModalShow}
          show={importModalShow}
          handleYes={handleCSVSumbit}
          loading={uploadCSVLoading}
          importedFile={importedFile}
          importAction={importAction}
          setImportAction={setImportAction}
        />
      )}

      {showImportedPromocodes && (
        <ImortedPromocodesCsvModel
          setShow={setShowImportedPromocodes}
          show={showImportedPromocodes}
          handleYes={handlePromocodeSumbit}
          // loading={uploadCSVLoading}
          importedFile={importedFile}
          importAction={importAction}
          setImportAction={setImportAction}
          importedPromocodesData={importedPromocodesData}

        />
      )}
      </div>
    </>
  );
};

export default PromoCodeBonus;

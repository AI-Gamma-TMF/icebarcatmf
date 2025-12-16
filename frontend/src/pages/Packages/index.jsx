import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col, Table } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowCircleUp,
  faArrowCircleDown,
  faEdit,
  faEye,
  faRecycle,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../components/Pagination";
import { PACKAGE_TYPE, statusOptions, tableHeaders } from "./constants";
import usePackagesListing from "./hooks/usePackagesListing";
import Trigger from "../../components/OverlayTrigger";
import { AdminRoutes } from "../../routes";
import useCheckPermission from "../../utils/checkPermission";
import useEditPackage from "./hooks/useEditPackage";
import { toast } from "../../components/Toast";
import PackageUserModal from "../../components/PackageUserModal";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
  ReuseConfirmationModal,
} from "../../components/ConfirmationModal";
import {
  convertToTimeZone,
  formatPriceWithCommas,
  getFormattedTimeZoneOffset,
} from "../../utils/helper";
import { InlineLoader } from "../../components/Preloader";
import { convertToUTC, getDateTime } from "../../utils/dateFormatter";
import { getItem } from "../../utils/storageUtils";
import { timeZones } from "../Dashboard/constants";

const Packages = () => {
  const [showPackageUser, setShowPackageUser] = useState(false);
  const [selectedPackageId, _setSelectedPackageId] = useState(null);

  const {
    loading,
    navigate,
    limit,
    setLimit,
    deleteLoading,
    reuseLoading,
    page,
    setPage,
    setOrderBy,
    sort,
    setSort,
    setSearch,
    search,
    show,
    setShow,
    over,
    setOver,
    data,
    totalPages,
    handleYes,
    selected,
    active,
    // setHot,
    isActive,
    setIsActive,
    // isVisibleInStore,
    setIsVisibleInStore,
    fetchData,
    t,
    handleDeleteModal,
    handleReuseModal,
    handleDeleteYes,
    handleReusePackageYes,
    deleteModalShow,
    setDeleteModalShow,
    reuseModalShow,
    setReuseModalShow,
    packageIdFilter,
    setPackageIdFilter,
    packageType,
    setPackageType,
    isSpecialPackage,
    showOverwriteModal,
    setShowOverwriteModal,
    overwriteFormValues,
    setOverwriteFormValues,
    existingPackageData,
    // setExistingPackageData
  } = usePackagesListing();

  const [error, setError] = useState("");

  const resetFilters = () => {
    setIsActive("all");
    setIsVisibleInStore("");
    setSearch("");
    setPackageIdFilter("");
    setError("");
    setPackageType("all");
  };

  const onSuccess = (res) => {
    if (res?.data?.updatedPackage[0]) {
      fetchData();
      toast("Status changed", "success", "packageUpdate");
    }
  };
  const { _editPackage } = useEditPackage(onSuccess);

  const { isHidden } = useCheckPermission();

  // const handleStatusChanged = (data) => {
  //   const body = {
  //     ...data,
  //     amount: data.amount.toString(),
  //     isActive: (!data.isActive).toString(),
  //     hot: data.hot.toString(),
  //     currency: "USD",
  //     isVisibleInStore: data.isVisibleInStore.toString(),
  //   };
  //   if (data) editPackage(body);
  // };

  useEffect(() => {
    if (["upcoming", "expired"].includes(packageType)) {
      setIsActive("all");
    }
  }, [packageType]);

  // const showValidityDates =
  //   packageType === "special" || ["upcoming", "expired"].includes(isActive);

  // const statusIndex = tableHeaders?.findIndex((h) => h.value === "isActive");

  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

  return (
    <>
      <Row>
        <Row className="align-items-center justify-content-between mb-3">
          <Col>
            <h3>{t("title")}</h3>
          </Col>

          <Col xs="auto">
            <div className="d-flex gap-3 align-items-center">
              <Button
                variant="success"
                size="md"
                className="px-3 py-2"
                onClick={() => navigate(AdminRoutes.CreatePackage)}
                hidden={isHidden({ module: { key: "Package", value: "C" } })}
              >
                {t("createButton")}
              </Button>

              <Button
                variant="success"
                size="md"
                className="px-3 py-2"
                onClick={() => navigate(AdminRoutes.ReorderPackage)}
                hidden={isHidden({ module: { key: "Package", value: "U" } })}
              >
                {t("reorderButton")}
              </Button>

              <Button
                variant="warning"
                size="md"
                className="px-3 py-2"
                onClick={() => navigate(AdminRoutes.UnarchivePackage)}
                hidden={isHidden({ module: { key: "Package", value: "U" } })}
              >
                Archived
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>Search by Package Name, Amount & Coins</Form.Label>

            <Form.Control
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event?.target?.value);
              }}
            />
          </Col>

          <Col xs={12} md={3} className="mb-3">
            <Form.Label>Package Type</Form.Label>
            <Form.Select
              onChange={(event) => {
                setPage(1);
                setPackageType(event?.target?.value);
              }}
              value={packageType}
            >
              {PACKAGE_TYPE?.map((pkg) => (
                <option key={pkg?.label} value={pkg?.value}>
                  {pkg?.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={12} md={3} className="mb-3">
            <Form.Label>{t("filters.status")}</Form.Label>
            <Form.Select
              value={isActive}
              onChange={(event) => {
                setPage(1);
                setIsActive(event?.target?.value);
              }}
            >
              {statusOptions?.map((status, _idx) => (
                <option key={status.label} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* <Col xs={2} className="mb-3">
            <Form.Label>{t("filters.isVisibleInStore")}</Form.Label>
            <Form.Select
              onChange={(event) => {
                setPage(1);
                setIsVisibleInStore(event.target.value);
              }}
              value={isVisibleInStore}
            >
              {isVisibleInStoreOptions?.map((status, idx) => (
                <option
                  key={status.label}
                  defaultValue={idx === 0}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </Form.Select>
          </Col> */}

          <Col xs={12} md={3} className="mb-3">
            <div>
              <Form.Label>Package Id</Form.Label>
              <Form.Control
                type="search"
                placeholder="Search by Package Id"
                value={packageIdFilter}
                onChange={(event) => {
                  const inputValue = event?.target?.value;
                  if (/^\d*$/.test(inputValue)) {
                    if (inputValue.length <= 10) {
                      setPage(1);
                      setPackageIdFilter(inputValue);
                      setError("");
                    } else {
                      setError("Package Id cannot exceed 10 digits");
                    }
                  }
                }}
              />
            </div>
            {error && (
              <div style={{ color: "red", marginTop: "5px" }}>{error}</div>
            )}
          </Col>

          <Col xs={12} md={3} className="mb-3" style={{ marginTop: "30px" }}>
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
      </Row>

      {
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
              {tableHeaders?.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() =>
                    h.value !== "action" &&
                    h.value !== "PackageUsers" &&
                    h.value !== "claimedCount" &&
                    h.value !== "packageType" &&
                    setOrderBy(h.value)
                  }
                  style={{
                    cursor:
                      h.value === "packageType" ||
                      h.value === "claimedCount" ||
                      h.value === "action"
                        ? "default"
                        : "pointer",
                  }}
                  className={selected(h) ? "border-3 border border-blue" : ""}
                >
                  {t(h.labelKey)}{" "}
                  {selected(h) &&
                    (sort === "asc" ? (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowCircleUp}
                        onClick={() => setSort("desc")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowCircleDown}
                        onClick={() => setSort("asc")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ))}
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : (
            <tbody>
              {data && data.rows && data.rows.length > 0 ? (
                data?.rows?.map(
                  ({
                    packageId,
                    packageName,
                    orderId,
                    amount,
                    gcCoin,
                    scCoin,
                    isActive,
                    claimedCount,
                    welcomePurchaseBonusApplicable,
                    isSpecialPackage,
                    firstPurchaseApplicable,
                    bonusGc,
                    bonusSc,
                    purchaseNo,
                    validFrom,
                    validTill,
                    packageTag,
                  }) => {
                    const today = new Date();
                    const isExpired =
                      validFrom &&
                      validTill &&
                      new Date(validFrom) < today &&
                      new Date(validTill) < today &&
                      !isActive &&
                      claimedCount > 0;

                    return (
                      <tr key={packageId}>
                        <td>
                          {packageId}{" "}
                          {welcomePurchaseBonusApplicable && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </td>
                        <td>{orderId ? orderId : "-"}</td>
                        <td>{packageName ? packageName : "-"}</td>
                        <td>{packageTag ?? "-"}</td>
                        <td>
                          <span>
                            {amount
                              ? Number.isInteger(amount)
                                ? amount
                                : amount.toFixed(2)
                              : amount}
                          </span>
                        </td>
                        <td>
                          <span>
                            {formatPriceWithCommas(gcCoin)} +
                            {formatPriceWithCommas(bonusGc)}
                          </span>
                        </td>
                        <td>
                          {formatPriceWithCommas(scCoin)} +{" "}
                          {formatPriceWithCommas(bonusSc)}
                        </td>

                        <td>
                          {welcomePurchaseBonusApplicable
                            ? "Welcome Purchase Package"
                            : purchaseNo > 0 && isSpecialPackage
                            ? "Special Purchase Package"
                            : firstPurchaseApplicable
                            ? "Basic Package"
                            : isSpecialPackage
                            ? "Special Package"
                            : purchaseNo > 0
                            ? "Purchase Package"
                            : "Basic Package"}
                        </td>
                        <td>{claimedCount || 0}</td>
                        <td>{purchaseNo || 0}</td>
                        <td>
                          {validFrom
                            ? getDateTime(
                                convertToTimeZone(validFrom, timezoneOffset)
                              )
                            : "-"}
                        </td>
                        <td>
                          {validTill
                            ? getDateTime(
                                convertToTimeZone(validTill, timezoneOffset)
                              )
                            : "-"}
                        </td>
                        <td>
                          {isActive ? (
                            <span className="text-success">
                              {t("activeStatus")}
                            </span>
                          ) : (
                            <span className="text-danger">
                              {t("inActiveStatus")}
                            </span>
                          )}
                        </td>
                        {!isHidden({
                          module: { key: "Package", value: "U" },
                        }) ||
                        !isHidden({
                          module: { key: "Package", value: "T" },
                        }) ? (
                          <td>
                            <>
                              <Trigger
                                message={"View"}
                                id={packageId + "view"}
                              />
                              <Button
                                id={packageId + "view"}
                                className="m-1"
                                size="sm"
                                variant="info"
                                onClick={() =>
                                  navigate(
                                    `${AdminRoutes.ViewPackages.split(
                                      ":"
                                    ).shift()}${packageId}`
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>

                              <Trigger message="Edit" id={packageId + "edit"} />
                              <Button
                                id={packageId + "edit"}
                                className="m-1"
                                size="sm"
                                variant="warning"
                                onClick={() =>
                                  navigate(
                                    `${
                                      AdminRoutes.EditPackageDetails.split(
                                        ":"
                                      )[0]
                                    }${packageId}`
                                  )
                                }
                                hidden={isHidden({
                                  module: { key: "Package", value: "U" },
                                })}
                                disabled={isExpired}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <>
                                <Trigger
                                  message={"Delete"}
                                  id={packageId + "delete"}
                                />
                                <Button
                                  id={packageId + "delete"}
                                  className="m-1"
                                  size="sm"
                                  variant="danger"
                                  hidden={isHidden({
                                    module: { key: "Package", value: "D" },
                                  })}
                                  onClick={() => handleDeleteModal(packageId)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </>
                              {!welcomePurchaseBonusApplicable && (
                                <>
                                  <Trigger
                                    message="Reuse package"
                                    id={packageId + "resuePackage"}
                                  />
                                  <Button
                                    id={packageId + "resuePackage"}
                                    className="m-1"
                                    size="sm"
                                    variant="warning"
                                    onClick={() => handleReuseModal(packageId)}
                                    disabled={
                                      claimedCount === 0 &&
                                      ((validTill !== null &&
                                        validTill > convertToUTC(new Date())) ||
                                        validTill === null)
                                    }
                                    hidden={isHidden({
                                      module: { key: "Package", value: "U" },
                                    })}
                                  >
                                    <FontAwesomeIcon icon={faRecycle} />
                                  </Button>
                                </>
                              )}
                            </>
                          </td>
                        ) : (
                          "NA"
                        )}
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan={9} className="text-danger text-center">
                    {t("noDataFound")}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      }
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
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
        />
      )}

      {showPackageUser && (
        <PackageUserModal
          setShow={setShowPackageUser}
          show={showPackageUser}
          packageDetail={data?.rows?.find(
            (ele) => ele.packageId === selectedPackageId
          )}
          navigate={navigate}
        />
      )}
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}
      {reuseModalShow && (
        <ReuseConfirmationModal
          reuseModalShow={reuseModalShow}
          setReuseModalShow={setReuseModalShow}
          handleReusePackageYes={handleReusePackageYes}
          loading={reuseLoading}
          isSpecialPackage={isSpecialPackage}
          setOverwriteFormValues={setOverwriteFormValues}
          existingPackageData={existingPackageData}
          overwriteFormValues={overwriteFormValues}
          showOverwriteModal={showOverwriteModal}
          setShowOverwriteModal={setShowOverwriteModal}
        />
      )}
    </>
  );
};

export default Packages;

import React from "react";
import {
  faArrowCircleUp,
  faArrowCircleDown,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Table, Button, Col, Form } from "@themesberg/react-bootstrap";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import SampleCSVManagedBy from "./SampleCVS";
import SearchBar from "./SearchBar";
import {
  VipManagedByModal,
  VipStatusConfirmationModal,
} from "../../../components/ConfirmationModal";
import Trigger from "../../../components/OverlayTrigger";
import PaginationComponent from "../../../components/Pagination";
import { InlineLoader } from "../../../components/Preloader";
import "./_vip.scss";
import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useUploadVipUserCsvMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { AdminRoutes } from "../../../routes";
import useCheckPermission from "../../../utils/checkPermission";
import ImportPackageCsvModal from "../../Packages/components/PackageDetails/PackageActionModals/ImportedPackageCsvModal";
import { customerHeaders, internalTierRating } from "../constants";
import useVipPlayerListing from "../hooks/useVipPlayerListing";

const CustomerManagement = () => {
  const {
    vipPlayerListing,
    isLoading,
    setLimit,
    setPage,
    page,
    totalPages,
    setOrderBy,
    setSort,
    sort,
    limit,
    setSearch,
    search,
    setUserId,
    setRatingFilter,
    setVipStatus,
    selected,
    over,
    setOver,
    vipStatusModal,
    setVipStatusModal,
    setVipStatusValue,
    vipStatusValue,
    handleUpdateVipStatus,
    vipManagers,
    isVipManagersLoading,
    setManager,
    ManagedByModal,
    setManagedByModal,
    handleUpdateManager,
    setManagedBySearch,
    handleImportChange,
    importedFile,
    importModalShow,
    setImportModalShow,
    refetchPlayerList,
  } = useVipPlayerListing("customerManagement");

  const navigate = useNavigate();
  const { isHidden } = useCheckPermission();
  const handleSelect = (event, userId) => {
    const eventValue = event.target.value;
    setVipStatusValue(eventValue);
    setUserId(userId);
    setVipStatusModal(true);
  };

  const handleSelectManager = (event, userId) => {
    const eventValue = event.target.value;
    setUserId(userId);
    setManager(eventValue);
    setManagedByModal(true);
  };

  const { mutate: uploadVipUsersCSV, isLoading: uploadCSVLoading } =
    useUploadVipUserCsvMutation({
      onSuccess: ({ data }) => {
        toast(data.message, "success");
        refetchPlayerList();
        setImportModalShow(false);
      },
      onError: (error) => {
        errorHandler(error);
        setImportModalShow(false);
      },
    });

  const handleCSVSumbit = () => {
    const formData = new FormData();
    formData.append("file", importedFile);
    uploadVipUsersCSV(formData);
    setImportModalShow(false);
  };

  const fileInputRef = useRef(null);

  const handleReplaceCsvClick = () => {
    fileInputRef.current.click();
  };

  const handleNavigatePlayerDetails = (userId) => {
    navigate(`${AdminRoutes.VipPlayerDetails.split(":").shift()}${userId}`);
  };

  return (
    <>
      <Row className="d-flex justify-content-between align-items-center">
        <Col sm={6} lg={3}>
          <h3>Customer Management</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm={6} lg={3}>
          <Form.Label>Search Player</Form.Label>
          <SearchBar search={search} setSearch={setSearch} />
        </Col>
        <Col sm={6} lg={2}>
          <Form.Group>
            <Form.Label>Player Rating</Form.Label>
            <Form.Select
              onChange={(event) => {
                setPage(1);
                setRatingFilter(event?.target?.value);
              }}
            >
              {internalTierRating.map((rating, _index) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={6} lg={2}>
          <Form.Group>
            <Form.Label>Final VIP status</Form.Label>
            <Form.Select
              onChange={(event) => {
                setPage(1);
                setVipStatus(event?.target?.value);
              }}
            >
              <option value="">All</option>
              <option value="approved">Approved VIP</option>
              <option value="rejected">Revoked VIP</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {!isHidden({ module: { key: "VipManagedBy", value: "U" } }) && (
          <Col sm={6} lg={2}>
            <Form.Group>
              <Form.Label>Managed By</Form.Label>
              <Form.Select
                onChange={(event) => {
                  setPage(1);
                  setManagedBySearch(event?.target?.value);
                }}
              >
                <option value="">All</option>
                {!isVipManagersLoading &&
                  vipManagers?.map((manager) => (
                    <option
                      key={manager?.adminUserId}
                      value={manager?.adminUserId}
                    >
                      {manager.firstName} {manager?.lastName} (Staff Id -{" "}
                      {manager?.adminUserId})
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        )}
        {!isHidden({ module: { key: "VipManagedBy", value: "U" } }) && (
          <>
            <Col
              sm={6}
              lg={1}
              style={{ marginTop: "1rem" }}
              className="ms-auto d-flex justify-content-end align-items-center"
            >
              <Trigger
                message="Import .csv with column title userId and managedBy and both are mandatory for bulk user assignment"
                id={"csvFileInput"}
              />
              <Button
                variant="secondary"
                // className="ml-4 me-4"
                onClick={handleReplaceCsvClick}
                type="button"
                id={"csvFileInput"}
              >
                <FontAwesomeIcon icon={faFileUpload} />
              </Button>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleImportChange}
                style={{ display: "none" }} // Hide the file input
              />
            </Col>
            <Col sm={6} lg={1} style={{ marginTop: "2rem" }}>
              <SampleCSVManagedBy />
            </Col>
          </>
        )}
      </Row>
      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className="text-center mt-3"
      >
        <thead className="thead-dark">
          <tr style={{ boxShadow: "0 4px 4px 0 #797979", borderRadius: "7px" }}>
            {customerHeaders.map((header, index) => (
              <th
                key={header.value}
                onClick={() =>
                  header.value !== "managedBy" &&
                  header.value !== "status" &&
                  setOrderBy(header.value)
                }
                className={
                  selected(header) ? "border-3 border border-blue" : ""
                }
              >
                {header.labelKey}{" "}
                {selected(header) &&
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

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : vipPlayerListing && vipPlayerListing?.users?.rows.length > 0 ? (
            vipPlayerListing?.users?.rows.map(
              ({
                userId,
                username,
                email,
                UserInternalRating,
                UserTier,
                status,
              }) => {
                return (
                  <tr key={userId}>
                    <td
                      className="text-link"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNavigatePlayerDetails(userId)}
                    >
                      {userId || "NA"}
                    </td>
                    <td
                      className="text-link"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNavigatePlayerDetails(userId)}
                    >
                      {" "}
                      {username || "NA"}
                    </td>
                    <td
                      className="text-link"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNavigatePlayerDetails(userId)}
                    >
                      {email || "NA"}
                    </td>
                    <td>{UserInternalRating?.rating}</td>
                    <td>{UserTier?.tierName || "NA"}</td>
                    <td>
                      <Form.Select
                        className={`${UserInternalRating?.vipStatus}`}
                        onChange={(e) => handleSelect(e, userId)}
                        value={UserInternalRating?.vipStatus}
                        disabled={isHidden({
                          module: { key: "VipManagement", value: "U" },
                        })}
                      >
                        <option value="" hidden>
                          Select Status
                        </option>
                        <option value="approved">Approved VIP</option>
                        <option value="rejected">Revoked VIP</option>
                      </Form.Select>
                    </td>
                    <td
                      className={
                        status === "Active" ? "text-success" : "text-danger"
                      }
                    >
                      {status}
                    </td>
                    <td>
                      <Form.Select
                        onChange={(e) => handleSelectManager(e, userId)}
                        value={UserInternalRating?.managedBy || ""}
                        disabled={isHidden({
                          module: { key: "VipManagedBy", value: "U" },
                        })}
                      >
                        <option value="" hidden>
                          Select Admin
                        </option>
                        {!isVipManagersLoading &&
                          vipManagers?.map((manager) => (
                            <option
                              key={manager?.adminUserId}
                              value={manager?.adminUserId}
                            >
                              {manager.firstName} {manager?.lastName} (Staff Id
                              - {manager?.adminUserId})
                            </option>
                          ))}
                      </Form.Select>
                    </td>
                  </tr>
                );
              }
            )
          ) : (
            <tr>
              <td colSpan={7} className="text-danger text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {vipPlayerListing?.users?.count !== 0 && (
        <PaginationComponent
          page={vipPlayerListing?.users?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      {vipStatusModal && (
        <VipStatusConfirmationModal
          setShow={setVipStatusModal}
          show={vipStatusModal}
          handleYes={handleUpdateVipStatus}
          vipStatusValue={vipStatusValue}
        />
      )}
      {ManagedByModal && (
        <VipManagedByModal
          setShow={setManagedByModal}
          show={ManagedByModal}
          handleYes={handleUpdateManager}
        />
      )}

      {importModalShow && (
        <ImportPackageCsvModal
          setShow={setImportModalShow}
          show={importModalShow}
          handleYes={handleCSVSumbit}
          loading={uploadCSVLoading}
          importedFile={importedFile}
        />
      )}
    </>
  );
};
export default CustomerManagement;

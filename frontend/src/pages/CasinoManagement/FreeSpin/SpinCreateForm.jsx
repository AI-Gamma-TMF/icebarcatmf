import React, { useRef, useState } from "react";
import {
  Row,
  Col,
  Form as BForm,
  Button,
  Table,
  Spinner,
  Accordion,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { getDateTime, getDateTimeByYMD } from "../../../utils/dateFormatter";
import Trigger from "../../../components/OverlayTrigger";
import useCreateFreeSpin from "./hooks/useCreateFreespin";
import ImportPackageCsvModal from "../../Packages/components/PackageDetails/PackageActionModals/ImportedPackageCsvModal";
import { capitalizeFirstLetter } from "../../../utils/helper";
import DisplayUserModal from "./DisplayUserModal";
import { DeleteConfirmationModal } from "../../../components/ConfirmationModal";
import { AdminRoutes } from "../../../routes";
import SelectUser from "../../../components/SelectUser";
import Select from "react-select";

const SpinCreateForm = ({
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  setFieldValue,
  isLoading,
  selectedUser,
  setSelectedUser,
  editData,
}) => {
  const yesterday = new Date(Date.now() - 86400000);
  const {
    freeSpinProviderList,
    uploadCSVLoading,
    handleCSVSumbit,
    handleImportChange,
    importModalShow,
    setImportModalShow,
    importedFile,
    showUserData,
    setShowUserData,
    viewCategory,
    handleDeleteModal,
    setDeleteModalShow,
    deleteModalShow,
    handleDeleteYes,
    deleteUserLoading,
    freeSpinUsersList,
    isFreeSpinUsersLoading,
    navigate,
    freeSpinTemplateList,
    refetchFreeSpinTemplateList,
    betLimitList,
    gameOptions,
    handleScrollToBottom,
    isFetchingNextPage,
    subscriptionList,
    refetchSubscriptionList,
  } = useCreateFreeSpin({
    providerId: values?.providerId,
    gameId: values?.masterCasinoGameId,
    coinType: values?.coinType,
    freeSpinType: values?.freeSpinType,
  });

  const [userSelectionMode, setUserSelectionMode] = useState("manual");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isAlea, setIsAlea] = useState(false)
  const [isMascot, setIsMascot] = useState(false)
  const fileInputRef = useRef(null);
  const handleReplaceCsvClick = () => {
    fileInputRef.current.click();
  };

  const handleNavigateViewUsers = (status) => {
    navigate(`${AdminRoutes.viewFreeSpinUsers.split(":").shift()}${status}`);
  };
  const OnSubmitClick = () => {
    handleSubmit();
  };
  const handleAccordionToggle = () => {
    setIsAccordionOpen((prev) => !prev);
  };

  const providerOptions =
  freeSpinProviderList?.map((provider) => ({
    value: provider.masterCasinoProviderId,
    label: `${provider.name} / ${provider.aggregatorName}`,
  })) || []

  const subscriptionOptions =
    subscriptionList?.map((data) => ({
      value: data.subscriptionId,
      label: data.name,
    })) || [];
  const handleNotifyCheckboxChange = (e) => {
    const checked = e.target.checked;
    setFieldValue("isNotifyUser", checked);

    if (checked) {
      refetchFreeSpinTemplateList();
    }
  };

  return (
    <>
      <Row>
        <Row>
          <Col sx={3} className="mb-3">
            <BForm.Label>
              Title <span className="text-danger"> *</span>
            </BForm.Label>
            <BForm.Control
              type="text"
              name="title"
              placeholder="Enter Title"
              value={values?.title}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={
                editData?.status == 1 ||
                editData?.status == 2 ||
                editData?.status == 3
              }
            />
            <ErrorMessage
              component="div"
              name="title"
              className="text-danger"
            />
          </Col>
        </Row>
        <Col sx={3} className="mb-3">
          <BForm.Label>
            Free Spin Type <span className="text-danger"> *</span>
          </BForm.Label>
          <BForm.Select
            name="freeSpinType"
            value={values?.freeSpinType}
            onChange={handleChange}
            disabled={
              editData?.status == 1 ||
              editData?.status == 2 ||
              editData?.status == 3
            }
          >
            <option value="" disabled>
              Select Free Spin Type
            </option>
            <option value="directGrant">Direct Grant</option>
            <option value="attachedGrant">Attached Grant</option>
            {/* <option value="subscriptionGrant">Subscription Grant</option> */}
          </BForm.Select>
          <ErrorMessage
            component="div"
            name="freeSpinType"
            className="text-danger"
          />
        </Col>
        {values?.freeSpinType === "subscriptionGrant" && (
          <Col sx={3} className="mb-3">
            <BForm.Label>
              Subscription Type <span className="text-danger"> *</span>
            </BForm.Label>
            <Select
              name="subscriptionId"
              options={subscriptionOptions}
              value={
                subscriptionOptions.find(
                  (option) => option.value == values.subscriptionId
                ) || null
              }
              onChange={(selected) =>
                setFieldValue("subscriptionId", selected ? selected.value : "")
              }
              isDisabled={
                editData?.status == 1 ||
                editData?.status == 2 ||
                editData?.status == 3
              }
              placeholder="Select Subscription Type"
            />
            <ErrorMessage
              component="div"
              name="subscriptionId"
              className="text-danger"
            />
          </Col>
        )}
        <Col sx={3} className="mb-3">
          <BForm.Label>
            Select Provider Name <span className="text-danger"> *</span>
          </BForm.Label>
          <Select
            name="providerId"
            options={providerOptions}
            value={
              providerOptions.find(
                (option) => option.value === values.providerId
              ) || null
            }
            onChange={(selected) => {
              setFieldValue("providerId", selected ? selected.value : "")
              setFieldValue("masterCasinoGameId", "")

              // if provider is Alea -> force SC coin type
              const selectedProvider = freeSpinProviderList.find(
                (p) => p.masterCasinoProviderId === selected?.value
              );
              if (selectedProvider?.aggregatorName?.toLowerCase() === "alea") {
                setFieldValue("coinType", "SC"); // force SC
                setIsAlea(true);
              } else {
                setIsAlea(false);
              }
              if (selectedProvider?.name?.toLowerCase() === "mascot") {
                setIsMascot(true);
              } else {
                setIsMascot(false);
              }
            }
            }
            isDisabled={
              editData?.status == 1 ||
              editData?.status == 2 ||
              editData?.status == 3
            }
            placeholder="Select Provider"
          />
          <ErrorMessage
            component="div"
            name="providerId"
            className="text-danger"
          />
        </Col>

        <Col sx={3} className="mb-3">
          <BForm.Label>
            Select Game Name <span className="text-danger"> *</span>
          </BForm.Label>
          <Select
            name="masterCasinoGameId"
            options={gameOptions}
            value={
              gameOptions.find(
                (option) => option.value === values.masterCasinoGameId
              ) || null
            }
            onChange={(selected) =>
              setFieldValue(
                "masterCasinoGameId",
                selected ? selected.value : ""
              )
            }
            onMenuScrollToBottom={handleScrollToBottom}
            isDisabled={
              editData?.status == 1 ||
              editData?.status == 2 ||
              editData?.status == 3
            }
            isLoading={isFetchingNextPage}
            placeholder="Select Game"
          />
          <ErrorMessage
            component="div"
            name="masterCasinoGameId"
            className="text-danger"
          />
        </Col>
      </Row>
      <Row>
        <Col sx={3} className="mb-3">
          <BForm.Label>
            Coin Type <span className="text-danger"> *</span>
          </BForm.Label>
          <BForm.Select
            name="coinType"
            value={values?.coinType}
            onChange={handleChange}
            disabled={
              editData?.status == 1 ||
              editData?.status == 2 ||
              editData?.status == 3
            }
          >
            <option value="SC">SC</option>
            {!isAlea && <option value="GC">GC</option>}
          </BForm.Select>

          <ErrorMessage
            component="div"
            name="coinType"
            className="text-danger"
          />
        </Col>

        <Col sx={3} className="mb-3">
          <BForm.Label>
            Amount Per Free Spin <span className="text-danger"> *</span>
          </BForm.Label>
          {isMascot ? (
            <BForm.Control
              type="number"
              name="freeSpinAmount"
              min="0"
              step="0.01"
              placeholder="Enter Amount"
              value={values?.freeSpinAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={
                editData?.status == 1 ||
                editData?.status == 2 ||
                editData?.status == 3
              }
            />
          ) : (
            <BForm.Select
              name="freeSpinAmount"
              value={values?.freeSpinAmount}
              onChange={handleChange}
              disabled={
                editData?.status == 1 ||
                editData?.status == 2 ||
                editData?.status == 3
              }
            >
              <option value="" disabled>
                Select Amount
              </option>

              {betLimitList &&
                betLimitList.length > 0 &&
                betLimitList.map((amount) => (
                  <option key={amount} value={amount}>
                    {amount}
                  </option>
                ))}
            </BForm.Select>
          )}
          <ErrorMessage
            component="div"
            name="freeSpinAmount"
            className="text-danger"
          />
        </Col>

        <Col sx={3} className="mb-3">
          <BForm.Label>
            Free Spin Rounds (in number) <span className="text-danger"> *</span>
          </BForm.Label>
          <BForm.Control
            type="number"
            name="freeSpinRound"
            min="1"
            onKeyDown={(evt) =>
              ["e", "E", "+", "-", "."].includes(evt.key) &&
              evt.preventDefault()
            }
            placeholder="Free Spin Rounds (in number)"
            value={values?.freeSpinRound}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={
              editData?.status == 1 ||
              editData?.status == 2 ||
              editData?.status == 3
            }
          />

          <ErrorMessage
            component="div"
            name="freeSpinRound"
            className="text-danger"
          />
        </Col>
      </Row>
      {/* <Row>
        <Col sx={3} className="mb-3">
          <BForm.Label>Start Date </BForm.Label>
          <Datetime
            inputProps={{
              placeholder: "MM-DD-YYYY HH:MM",
              readOnly: true,
              style: {
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100%",
              },
              disabled:
                editData?.status == 1 ||
                editData?.status == 2 ||
                editData?.status == 3,
            }}
            dateFormat="MM-DD-YYYY"
            onChange={(e) => setFieldValue("startDate", e)}
            value={
              values.startDate
                ? getDateTime(values.startDate)
                : values.startDate
            }
            isValidDate={(e) => {
              return (
                e._d > yesterday ||
                getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
              );
            }}
            timeFormat={true}
          />
          <ErrorMessage
            component="div"
            name="startDate"
            className="text-danger"
          />
        </Col>
        <Col sx={3} className="mb-3">
          <BForm.Label>End Date </BForm.Label>
          <Datetime
            inputProps={{
              placeholder: "MM-DD-YYYY HH:MM",
              readOnly: true,
              style: {
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100%",
              },
              disabled: editData?.status == 2 || editData?.status == 3,
            }}
            dateFormat="MM-DD-YYYY"
            onChange={(e) => setFieldValue("endDate", e)}
            value={
              values.endDate ? getDateTime(values.endDate) : values.endDate
            }
            isValidDate={(e) => {
              return (
                e._d > yesterday ||
                getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
              );
            }}
            timeFormat={true}
          />
          <ErrorMessage
            component="div"
            name="endDate"
            className="text-danger"
          />
        </Col>
        <Col xs={3} className="mb-3">
          <BForm.Label>
         User Claim Validity (Days)
          </BForm.Label>
          <BForm.Select
            name="daysValidity"
            value={values?.daysValidity}
            onChange={handleChange}
            onBlur={handleBlur}
              disabled={
              editData?.status == 1 ||
              editData?.status == 2 ||
              editData?.status == 3
            }
          >
            <option value="" disabled>
              Select Days
            </option>
            {[...Array(10)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </BForm.Select>
          <ErrorMessage
            component="div"
            name="daysValidity"
            className="text-danger"
          />
        </Col>
      </Row> */}
      <Row>
        <Col sx={3} className="mb-3">
          <BForm.Label>Start Date</BForm.Label>
          <Datetime
            inputProps={{
              placeholder: "MM-DD-YYYY HH:MM",
              readOnly: true,
              style: {
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100%",
              },
              disabled:
                values.daysValidity ||
                editData?.status == 1 ||
                editData?.status == 2 ||
                editData?.status == 3,
            }}
            dateFormat="MM-DD-YYYY"
            onChange={(e) => setFieldValue("startDate", e)}
            value={
              values.startDate
                ? getDateTime(values.startDate)
                : values.startDate
            }
            isValidDate={(e) =>
              e._d > yesterday ||
              getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
            }
            timeFormat={true}
          />
          <ErrorMessage
            component="div"
            name="startDate"
            className="text-danger"
          />
        </Col>

        <Col sx={3} className="mb-3">
          <BForm.Label>End Date</BForm.Label>
          <Datetime
            inputProps={{
              placeholder: "MM-DD-YYYY HH:MM",
              readOnly: true,
              style: {
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100%",
              },
              disabled:
                values.daysValidity ||
                editData?.status == 2 ||
                editData?.status == 3,
            }}
            dateFormat="MM-DD-YYYY"
            onChange={(e) => setFieldValue("endDate", e)}
            value={
              values.endDate ? getDateTime(values.endDate) : values.endDate
            }
            isValidDate={(e) =>
              e._d > yesterday ||
              getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
            }
            timeFormat={true}
          />
          <ErrorMessage
            component="div"
            name="endDate"
            className="text-danger"
          />
        </Col>

        <Col xs={3} className="mb-3">
          <BForm.Label>User Claim Validity (Days)</BForm.Label>
          <BForm.Select
            name="daysValidity"
            value={values?.daysValidity}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setFieldValue("daysValidity", selectedValue);
              if (selectedValue) {
                setFieldValue("startDate", "");
                setFieldValue("endDate", "");
              }
            }}
            onBlur={handleBlur}
            disabled={
              values.startDate ||
              values.endDate ||
              editData?.status == 1 ||
              editData?.status == 2 ||
              editData?.status == 3
            }
          >
            <option value="">None</option>
            {[...Array(10)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </BForm.Select>
          <ErrorMessage
            component="div"
            name="daysValidity"
            className="text-danger"
          />
        </Col>
      </Row>

      {values?.freeSpinType !== "attachedGrant" && (
        <Row>
          <Col xs={3} className="mb-3">
            <div
              className="d-flex align-items-center  rounded p-2 justify-content-between"
              style={{ border: "0.0625rem solid #d1d7e0" }}
            >
              <p className="mb-0">Notify</p>
              <BForm.Check
                name="isNotifyUser"
                className="ml-2"
                checked={values.isNotifyUser}
                onChange={handleNotifyCheckboxChange}
                onBlur={handleBlur}
                // disabled={isEdit || values.isScheduledPackage}
              />
            </div>

            <ErrorMessage
              component="div"
              name="isNotifyUser"
              className="text-danger"
            />
          </Col>
          <Col xs={5} className="mb-3">
            <BForm.Select
              name="emailTemplateId"
              value={values.emailTemplateId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!values.isNotifyUser}
            >
              <option value="" disabled hidden>
                Select Email Template
              </option>
              {freeSpinTemplateList?.map((template) => (
                <option
                  key={template.emailTemplateId}
                  value={template.emailTemplateId}
                >
                  {template.templateName}
                </option>
              ))}
            </BForm.Select>

            <ErrorMessage
              component="div"
              name="emailTemplateId"
              className="text-danger"
            />
          </Col>
          {values?.freeSpinType === "directGrant" && (
            <Col className=" mb-2" xs={4}>
              <div className="d-flex align-items-center rounded justify-content-between">
                <p className="mb-0" style={{ width: "120px" }}>
                  Select User{" "}
                </p>
                <BForm.Select
                  value={userSelectionMode}
                  onChange={(e) => setUserSelectionMode(e.target.value)}
                >
                  <option value="manual">Manual Addition</option>
                  <option value="csv">Import CSV</option>
                </BForm.Select>
              </div>
            </Col>
          )}
        </Row>
      )}
      {values?.freeSpinType === "directGrant" && (
        <Row>
          <p>
            Note: If no email templates are available here, please create one in
            the Email Center under the &apos;Free Spin&apos; type
          </p>
        </Row>
      )}

      {values?.freeSpinType === "directGrant" && (
        <>
          {userSelectionMode === "csv" && (
            <Col className="mt-3 mb-2 d-flex align-items-center">
              <Trigger
                message="Import .csv with column title 'email' and 'userId'. Email and userIds are mandatory."
                id="csvFileInput"
              />
              <Button
                variant="secondary"
                className="ml-4 me-4"
                onClick={handleReplaceCsvClick}
                type="button"
                id="csvFileInput"
              >
                Import User CSV
              </Button>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleImportChange}
                style={{ display: "none" }}
              />
            </Col>
          )}

          {userSelectionMode === "manual" && (
            <Row>
              <Accordion activeKey={isAccordionOpen ? "0" : null}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header onClick={handleAccordionToggle}>
                    Add User
                  </Accordion.Header>

                  <Accordion.Body>
                    <SelectUser
                      selectedUser={selectedUser}
                      setSelectedUser={setSelectedUser}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
          )}
        </>
      )}
      <Row>
        <Col
       
          className="d-flex flex-column justify-content-center"
          style={{ minHeight: "100px" }}
        >
          {editData && userSelectionMode === "csv" && (
            <p className="mb-2">
              <strong>Note:</strong> While adding a CSV, please use the same CSV
              that was used during creation.
            </p>
          )}

          {!editData && (
            <p className="mb-0">
                <strong>Note:</strong>  If Start Date, End Date, and Validity are all empty, the system sets User Claim Validity to <strong>3 days</strong>.
            </p>
          )}
        </Col>

        <Col
         
          className="mt-3 mb-2 d-flex align-items-center"
          style={{ justifyContent: "flex-end"}}
        >
          <Button
            onClick={() => navigate(AdminRoutes?.GameFreeSpin)}
            className="m-2 text-dark"
            style={{ backgroundColor: "#d3d3d3", borderColor: "#d3d3d3" }}
          >
            Cancel
          </Button>

          <Button
            onClick={OnSubmitClick}
            className="ml-4 btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <>Submit</>
            )}
          </Button>
        </Col>
      </Row>

      {!isFreeSpinUsersLoading && (
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
              {["Status", "Count", "Action"].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {freeSpinUsersList?.map(({ status, count }) => (
              <tr key={status}>
                <td>{capitalizeFirstLetter(status)}</td>
                <td>{count}</td>
                <td>
                  <>
                    <Trigger message={"View Users"} id={status + "view"} />
                    <Button
                      id={status + "view"}
                      className="m-1"
                      size="sm"
                      variant="info"
                      onClick={() => handleNavigateViewUsers(status)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                  </>
                  <>
                    <Trigger message={"Delete"} id={status + "delete"} />
                    <Button
                      id={status + "delete"}
                      className="m-1"
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteModal(status)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
      {showUserData && (
        <DisplayUserModal
          setShow={setShowUserData}
          show={showUserData}
          viewCategory={viewCategory}
        />
      )}
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteUserLoading}
        />
      )}
    </>
  );
};

export default SpinCreateForm;

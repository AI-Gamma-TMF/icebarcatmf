import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  Button,
  Col,
  Row,
  Table,
  Form,
  Spinner,
} from "@themesberg/react-bootstrap";
import EditUploadBanner from "./EditUploadBanner";
import useBannerManagement from "./useBannerManagement";
import Trigger from "../../components/OverlayTrigger";
import { tableHeaders } from "./constants";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import useCheckPermission from "../../utils/checkPermission";

import PaginationComponent from "../../components/Pagination";
import {
  faArrowCircleUp,
  faArrowCircleDown,
  faCheckSquare,
  faWindowClose,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import BannerViewer from "./BannerViewer";

const BannerManagement = () => {
  const {
    t,
    pageBannerId,
    loading,
    handleCreateEdit,
    type,
    data,
    setShow,
    show,
    createUpdate,
    bannersList,
    submitLoading,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    page,
    setLimit,
    limit,
    setPage,
    totalPages,
    deleteLoading,
    selected,
    sort,
    setSort,
    over,
    setOver,
    setOrderBy,
    handleStatusShow,
    statusShow,
    setStatusShow,
    status,
    handleYes,
    updateStatusloading,
    bannerId,
    setBannerId,
    search,
    setSearch,
    bannerStatus,
    setBannerStatus,
    resetFilters,
    error,
    setError,
  } = useBannerManagement();

  const handleStatusModalClose = () => {
    setStatusShow(false); // close modal
    // resetFilters(); // reset filters
  };

  const { isHidden } = useCheckPermission();

  return (
    <>
      <>
        <Row>
          <Col>
            <h3>{t("casinoBannerManagement.title")}</h3>
          </Col>

          <Col xs="auto">
            <div className="d-flex justify-content-end align-items-center">
              <Button
                hidden={isHidden({ module: { key: "Banner", value: "C" } })}
                variant="success"
                size="sm"
                onClick={() => handleCreateEdit("Create", {})}
              >
                {t("casinoBannerManagement.uploadButton")}
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>Banner Id</Form.Label>
            <Form.Control
              type="search"
              value={bannerId}
              placeholder="Banner Id"
              onChange={(event) => {
                const inputValue = event?.target?.value;
                if (/^\d*$/.test(inputValue)) {
                  if (inputValue.length <= 10) {
                    setPage(1);
                    setBannerId(inputValue);
                    setError("");
                  } else {
                    setError("Banner Id cannot exceed 10 digits");
                  }
                }
              }}
            />
            {error && (
              <div style={{ color: "red", marginTop: "5px" }}>{error}</div>
            )}
          </Col>

          <Col xs={12} md={3} className="mb-3">
            <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
              <Form.Label>Search by Route</Form.Label>

              <Form.Control
                type="search"
                value={search}
                placeholder={"Search by Page or Navigation Route"}
                onChange={(event) => {
                  setPage(1);
                  setSearch(
                    event?.target?.value?.replace(/[~`!$%@^&*#=)()><?]+/g, "")
                  );
                }}
                style={{ minWidth: "230px" }}
              />
            </div>
          </Col>

          <Col xs={12} md={3} className="mb-3">
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                as="select"
                value={bannerStatus}
                onChange={(event) => {
                  setPage(1);
                  setBannerStatus(event?.target?.value);
                }}
              >
                <option value="all">All</option>
                <option value="true">Active</option>
                <option value="false">In-active</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={3} style={{ marginTop: "45px" }}>
            <Trigger message="Reset Filters" id={"redo"} />
            <Button
              id={"redo"}
              variant="success"
              onClick={resetFilters}
              style={{ position: "relative", top: "-14px" }}
            >
              <FontAwesomeIcon icon={faRedoAlt} />
            </Button>
          </Col>
        </Row>

        <Accordion>
          <Accordion.Item>
            <Accordion.Body>
              <Table
                bordered
                striped
                responsive
                hover
                size="sm"
                className="text-center mt-2"
              >
                <thead className="thead-dark">
                  <tr>
                    {tableHeaders.map((h, idx) => (
                      <th
                        key={idx}
                        onClick={() =>
                          h.value !== "mobileBannerImage" &&
                          h.value !== "bannerImage" &&
                          h.value !== "" &&
                          (setOrderBy(h.value) ||
                            setSort(sort === "ASC" ? "DESC" : "ASC"))
                        }
                        style={{
                          cursor: (h.value !== 'mobileBannerImage' &&
                            h.value !== 'bannerImage' &&
                            h.value !== "")
                            && 'pointer'
                        }}
                        className={
                          selected(h) ? "border-3 border border-blue" : ""
                        }
                      >
                        {t(h.labelKey)}{" "}
                        {selected(h) &&
                          (sort === "ASC" ? (
                            <FontAwesomeIcon
                              style={over ? { color: "red" } : {}}
                              icon={faArrowCircleUp}
                              onClick={() => setSort("DESC")}
                              onMouseOver={() => setOver(true)}
                              onMouseLeave={() => setOver(false)}
                            />
                          ) : (
                            <FontAwesomeIcon
                              style={over ? { color: "red" } : {}}
                              icon={faArrowCircleDown}
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
                      <td
                        colSpan={tableHeaders.length}
                        className="text-center py-5"
                      >
                        <span>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        </span>{" "}
                      </td>
                    </tr>
                  ) : bannersList?.rows?.length > 0 ? (
                    bannersList?.rows.map((item) => (
                      <tr key={item.pageBannerId}>
                        <td>{item.pageBannerId}</td>
                        {/* <td>{item.name}</td> */}
                        <td>
                          <BannerViewer
                            thumbnailUrl={item?.mobileBannerImage}
                            isMobile={true}
                          />
                        </td>

                        <td>
                          <BannerViewer
                            thumbnailUrl={item?.bannerImage}
                            isMobile={false}
                          />
                        </td>
                        {/* {
                            <td>{item.isActive ? "True" : "False"}</td>
                          } */}
                        <td>{item.pageRoute}</td>
                        <td>
                          {item?.navigateRoute ? item?.navigateRoute : "-"}
                        </td>
                        <td>
                          {item?.isActive ? (
                            <span className="text-success">Active</span>
                          ) : (
                            <span className="text-danger">In-Active</span>
                          )}
                        </td>

                        {!isHidden({
                          module: { key: "Banner", value: "U" },
                        }) ? (
                          <td>
                            <Trigger
                              message={t(
                                "casinoBannerManagement.updateMessage"
                              )}
                              id={item.pageBannerId + "warn"}
                            />
                            <Button
                              id={item.pageBannerId + "warn"}
                              size="sm"
                              variant="warning"
                              onClick={() => {
                                handleCreateEdit("Update", item);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Trigger
                              message={t("casinoBannerManagement.delete")}
                              id={item.pageBannerId + "delete"}
                            />
                            <Button
                              id={item.pageBannerId + "delete"}
                              className="m-1"
                              size="sm"
                              variant="danger"
                              hidden={isHidden({
                                module: { key: "Banner", value: "D" },
                              })}
                              onClick={() =>
                                handleDeleteModal(item.pageBannerId)
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                            {!item.isActive ? (
                              <>
                                <Trigger
                                  message="Set Status Active"
                                  id={item.pageBannerId + "active"}
                                />
                                <Button
                                  id={item.pageBannerId + "active"}
                                  className="m-1"
                                  size="sm"
                                  variant="success"
                                  onClick={() =>
                                    handleStatusShow(
                                      item.pageBannerId,
                                      item.isActive
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger
                                  message="Set Status In-Active"
                                  id={item.pageBannerId + "inactive"}
                                />
                                <Button
                                  id={item.pageBannerId + "inactive"}
                                  className="m-1"
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleStatusShow(
                                      item.pageBannerId,
                                      item.isActive
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faWindowClose} />
                                </Button>
                              </>
                            )}
                          </td>
                        ) : (
                          "NA"
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={tableHeaders.length}
                        className="text-danger text-center"
                      >
                        {t("casinoBannerManagement.noDataFound")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {bannersList?.count !== 0 && (
                <PaginationComponent
                  page={bannersList?.count < page ? setPage(1) : page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </>

      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}
      {statusShow && (
        <ConfirmationModal
          setShow={handleStatusModalClose}
          show={statusShow}
          handleYes={handleYes}
          active={status}
          loading={updateStatusloading}
          banner
        />
      )}
      <EditUploadBanner
        bannersList={bannersList}
        pageBannerId={pageBannerId}
        t={t}
        type={type}
        data={data}
        show={show}
        setShow={setShow}
        loading={submitLoading}
        createUpdate={createUpdate}
      />
    </>
  );
};

export default BannerManagement;

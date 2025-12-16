import Trigger from "../../components/OverlayTrigger";
import { tableHeaders } from "./constants";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import useCheckPermission from "../../utils/checkPermission";
import {
  faEdit,
  faTrash,
  faArrowCircleUp,
  faArrowCircleDown,
  faCheckSquare,
  faWindowClose,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
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
import PaginationComponent from "../../components/Pagination";
import BannerViewer from "../BannerManagement/BannerViewer.jsx";
import EditUploadPromotion from "./EditUploadPromotion.jsx";
import usePromotionManagement from "./usePromotionManagement";

const PromotionManagement = () => {
  const {
    t,
    loading,
    handleCreateEdit,
    type,
    data,
    setShow,
    show,
    createUpdate,
    promotionList,
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
    promotionThumbnailId,
    setPromotionThumbnailId,
    search,
    setSearch,
    promotionThumbnailStatus,
    setPromotionThumbnailStatus,
    resetFilters,
    error,
    setError,
  } = usePromotionManagement();
  const handleStatusModalClose = () => {
    setStatusShow(false); // close modal
    resetFilters(); // reset filters
  };

  const { isHidden } = useCheckPermission();

  return (
    <>
      {/* {loading && <Preloader />} ; */}
      <>
        <Row>
          <Col>
            <h3>Promotion Management</h3>
          </Col>

          <Col xs="auto">
            <div className="d-flex justify-content-end align-items-center">
              <Button
                hidden={isHidden({
                  module: { key: "PromotionThumbnail", value: "C" },
                })}
                variant="success"
                size="sm"
                onClick={() => handleCreateEdit("Create", {})}
              >
                Upload Button
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>Thumbnail Id</Form.Label>
            <Form.Control
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={promotionThumbnailId}
              placeholder="Promotion Thumbnail Id"
              onChange={(event) => {
                const inputValue = event?.target?.value;
                if (/^\d*$/.test(inputValue)) {
                  if (inputValue.length <= 10) {
                    setPage(1);
                    setPromotionThumbnailId(inputValue);
                    setError("");
                  } else {
                    setError("Promotion Thumbnail Id cannot exceed 10 digits");
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
              <Form.Label>Search</Form.Label>

              <Form.Control
                type="search"
                value={search}
                placeholder={"Search"}
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
                value={promotionThumbnailStatus}
                onChange={(event) => {
                  setPage(1);
                  setPromotionThumbnailStatus(event?.target?.value);
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
                        onClick={() => h.value !== "" && setOrderBy(h.value)}
                        style={{ cursor: (h.value !== "" && "pointer") }}
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
                  ) : promotionList?.rows?.length > 0 ? (
                    promotionList?.rows.map((item) => (
                      <tr key={item.promotionThumbnailId}>
                        <td>{item.promotionThumbnailId}</td>
                        <td>{item.name}</td>
                        <td>
                          <BannerViewer
                            thumbnailUrl={item?.promotionThumbnailImages}
                            isMobile={true}
                          />
                        </td>
                        <td>{item.navigateRoute || "-"}</td>
                        <td>
                          {item?.isActive ? (
                            <span className="text-success">Active</span>
                          ) : (
                            <span className="text-danger">In-Active</span>
                          )}
                        </td>

                        {!isHidden({
                          module: { key: "PromotionThumbnail", value: "U" },
                        }) ? (
                          <td>
                            <Trigger
                              message={"Update Thumbnail"}
                              id={item.promotionThumbnailId + "warn"}
                            />
                            <Button
                              id={item.promotionThumbnailId + "warn"}
                              size="sm"
                              variant="warning"
                              onClick={() => {
                                handleCreateEdit("Update", item);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Trigger
                              message={"Delete"}
                              id={item.promotionThumbnailId + "delete"}
                            />
                            <Button
                              id={item.promotionThumbnailId + "delete"}
                              className="m-1"
                              size="sm"
                              variant="danger"
                              hidden={isHidden({
                                module: {
                                  key: "PromotionThumbnail",
                                  value: "D",
                                },
                              })}
                              onClick={() =>
                                handleDeleteModal(item.promotionThumbnailId)
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                            {!item.isActive ? (
                              <>
                                <Trigger
                                  message="Set Status Active"
                                  id={item.promotionThumbnailId + "active"}
                                />
                                <Button
                                  id={item.promotionThumbnailId + "active"}
                                  className="m-1"
                                  size="sm"
                                  variant="success"
                                  onClick={() =>
                                    handleStatusShow(
                                      item.promotionThumbnailId,
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
                                  id={item.promotionThumbnailId + "inactive"}
                                />
                                <Button
                                  id={item.promotionThumbnailId + "inactive"}
                                  className="m-1"
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleStatusShow(
                                      item.promotionThumbnailId,
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
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {promotionList?.count !== 0 && (
                <PaginationComponent
                  page={promotionList?.count < page ? setPage(1) : page}
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
        />
      )}
      <EditUploadPromotion
        promotionList={promotionList}
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

export default PromotionManagement;

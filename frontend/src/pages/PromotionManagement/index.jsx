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
  Card,
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
import "./promotionManagement.scss";

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
      <div className="dashboard-typography promotion-management-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="promotion-management-page__title">Promotion Management</h3>
            <p className="promotion-management-page__subtitle">
              Manage promotion thumbnails, routing, and visibility
            </p>
          </div>

          <div className="promotion-management-page__actions">
            <Button
              hidden={isHidden({
                module: { key: "PromotionThumbnail", value: "C" },
              })}
              variant="primary"
              className="promotion-management-page__create-btn"
              size="sm"
              onClick={() => handleCreateEdit("Create", {})}
            >
              Upload
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters promotion-management-filters mb-4">
          <Card.Body>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={4} lg={3}>
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
                {error && <div className="text-danger mt-1">{error}</div>}
              </Col>

              <Col xs={12} md={4} lg={3}>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="search"
                  value={search}
                  placeholder="Search"
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event?.target?.value?.replace(/[~`!$%@^&*#=)()><?]+/g, ""));
                  }}
                />
              </Col>

              <Col xs={12} md={4} lg={3}>
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
              </Col>

              <Col xs={12} md={12} lg="auto">
                <Trigger message="Reset Filters" id={"redo"} />
                <Button id={"redo"} variant="secondary" onClick={resetFilters}>
                  <FontAwesomeIcon icon={faRedoAlt} />
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="promotion-management-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== "" && setOrderBy(h.value)}
                      style={{ cursor: h.value !== "" ? "pointer" : "default" }}
                      className={selected(h) ? "sortable active" : "sortable"}
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
                    <td colSpan={tableHeaders.length} className="text-center py-4">
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    </td>
                  </tr>
                ) : promotionList?.rows?.length > 0 ? (
                  promotionList?.rows.map((item) => (
                    <tr key={item.promotionThumbnailId}>
                      <td>{item.promotionThumbnailId}</td>
                      <td>{item.name}</td>
                      <td>
                        <BannerViewer thumbnailUrl={item?.promotionThumbnailImages} isMobile={true} />
                      </td>
                      <td>{item.navigateRoute || "-"}</td>
                      <td>
                        <span
                          className={
                            item?.isActive
                              ? "promotion-management-pill promotion-management-pill--active"
                              : "promotion-management-pill promotion-management-pill--inactive"
                          }
                        >
                          {item?.isActive ? "Active" : "In-Active"}
                        </span>
                      </td>

                      {!isHidden({
                        module: { key: "PromotionThumbnail", value: "U" },
                      }) ? (
                        <td>
                          <div className="promotion-management-actions">
                            <Trigger message={"Update Thumbnail"} id={item.promotionThumbnailId + "warn"} />
                            <Button
                              id={item.promotionThumbnailId + "warn"}
                              size="sm"
                              variant="warning"
                              className="promotion-management-icon-btn"
                              onClick={() => {
                                handleCreateEdit("Update", item);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>

                            <Trigger message={"Delete"} id={item.promotionThumbnailId + "delete"} />
                            <Button
                              id={item.promotionThumbnailId + "delete"}
                              size="sm"
                              variant="danger"
                              className="promotion-management-icon-btn"
                              hidden={isHidden({
                                module: { key: "PromotionThumbnail", value: "D" },
                              })}
                              onClick={() => handleDeleteModal(item.promotionThumbnailId)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>

                            {!item.isActive ? (
                              <>
                                <Trigger message="Set Status Active" id={item.promotionThumbnailId + "active"} />
                                <Button
                                  id={item.promotionThumbnailId + "active"}
                                  size="sm"
                                  variant="success"
                                  className="promotion-management-icon-btn"
                                  onClick={() => handleStatusShow(item.promotionThumbnailId, item.isActive)}
                                >
                                  <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger message="Set Status In-Active" id={item.promotionThumbnailId + "inactive"} />
                                <Button
                                  id={item.promotionThumbnailId + "inactive"}
                                  size="sm"
                                  variant="danger"
                                  className="promotion-management-icon-btn"
                                  onClick={() => handleStatusShow(item.promotionThumbnailId, item.isActive)}
                                >
                                  <FontAwesomeIcon icon={faWindowClose} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      ) : (
                        "NA"
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4 promotion-management-empty">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {promotionList?.count !== 0 && (
          <PaginationComponent
            page={promotionList?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>

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

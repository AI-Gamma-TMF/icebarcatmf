import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Row,
  Table,
  Form,
  Card,
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
import { InlineLoader } from "../../components/Preloader";
import "./bannerManagement.scss";

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
    orderBy,
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

  const isSortableHeader = (h) =>
    h?.value !== "mobileBannerImage" &&
    h?.value !== "bannerImage" &&
    h?.value !== "" &&
    h?.value !== "navigationRoute";

  const handleTableSort = (h) => {
    if (!isSortableHeader(h)) return;
    if (h.value === orderBy) {
      setSort(sort === "ASC" ? "DESC" : "ASC");
      return;
    }
    setOrderBy(h.value);
    setSort("ASC");
  };

  return (
    <>
      <div className="banner-page dashboard-typography">
        <Row className="d-flex align-items-center mb-2">
          <Col sm={8}>
            <h3 className="banner-page__title">{t("casinoBannerManagement.title")}</h3>
            <div className="banner-page__subtitle">
              {typeof bannersList?.count === "number" ? `${bannersList.count} banners` : ""}
            </div>
          </Col>

          <Col sm={4} className="d-flex justify-content-end">
            <Button
              hidden={isHidden({ module: { key: "Banner", value: "C" } })}
              variant="success"
              size="sm"
              className="banner-page__create-btn"
              onClick={() => handleCreateEdit("Create", {})}
            >
              {t("casinoBannerManagement.uploadButton")}
            </Button>
          </Col>
        </Row>

        <Card className="p-2 mb-2 banner-page__card">
          <Row className="dashboard-filters banner-filters g-3 align-items-end">
            <Col xs={12} md={3}>
              <Form.Label className="form-label">Banner Id</Form.Label>
              <Form.Control
                className="banner-filters__control"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
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
              {error ? <div className="banner-filters__error">{error}</div> : null}
            </Col>

            <Col xs={12} md={5}>
              <Form.Label className="form-label">Search by Route</Form.Label>
              <Form.Control
                className="banner-filters__control"
                type="search"
                value={search}
                placeholder="Search by Page or Navigation Route"
                onChange={(event) => {
                  setPage(1);
                  setSearch(event?.target?.value?.replace(/[~`!$%@^&*#=)()><?]+/g, ""));
                }}
              />
            </Col>

            <Col xs={12} md={3}>
              <Form.Group controlId="formStatus">
                <Form.Label className="form-label">Status</Form.Label>
                <Form.Select
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

            <Col xs={12} md="auto" className="ms-auto d-flex justify-content-end">
              <Trigger message="Reset Filters" id={"redo"} />
              <Button
                id={"redo"}
                variant="success"
                className="banner-page__reset-btn"
                onClick={resetFilters}
              >
                <FontAwesomeIcon icon={faRedoAlt} />
              </Button>
            </Col>
          </Row>

          <div className="dashboard-section-divider" />

          <div className="table-responsive banner-table-wrap">
            <Table hover size="sm" className="dashboard-data-table banner-table text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => {
                    const sortable = isSortableHeader(h);
                    return (
                      <th
                        key={idx}
                        onClick={() => sortable && handleTableSort(h)}
                        style={{ cursor: sortable ? "pointer" : "default" }}
                        className={selected(h) ? "border-3 border border-blue" : ""}
                      >
                        {t(h.labelKey)}{" "}
                        {selected(h) &&
                          (sort === "ASC" ? (
                            <FontAwesomeIcon
                              style={over ? { color: "red" } : {}}
                              icon={faArrowCircleUp}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSort("DESC");
                              }}
                              onMouseOver={() => setOver(true)}
                              onMouseLeave={() => setOver(false)}
                            />
                          ) : (
                            <FontAwesomeIcon
                              style={over ? { color: "red" } : {}}
                              icon={faArrowCircleDown}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSort("ASC");
                              }}
                              onMouseOver={() => setOver(true)}
                              onMouseLeave={() => setOver(false)}
                            />
                          ))}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {loading && !bannersList?.rows?.length ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : bannersList?.rows?.length > 0 ? (
                  <>
                    {bannersList.rows.map((item) => (
                      <tr key={item.pageBannerId}>
                        <td>{item.pageBannerId}</td>
                        <td>
                          <BannerViewer thumbnailUrl={item?.mobileBannerImage} isMobile={true} />
                        </td>
                        <td>
                          <BannerViewer thumbnailUrl={item?.bannerImage} isMobile={false} />
                        </td>
                        <td className="banner-table__route">{item.pageRoute}</td>
                        <td className="banner-table__route">
                          {item?.navigateRoute ? item?.navigateRoute : "-"}
                        </td>
                        <td>
                          {item?.isActive ? (
                            <span className="banner-pill banner-pill--active">Active</span>
                          ) : (
                            <span className="banner-pill banner-pill--inactive">In-active</span>
                          )}
                        </td>

                        {!isHidden({ module: { key: "Banner", value: "U" } }) ? (
                          <td className="banner-table__actions">
                            <div className="banner-actions">
                              <Trigger
                                message={t("casinoBannerManagement.updateMessage")}
                                id={item.pageBannerId + "warn"}
                              />
                              <Button
                                id={item.pageBannerId + "warn"}
                                size="sm"
                                variant="warning"
                                className="banner-icon-btn"
                                onClick={() => handleCreateEdit("Update", item)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>

                              <Trigger
                                message={t("casinoBannerManagement.delete")}
                                id={item.pageBannerId + "delete"}
                              />
                              <Button
                                id={item.pageBannerId + "delete"}
                                size="sm"
                                variant="danger"
                                className="banner-icon-btn"
                                hidden={isHidden({ module: { key: "Banner", value: "D" } })}
                                onClick={() => handleDeleteModal(item.pageBannerId)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>

                              {!item.isActive ? (
                                <>
                                  <Trigger message="Set Status Active" id={item.pageBannerId + "active"} />
                                  <Button
                                    id={item.pageBannerId + "active"}
                                    size="sm"
                                    variant="success"
                                    className="banner-icon-btn"
                                    onClick={() => handleStatusShow(item.pageBannerId, item.isActive)}
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
                                    size="sm"
                                    variant="danger"
                                    className="banner-icon-btn"
                                    onClick={() => handleStatusShow(item.pageBannerId, item.isActive)}
                                  >
                                    <FontAwesomeIcon icon={faWindowClose} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        ) : (
                          <td>NA</td>
                        )}
                      </tr>
                    ))}

                    {loading ? (
                      <tr>
                        <td colSpan={tableHeaders.length} className="text-center">
                          <InlineLoader />
                        </td>
                      </tr>
                    ) : null}
                  </>
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center">
                      <span className="banner-empty">{t("casinoBannerManagement.noDataFound")}</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {typeof bannersList?.count === "number" && bannersList.count !== 0 ? (
            <div className="banner-page__pagination">
              <PaginationComponent
                page={bannersList?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            </div>
          ) : null}
        </Card>
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

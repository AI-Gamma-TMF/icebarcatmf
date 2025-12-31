import { Button, Form, Row, Col, Table, Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faWindowClose,
  faTrash,
  faEye,
  faArrowCircleUp,
  faArrowCircleDown,
  faEdit,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import PaginationComponent from "../../components/Pagination";
import { tableHeaders } from "./constants";
import useStaffListing from "./hooks/useStaffListing";
import Trigger from "../../components/OverlayTrigger";
import packageTreeIcon from "../../assets/img/icons/package_tree.png";
import { AdminRoutes } from "../../routes";
import useCheckPermission from "../../utils/checkPermission";
import { useTranslation } from "react-i18next";
import { searchRegEx } from "../../utils/helper";
import { InlineLoader } from "../../components/Preloader";
import "./staff.scss";

const Staff = () => {
  const {
    navigate,
    loading,
    limit,
    setLimit,
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
    getRole,
    handleShow,
    handleYes,
    selected,
    active,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    deleteLoading,
    updateloading,
    role,
    setRole,
    status,
    setStatus,
    resetFilters,
  } = useStaffListing();

  const { isHidden } = useCheckPermission();
  const { t } = useTranslation(["staff"]);

  return (
    <>
      <div className="staff-page dashboard-typography">
        <Row className="d-flex align-items-center mb-2">
          <Col sm={8}>
            <h3 className="staff-page__title">{t("title")}</h3>
          </Col>

          <Col sm={4} className="d-flex justify-content-end">
            <Button
              variant="success"
              className="staff-page__create-btn"
              size="sm"
              onClick={() => navigate(AdminRoutes.CreateAdmin)}
              hidden={isHidden({ module: { key: "Admins", value: "C" } })}
            >
              {t("createButton")}
            </Button>
          </Col>
        </Row>

        <Card className="p-2 mb-2 staff-page__card">
          <Row className="dashboard-filters staff-filters g-3 align-items-end">
            <Col xs={12} md={4}>
              <Form.Label className="form-label">Search</Form.Label>
              <Form.Control
                className="staff-filters__control"
                type="search"
                placeholder="Email / Name / Group"
                value={search}
                onChange={(event) => {
                  setPage(1);
                  const mySearch = event.target.value.replace(searchRegEx, "");
                  setSearch(mySearch);
                }}
              />
            </Col>

            <Col xs={12} md={3}>
              <Form.Label className="form-label">Role</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setPage(1);
                  setRole(e.target.value);
                }}
                value={role}
              >
                <option value="all">All</option>
                <option value="1">Admin</option>
                <option value="2">Manager</option>
                <option value="3">Support</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={3}>
              <Form.Label className="form-label">Status</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                value={status}
              >
                <option value="all">All</option>
                <option value="true">Active</option>
                <option value="false">In-active</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={2} className="d-flex justify-content-end">
              <Trigger message="Reset Filters" id={"redo"} />
              <Button
                id={"redo"}
                className="staff-page__reset-btn"
                variant="success"
                onClick={resetFilters}
              >
                <FontAwesomeIcon icon={faRedoAlt} />
              </Button>
            </Col>
          </Row>

          <div className="dashboard-section-divider" />

          <div className="dashboard-table staff-table">
            <Table responsive className="dashboard-data-table staff-table__table">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => {
                    const isSortable = ["adminUserId", "email", "firstName"].includes(
                      h.value
                    );
                    return (
                      <th
                        key={idx}
                        onClick={() => isSortable && setOrderBy(h.value)}
                        className={[
                          isSortable ? "staff-table__th--sortable" : "",
                          selected(h) ? "staff-table__th--active" : "",
                        ].join(" ")}
                        style={{ cursor: isSortable ? "pointer" : "default" }}
                      >
                        <span className="staff-table__th-label">{t(h.labelKey)}</span>
                        {selected(h) && (
                          <span className="staff-table__sort-icon">
                            {sort === "asc" ? (
                              <FontAwesomeIcon
                                icon={faArrowCircleUp}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSort("desc");
                                }}
                                onMouseOver={() => setOver(true)}
                                onMouseLeave={() => setOver(false)}
                                className={over ? "is-hover" : ""}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faArrowCircleDown}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSort("asc");
                                }}
                                onMouseOver={() => setOver(true)}
                                onMouseLeave={() => setOver(false)}
                                className={over ? "is-hover" : ""}
                              />
                            )}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {data &&
                  data?.rows?.map(
                    ({
                      adminUserId,
                      email,
                      firstName,
                      lastName,
                      roleId,
                      isActive,
                      group,
                    }) => {
                      return (
                        <tr key={email}>
                          <td className="staff-table__id">{adminUserId}</td>
                          <td className="staff-table__email">
                            <button
                              type="button"
                              className="staff-table__link"
                              onClick={() =>
                                navigate(
                                  `${AdminRoutes.AdminDetails.split(":").shift()}${adminUserId}`
                                )
                              }
                            >
                              {email}
                            </button>
                          </td>
                          <td className="staff-table__name">
                            <Trigger message={`${firstName} ${lastName}`} id={adminUserId} />
                            <span id={adminUserId} className="d-inline-block text-truncate">
                              {firstName} {lastName}
                            </span>
                          </td>
                          <td>{getRole(roleId)}</td>
                          <td>{group || "-"}</td>
                          <td>
                            {isActive ? (
                              <span className="staff-pill staff-pill--active">
                                {t("activeStatus")}
                              </span>
                            ) : (
                              <span className="staff-pill staff-pill--inactive">
                                {t("inActiveStatus")}
                              </span>
                            )}
                          </td>
                          <td className="staff-table__actions">
                            <div className="staff-actions">
                              {getRole(roleId) !== "Admin" && (
                                <>
                                  <Trigger message="Edit" id={adminUserId + "edit"} />
                                  <Button
                                    className="staff-icon-btn"
                                    size="sm"
                                    variant="warning"
                                    onClick={() =>
                                      navigate(
                                        `${AdminRoutes.EditAdmin.split(":").shift()}${adminUserId}`
                                      )
                                    }
                                    hidden={isHidden({
                                      module: { key: "Admins", value: "U" },
                                    })}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                </>
                              )}

                              <Trigger message="View Details" id={adminUserId + "view"} />
                              <Button
                                id={adminUserId + "view"}
                                className="staff-icon-btn"
                                size="sm"
                                variant="info"
                                onClick={() =>
                                  navigate(
                                    `${AdminRoutes.AdminDetails.split(":").shift()}${adminUserId}`
                                  )
                                }
                                hidden={isHidden({
                                  module: { key: "Admins", value: "R" },
                                })}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>

                              {!isActive ? (
                                <>
                                  {getRole(roleId) !== "Admin" && (
                                    <>
                                      <Trigger
                                        message="Set Status Active"
                                        id={adminUserId + "active"}
                                      />
                                      <Button
                                        id={adminUserId + "active"}
                                        className="staff-icon-btn"
                                        size="sm"
                                        variant="success"
                                        onClick={() => handleShow(adminUserId, isActive)}
                                        hidden={isHidden({
                                          module: { key: "Admins", value: "T" },
                                        })}
                                      >
                                        <FontAwesomeIcon icon={faCheckSquare} />
                                      </Button>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {getRole(roleId) !== "Admin" && (
                                    <>
                                      <Trigger
                                        message="Set Status In-Active"
                                        id={adminUserId + "inactive"}
                                      />
                                      <Button
                                        id={adminUserId + "inactive"}
                                        className="staff-icon-btn"
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleShow(adminUserId, isActive)}
                                        hidden={isHidden({
                                          module: { key: "Admins", value: "T" },
                                        })}
                                      >
                                        <FontAwesomeIcon icon={faWindowClose} />
                                      </Button>
                                    </>
                                  )}
                                </>
                              )}

                              {getRole(roleId) !== "Support" && (
                                <>
                                  <Trigger message="View Tree" id={adminUserId + "tree"} />
                                  <Button
                                    id={adminUserId + "tree"}
                                    className="staff-icon-btn"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      navigate(
                                        `${AdminRoutes.AdminDetails.split(":").shift()}${adminUserId}`,
                                        { state: { isTreeView: true } }
                                      )
                                    }
                                    hidden={isHidden({
                                      module: { key: "Admins", value: "R" },
                                    })}
                                  >
                                    <img height="18px" src={packageTreeIcon} alt="Tree" />
                                  </Button>
                                </>
                              )}

                              {getRole(roleId) !== "Admin" && (
                                <>
                                  <Trigger message={"Delete"} id={adminUserId + "delete"} />
                                  <Button
                                    id={adminUserId + "delete"}
                                    className="staff-icon-btn"
                                    size="sm"
                                    variant="danger"
                                    hidden={isHidden({
                                      module: { key: "Admins", value: "D" },
                                    })}
                                    onClick={() => handleDeleteModal(adminUserId)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}

                {data?.count === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <span className="staff-empty">{t("noDataFound")}</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {loading && <InlineLoader />}
          {data?.count !== 0 && (
            <div className="staff-page__pagination">
              <PaginationComponent
                page={data?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            </div>
          )}
        </Card>
      </div>

      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={updateloading}
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
    </>
  );
};

export default Staff;

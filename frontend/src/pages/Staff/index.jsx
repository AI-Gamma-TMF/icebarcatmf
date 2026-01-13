import { Button, Form, Row, Col, Table, Card, Dropdown, ButtonGroup } from "@themesberg/react-bootstrap";
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
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import PaginationComponent from "../../components/Pagination";
import { tableHeaders } from "./constants";
import useStaffListing from "./hooks/useStaffListing";
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
              <Button
                id={"redo"}
                className="staff-page__reset-btn"
                variant="success"
                onClick={resetFilters}
                title="Reset Filters"
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
                            <span
                              className="d-inline-block text-truncate"
                              title={`${firstName} ${lastName}`}
                            >
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
                            <div className="staff-actions text-end">
                              <Dropdown align="end" drop="start">
                                <Dropdown.Toggle
                                  variant="secondary"
                                  className="staff-icon-btn staff-kebab-toggle"
                                  title="Actions"
                                >
                                  <FontAwesomeIcon icon={faEllipsisVertical} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                  className="staff-dropdown-menu"
                                  popperConfig={{ strategy: "fixed" }}
                                  renderOnMount
                                >
                                  {getRole(roleId) !== "Admin" &&
                                    !isHidden({ module: { key: "Admins", value: "U" } }) && (
                                      <Dropdown.Item
                                        onClick={() =>
                                          navigate(
                                            `${AdminRoutes.EditAdmin.split(":").shift()}${adminUserId}`
                                          )
                                        }
                                      >
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                      </Dropdown.Item>
                                    )}

                                  {!isHidden({ module: { key: "Admins", value: "R" } }) && (
                                    <Dropdown.Item
                                      onClick={() =>
                                        navigate(
                                          `${AdminRoutes.AdminDetails.split(":").shift()}${adminUserId}`
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon icon={faEye} /> View Details
                                    </Dropdown.Item>
                                  )}

                                  {getRole(roleId) !== "Admin" &&
                                    !isHidden({ module: { key: "Admins", value: "T" } }) && (
                                      <Dropdown.Item
                                        onClick={() => handleShow(adminUserId, isActive)}
                                        className={isActive ? "text-danger" : "text-success"}
                                      >
                                        <FontAwesomeIcon
                                          icon={isActive ? faWindowClose : faCheckSquare}
                                        />
                                        {isActive ? " Deactivate" : " Activate"}
                                      </Dropdown.Item>
                                    )}

                                  {getRole(roleId) !== "Support" &&
                                    !isHidden({ module: { key: "Admins", value: "R" } }) && (
                                      <Dropdown.Item
                                        onClick={() =>
                                          navigate(
                                            `${AdminRoutes.AdminDetails.split(":").shift()}${adminUserId}`,
                                            { state: { isTreeView: true } }
                                          )
                                        }
                                      >
                                        <img
                                          height="16px"
                                          src={packageTreeIcon}
                                          alt="Tree"
                                          style={{ marginRight: "10px" }}
                                        />
                                        View Tree
                                      </Dropdown.Item>
                                    )}

                                  {getRole(roleId) !== "Admin" &&
                                    !isHidden({ module: { key: "Admins", value: "D" } }) && (
                                      <>
                                        <Dropdown.Divider />
                                        <Dropdown.Item
                                          onClick={() => handleDeleteModal(adminUserId)}
                                          className="text-danger"
                                        >
                                          <FontAwesomeIcon icon={faTrash} /> Delete
                                        </Dropdown.Item>
                                      </>
                                    )}
                                </Dropdown.Menu>
                              </Dropdown>
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

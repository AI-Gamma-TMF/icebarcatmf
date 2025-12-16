import { Button, Form, Row, Col, Table } from "@themesberg/react-bootstrap";
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
      <Row className="staff-section">
        <Col className="col-8">
          <h3>{t("title")}</h3>
        </Col>

        <Col className="col-4">
          <div className="d-flex justify-content-end">
            {/* Button to create new admin */}
            <Button
              variant="success"
              className="m-1"
              size="sm"
              onClick={() => navigate(AdminRoutes.CreateAdmin)}
              hidden={isHidden({ module: { key: "Admins", value: "C" } })}
            >
              {t("createButton")}
            </Button>
          </div>
        </Col>
        <Col xs={12} md={3} className="mb-3">
          <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
            <Form.Label>Search by Email, Name or Group</Form.Label>

            <Form.Control
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(event) => {
                setPage(1);
                const mySearch = event.target.value.replace(searchRegEx, "");
                setSearch(mySearch);
              }}
            />
          </div>
        </Col>

        <Col xs={12} md={3} className="mb-3">
          <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
            <Form.Label>Role</Form.Label>

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
          </div>
        </Col>

        <Col xs={12} md={3} className="mb-3">
          <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
            <Form.Label>Status</Form.Label>

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
          </div>
        </Col>

        <Col xs={12} md={3} className="mb-3" style={{ marginTop: "30px" }}>
          <Trigger message="Reset Filters" id={"redo"} />
          <Button id={"redo"} variant="success" onClick={resetFilters}>
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>
        </Col>
      </Row>

      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className="mt-4 text-center"
      >
        <thead className="thead-dark text-center">
          <tr>
            {tableHeaders.map((h, idx) => (
              <th
                key={idx}
                //onClick={() => setOrderBy(h.value)}
                onClick={() =>
                  ["adminUserId", "email", "firstName"].includes(h.value) &&
                  setOrderBy(h.value)
                }
                style={{
                  cursor:
                    h.value === "adminUserId" ||
                    h.value === "email" ||
                    h.value === "firstName"
                      ? "pointer"
                      : "default",
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
                  <tr key={email} className="text-center">
                    <td>{adminUserId}</td>
                    <td>
                      <span
                        onClick={() =>
                          navigate(
                            `${AdminRoutes.AdminDetails.split(
                              ":"
                            ).shift()}${adminUserId}`
                          )
                        }
                        className="text-link"
                        style={{ cursor: "pointer" }}
                      >
                        {email}
                      </span>
                    </td>
                    <td>
                      <Trigger
                        message={`${firstName} ${lastName}`}
                        id={adminUserId}
                      />
                      <span
                        id={adminUserId}
                        style={{
                          width: "100px",
                          cursor: "pointer",
                        }}
                        className="d-inline-block text-truncate "
                      >
                        {firstName} {lastName}
                      </span>
                    </td>
                    <td>{getRole(roleId)}</td>

                    <td>{group || "-"}</td>

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
                    <td>
                      <>
                        {getRole(roleId) !== "Admin" && (
                          <>
                            <Trigger message="Edit" id={adminUserId + "edit"} />
                            <Button
                              className="m-1"
                              size="sm"
                              variant="warning"
                              onClick={() =>
                                navigate(
                                  `${AdminRoutes.EditAdmin.split(
                                    ":"
                                  ).shift()}${adminUserId}`
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

                        <Trigger
                          message="View Details"
                          id={adminUserId + "view"}
                        />
                        <Button
                          id={adminUserId + "view"}
                          className="m-1"
                          size="sm"
                          variant="info"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.AdminDetails.split(
                                ":"
                              ).shift()}${adminUserId}`
                            )
                          }
                          hidden={isHidden({
                            module: { key: "Admins", value: "R" },
                          })}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>

                        {/* <Button
                                    className='m-1'
                                    size='sm'
                                    variant='secondary'
                                  >
                                    <FontAwesomeIcon icon={faSitemap} />
                                  </Button> */}

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
                                  className="m-1"
                                  size="sm"
                                  variant="success"
                                  onClick={() =>
                                    handleShow(adminUserId, isActive)
                                  }
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
                                  className="m-1"
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleShow(adminUserId, isActive)
                                  }
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
                            <Trigger
                              message="View Tree"
                              id={adminUserId + "tree"}
                            />
                            <Button
                              id={adminUserId + "tree"}
                              className="m-1"
                              size="sm"
                              variant="secondary"
                              style={{ width: "35px" }}
                              onClick={() =>
                                navigate(
                                  `${AdminRoutes.AdminDetails.split(
                                    ":"
                                  ).shift()}${adminUserId}`,
                                  {
                                    state: {
                                      isTreeView: true,
                                    },
                                  }
                                )
                              }
                              hidden={isHidden({
                                module: { key: "Admins", value: "R" },
                              })}
                            >
                              <img height="20px" src={packageTreeIcon} />
                            </Button>
                          </>
                        )}
                        {getRole(roleId) !== "Admin" && (
                          <>
                            <Trigger
                              message={"Delete"}
                              id={adminUserId + "delete"}
                            />
                            <Button
                              id={adminUserId + "delete"}
                              className="m-1"
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
                      </>
                    </td>
                  </tr>
                );
              }
            )}

          {data?.count === 0 && (
            <tr>
              <td colSpan={7} className="text-danger text-center">
                {t("noDataFound")}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {loading && <InlineLoader />}
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

/* eslint-disable react/display-name */
import {
  faCheckSquare,
  faEdit,
  faEye,
  faWindowClose,
  faTrash,
  faArrowCircleUp,
  faArrowCircleDown,
  faCommentMedical,
  faPlusSquare,
  faComments,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Row, Col, Table } from "@themesberg/react-bootstrap";

import AddFaqModal from "./components/AddFaqModal";
import { tableHeaders } from "./constants";
import useGamePageListing from "./hooks/useGamePageLIsting";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import Trigger from "../../components/OverlayTrigger";
import PaginationComponent from "../../components/Pagination";
import { InlineLoader } from "../../components/Preloader";
import { AdminRoutes } from "../../routes";
import useCheckPermission from "../../utils/checkPermission";

const GamePageListing = () => {
  const {
    page,
    deleteLoading,
    limit,
    setPage,
    setLimit,
    setSearch,
    search,
    navigate,
    gamePageData,
    totalPages,
    loading,
    handleStatusShow,
    statusShow,
    setStatusShow,
    handleYes,
    status,
    active,
    setActive,
    t,
    over,
    setOver,
    selected,
    setOrderBy,
    sort,
    setSort,
    handleDeleteModal,
    handleFaQModal,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    updateloading,
    faQModalShow,
    setFaQModalShow,
    blogId,
    handleAddFaq,
  } = useGamePageListing();

  const { isHidden } = useCheckPermission();

  return (
    <>
      <Row>
        <Col className="col-10">
          <h3>{t("Game Pages")}</h3>
        </Col>
        <Col className="col-2 text-end">
          <Button
            variant="success"
            className="f-right"
            size="sm"
            onClick={() =>
              navigate(AdminRoutes.GamePageCreate, {
                state: {
                  gamePageData: gamePageData?.rows,
                },
              })
            }
            hidden={isHidden({ module: { key: "GamePages", value: "C" } })}
          >
            {t("createButton")}
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs="12" md="6" lg="3">
          <Form.Label>{t("filter.search")}</Form.Label>

          <Form.Control
            type="search"
            value={search}
            placeholder="Search title, slug"
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ""));
            }}
          />
        </Col>
        <Col xs="12" md="6" lg="3">
          <Form.Label>{t("filter.status.title")}</Form.Label>

          <Form.Select
            value={active}
            onChange={(event) => {
              setPage(1);
              setActive(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ""));
            }}
          >
            <option key="" value="all">
              {t("filter.status.options.all")}
            </option>
            <option key="true" value>
              {t("filter.status.options.active")}
            </option>
            <option key="false" value={false}>
              {t("filter.status.options.inActive")}
            </option>
          </Form.Select>
        </Col>
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
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== "" && setOrderBy(h.value)}
                  style={{
                    cursor: h.value !== "action" && "pointer",
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
              {Boolean(gamePageData) && gamePageData?.count > 0 ? (
                gamePageData?.rows?.map((gamePage) => {
                  const { gamePageId, title, slug, heading, isActive } =
                    gamePage;
                  return (
                    <tr key={gamePageId}>
                      <td>{gamePageId}</td>

                      <td>
                        <Trigger message={title} id={gamePageId} />
                        <span
                          id={gamePageId}
                          style={{
                            width: "150px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.GamePageDetails.split(
                                ":"
                              ).shift()}${gamePageId}`
                            )
                          }
                          className="text-link d-inline-block text-truncate"
                        >
                          {title}
                        </span>
                      </td>
                      <td>{heading}</td>
                      <td>{slug || "-"}</td>

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
                        <Trigger message="Edit" id={`${gamePageId}_Edit`} />
                        <Button
                          id={`${gamePageId}_Edit`}
                          className="m-1"
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.GamePageEdit.split(
                                ":"
                              ).shift()}${gamePageId}`
                            )
                          }
                          hidden={isHidden({
                            module: { key: "GamePages", value: "U" },
                          })}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Trigger
                          message="View Details"
                          id={`${gamePageId}_View`}
                        />
                        <Button
                          id={`${gamePageId}_View`}
                          className="m-1"
                          size="sm"
                          variant="info"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.GamePageDetails.split(
                                ":"
                              ).shift()}${gamePageId}`
                            )
                          }
                          hidden={isHidden({
                            module: { key: "GamePages", value: "R" },
                          })}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>

                        {!isActive ? (
                          <>
                            <Trigger
                              message="Set Active"
                              id={`${gamePageId}_Active`}
                            />
                            <Button
                              id={`${gamePageId}_Active`}
                              className="m-1"
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleStatusShow(gamePage, isActive)
                              }
                              hidden={isHidden({
                                module: { key: "GamePages", value: "T" },
                              })}
                            >
                              <FontAwesomeIcon icon={faCheckSquare} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Trigger
                              message="Set In-Active"
                              id={`${gamePageId}_in-Active`}
                            />
                            <Button
                              id={`${gamePageId}_in-Active`}
                              className="m-1"
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleStatusShow(gamePage, isActive)
                              }
                              hidden={isHidden({
                                module: { key: "GamePages", value: "T" },
                              })}
                            >
                              <FontAwesomeIcon icon={faWindowClose} />
                            </Button>
                          </>
                        )}

                        <Trigger
                          message={"Delete"}
                          id={gamePageId + "delete"}
                        />
                        <Button
                          id={gamePageId + "delete"}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          hidden={isHidden({
                            module: { key: "GamePages", value: "D" },
                          })}
                          onClick={() => handleDeleteModal(gamePageId)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>

                        <Trigger
                          message={"Add Faq"}
                          id={gamePageId + "_addFaq"}
                        />
                        <Button
                          id={gamePageId + "_addFaq"}
                          className="m-1"
                          size="sm"
                          variant="success"
                          hidden={isHidden({
                            module: { key: "GamePages", value: "C" },
                          })}
                          onClick={() => handleFaQModal(gamePageId)}
                        >
                          <FontAwesomeIcon icon={faCommentMedical} />
                        </Button>

                        <Trigger
                          message={"View Faq"}
                          id={gamePageId + "addFaq"}
                        />
                        <Button
                          id={gamePageId + "addFaq"}
                          className="m-1"
                          size="sm"
                          variant="info"
                          hidden={isHidden({
                            module: { key: "GamePages", value: "C" },
                          })}
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.ViewGamePageFaq.split(
                                ":"
                              ).shift()}${gamePageId}`
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faComments} />
                        </Button>

                        <Trigger
                          message={"Add Game Card"}
                          id={gamePageId + "addGameCard"}
                        />
                        <Button
                          id={gamePageId + "addGameCard"}
                          className="m-1"
                          size="sm"
                          variant="success"
                          hidden={isHidden({
                            module: { key: "GamePages", value: "C" },
                          })}
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.GamePageCard.split(
                                ":"
                              ).shift()}${gamePageId}`
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faPlusSquare} />
                        </Button>

                        <Trigger
                          message={"View Game Card"}
                          id={gamePageId + "viewGameCard"}
                        />
                        <Button
                          id={gamePageId + "viewGameCard"}
                          className="m-1"
                          size="sm"
                          variant="info"
                          hidden={isHidden({
                            module: { key: "GamePages", value: "C" },
                          })}
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.GamePageCardView.split(
                                ":"
                              ).shift()}${gamePageId}`
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faGamepad} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-danger text-center">
                    {t("noDataFound")}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      }
      {gamePageData?.count !== 0 && (
        <PaginationComponent
          page={gamePageData?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}

      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleYes}
        active={status}
        loading={updateloading}
      />
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}

      {faQModalShow && (
        <AddFaqModal
          show={faQModalShow}
          setShow={setFaQModalShow}
          handleSubmit={handleAddFaq}
          blogId={blogId}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default GamePageListing;

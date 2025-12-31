import React from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Form,
  Card,
} from "@themesberg/react-bootstrap";
import Datetime from "react-datetime";
import usePromotionListing from "./hooks/usePromotionLisiting";
import { tableHeaders } from "./constant";
import { formatDateMDY } from "../../utils/dateFormatter";
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faCheckSquare,
  faEdit,
  faEye,
  faWindowClose,
} from "@fortawesome/free-regular-svg-icons";
import { AdminRoutes } from "../../routes";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../components/Pagination";
import { InlineLoader } from "../../components/Preloader";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import { faTrash, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { formatAmountWithCommas, formatPriceWithCommas, searchRegEx } from "../../utils/helper";
import useCheckPermission from "../../utils/checkPermission";
import "./promotionBonusListing.scss";
const PromotionBonus = () => {
  const navigate = useNavigate();
  const {
    promotionList,
    selected,
    loading,
    page,
    totalPages,
    setPage,
    limit,
    setLimit,
    handleShow,
    show,
    setShow,
    handleYes,
    active,
    handleDelete,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    setSearch,
    search,
    setOrderBy,
    sort,
    over,
    setOver,
    setSort,
    deleteLoading,
    updateloading,
    affilId,
    setAffilId,
    bonusSC,
    setBonusSC,
    bonusGC,
    setBonusGC,
    statusFilter,
    setStatusFilter,
    validDate,
    setValidDate,
    resetFilters,
    AffilError,
    setAffilError,
    bonusScError,
    setBonusScError,
    bonusGcError,
    setBonusGcError,
  } = usePromotionListing();
  const { isHidden } = useCheckPermission();

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          className="affiliate-promo-page__create-btn"
          hidden={isHidden({ module: { key: "PromotionBonus", value: "C" } })}
          size="sm"
          onClick={() => navigate(AdminRoutes.PromotionBonusCreate)}
        >
          Create
        </Button>
      </div>

      <Card className="dashboard-filters affiliate-promo-filters mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={6} lg={4}>
              <Form.Label>Search by Promocode / Promocode Id</Form.Label>
              <Form.Control
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(event) => {
                  setPage(1);
                  const mySearch = event?.target?.value?.replace(searchRegEx, "");
                  setSearch(mySearch);
                }}
              />
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Form.Label>Affiliate Id</Form.Label>
              <Form.Control
                type="search"
                placeholder="Affiliate Id"
                value={affilId}
                onChange={(event) => {
                  const inputValue = event?.target?.value;
                  if (/^\d*$/.test(inputValue)) {
                    if (inputValue.length <= 10) {
                      setPage(1);
                      setAffilId(inputValue);
                      setAffilError("");
                    } else {
                      setAffilError("Affiliate Id cannot exceed 10 digits");
                    }
                  }
                }}
              />
              {AffilError && <div className="text-danger mt-1">{AffilError}</div>}
            </Col>

            <Col xs={12} md={6} lg={2}>
              <Form.Label>Bonus SC</Form.Label>
              <Form.Control
                type="search"
                placeholder="Bonus SC"
                value={bonusSC}
                onChange={(event) => {
                  const inputValue = event?.target?.value;
                  if (/^\d*\.?\d*$/.test(inputValue)) {
                    if (inputValue.length <= 10) {
                      setPage(1);
                      setBonusSC(inputValue);
                      setBonusScError("");
                    } else {
                      setBonusScError("Bonus SC cannot exceed 10 digits");
                    }
                  }
                }}
              />
              {bonusScError && <div className="text-danger mt-1">{bonusScError}</div>}
            </Col>

            <Col xs={12} md={6} lg={2}>
              <Form.Label>Bonus GC</Form.Label>
              <Form.Control
                type="search"
                placeholder="Bonus GC"
                value={bonusGC}
                onChange={(event) => {
                  const inputValue = event?.target?.value;
                  if (/^\d*\.?\d*$/.test(inputValue)) {
                    if (inputValue.length <= 10) {
                      setPage(1);
                      setBonusGC(inputValue);
                      setBonusGcError("");
                    } else {
                      setBonusGcError("Bonus GC cannot exceed 10 digits");
                    }
                  }
                }}
              />
              {bonusGcError && <div className="text-danger mt-1">{bonusGcError}</div>}
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setPage(1);
                  setStatusFilter(e?.target?.value);
                }}
                value={statusFilter}
              >
                <option value="all">All</option>
                <option value="true">Active</option>
                <option value="false">In-active</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Form.Label>Valid Till</Form.Label>
              <Datetime
                key={validDate}
                inputProps={{ placeholder: "MM-DD-YYYY", readOnly: true }}
                value={validDate}
                onChange={(date) => setValidDate(date)}
                timeFormat={false}
              />
            </Col>

            <Col xs={12} md={6} lg="auto">
              <Trigger message="Reset Filters" id={"redo"} />
              <Button id={"redo"} variant="secondary" onClick={resetFilters}>
                <FontAwesomeIcon icon={faRedoAlt} />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="dashboard-data-table">
        <div className="affiliate-promo-table-wrap">
          <Table bordered hover responsive size="sm" className="mb-0 text-center">
            <thead>
              <tr>
                {tableHeaders.map((h, idx) => (
                  <th
                    key={idx}
                    onClick={() =>
                      h.value !== "" && h.value !== "Action" && setOrderBy(h.value)
                    }
                    style={{
                      cursor: h.value !== "" && h.value !== "Action" ? "pointer" : "default",
                    }}
                    className={selected(h) ? "sortable active" : "sortable"}
                  >
                    {h.labelKey}{" "}
                    {selected(h) &&
                      (sort === "ASC" ? (
                        <FontAwesomeIcon
                          style={over ? { color: "red" } : {}}
                          icon={faArrowAltCircleUp}
                          onClick={() => setSort("DESC")}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          style={over ? { color: "red" } : {}}
                          icon={faArrowAltCircleDown}
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
                    <InlineLoader />
                  </td>
                </tr>
              ) : promotionList?.count > 0 ? (
                promotionList?.promoCodes?.map(
                  ({
                    promocodeId,
                    promocode,
                    affiliateId,
                    bonusSc,
                    bonusGc,
                    validTill,
                    isActive,
                  }) => {
                    return (
                      <tr key={promocodeId}>
                        <td>{promocodeId}</td>
                        <td>{promocode}</td>
                        <td>{affiliateId}</td>
                        <td>{formatPriceWithCommas(bonusSc)}</td>
                        <td>{formatAmountWithCommas(bonusGc)}</td>
                        <td>{validTill === null ? "-" : formatDateMDY(validTill)}</td>
                        <td>
                          <span
                            className={
                              isActive
                                ? "affiliate-promo-pill affiliate-promo-pill--active"
                                : "affiliate-promo-pill affiliate-promo-pill--inactive"
                            }
                          >
                            {isActive ? "Active" : "In-Active"}
                          </span>
                        </td>
                        {!isHidden({ module: { key: "PromotionBonus", value: "U" } }) ||
                        !isHidden({ module: { key: "PromotionBonus", value: "T" } }) ? (
                          <td>
                            <div className="affiliate-promo-actions">
                              <Trigger message={"View"} id={promocodeId + "view"} />
                              <Button
                                id={promocodeId + "view"}
                                className="affiliate-promo-icon-btn"
                                size="sm"
                                variant="info"
                                onClick={() =>
                                  navigate(
                                    `${AdminRoutes.PromotionBonusView.split(":").shift()}${promocodeId}`
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>

                              <Trigger message="Edit" id={promocodeId + "edit"} />
                              <Button
                                id={promocodeId + "edit"}
                                hidden={isHidden({ module: { key: "PromotionBonus", value: "U" } })}
                                className="affiliate-promo-icon-btn"
                                size="sm"
                                variant="warning"
                                onClick={() =>
                                  navigate(
                                    `${AdminRoutes.PromotionBonusEdit.split(":").shift()}${promocodeId}`
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>

                              <Trigger message="Delete" id={promocodeId + "delete"} />
                              <Button
                                id={promocodeId + "delete"}
                                hidden={isHidden({ module: { key: "PromotionBonus", value: "U" } })}
                                className="affiliate-promo-icon-btn"
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(promocodeId)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>

                              {!isActive ? (
                                <>
                                  <Trigger message="Set Status Active" id={promocodeId + "active"} />
                                  <Button
                                    id={promocodeId + "active"}
                                    hidden={isHidden({ module: { key: "PromotionBonus", value: "U" } })}
                                    className="affiliate-promo-icon-btn"
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleShow(promocodeId, isActive)}
                                  >
                                    <FontAwesomeIcon icon={faCheckSquare} />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Trigger message="Set Status In-Active" id={promocodeId + "inactive"} />
                                  <Button
                                    id={promocodeId + "inactive"}
                                    hidden={isHidden({ module: { key: "PromotionBonus", value: "U" } })}
                                    className="affiliate-promo-icon-btn"
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleShow(promocodeId, isActive)}
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
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-4 affiliate-promo-empty">
                    No Data Found
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

export default PromotionBonus;

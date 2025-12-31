import React from "react";
import { Button, Row, Col, Table, Form, Card } from "@themesberg/react-bootstrap";
import { CRM_PROMOTION_TYPE, tableHeaders } from "./constant";
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faEdit,
  faEye
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
import { searchRegEx } from "../../utils/helper";
import useCheckPermission from "../../utils/checkPermission";
import usePromoCodeListing from "./hooks/usePromoCodeListing";
import { STATUS_LABELS, statusOptions } from "../Promocode/constant";
import "./crmPromoCodeListing.scss";

const CRMPromoCode = () => {
  const navigate = useNavigate();
  const {
    promoCodeList,
    selected,
    loading,
    page,
    totalPages,
    setPage,
    limit,
    setLimit,
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
    selectedType,
    setSelectedType,
    promoName,
    setpromoName,
    discountPercentage,
    setDiscountPercentage,
    maxUsersAvailed,
    setMaxUsersAvailed,
    status,
    setStatus
  } = usePromoCodeListing();
  const { isHidden } = useCheckPermission();

  const resetFilters = () => {
    setSearch('')
    setDiscountPercentage('')
    setMaxUsersAvailed('')
    setStatus('all')
    setpromoName('')
    setSelectedType('')
  }

  return (
    <>
      <div className="dashboard-typography crm-promo-code-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="crm-promo-code-page__title">CRM Purchase Promo Codes</h3>
            <p className="crm-promo-code-page__subtitle">
              Create and manage CRM purchase promo codes and their status
            </p>
          </div>

          <div className="crm-promo-code-page__actions">
            <Button
              variant="primary"
              className="crm-promo-code-page__create-btn"
              hidden={isHidden({ module: { key: "Promocode", value: "C" } })}
              size="sm"
              onClick={() => {
                navigate(AdminRoutes.CrmPromoCodeCreate);
              }}
            >
              Create
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters crm-promo-code-filters mb-4">
          <Card.Body>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={6} lg={4}>
                <Form.Label>Search By Promocode / Promocode Id</Form.Label>
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
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Form.Label>Discount / Bonus Percentage</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Discount / Bonus Percentage"
                  value={discountPercentage}
                  onChange={(event) => {
                    const inputValue = event?.target?.value;
                    if (/^\d*$/.test(inputValue)) {
                      setPage(1);
                      setDiscountPercentage(inputValue);
                    }
                  }}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Form.Label>Max Users Availed</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Max Users Availed"
                  value={maxUsersAvailed}
                  onChange={(event) => {
                    const inputValue = event?.target?.value;
                    if (/^\d*$/.test(inputValue)) {
                      setPage(1);
                      setMaxUsersAvailed(inputValue);
                    }
                  }}
                />
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  as="select"
                  placeholder="Status"
                  value={status}
                  onChange={(event) => {
                    setPage(1);
                    setStatus(event.target.value);
                  }}
                >
                  {statusOptions?.map((status, _idx) => (
                    <option key={status.label} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Label>Promotion Name</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Search by Name"
                  value={promoName}
                  onChange={(event) => {
                    setPage(1);
                    const mySearch = event.target.value.replace(searchRegEx, "");
                    setpromoName(mySearch);
                  }}
                />
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Label>Promotion Type</Form.Label>
                <Form.Select
                  onChange={(e) => {
                    setPage(1);
                    setSelectedType(e.target.value);
                  }}
                  value={selectedType}
                >
                  {CRM_PROMOTION_TYPE &&
                    CRM_PROMOTION_TYPE?.map(({ label, value }) => (
                      <option key={label} value={value}>
                        {label}
                      </option>
                    ))}
                </Form.Select>
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
          <div className="crm-promo-code-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== "" && h.value !== "Action" && setOrderBy(h.value)}
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
                ) : promoCodeList?.promocodeDetail?.count > 0 ? (
                  promoCodeList.promocodeDetail.rows.map(
              ({
                promocodeId,
                promocode,
                discountPercentage,
                perUserLimit,
                maxUsersAvailed,
                // isActive,
                // validTill,
                crmPromotion,
                maxUsersAvailedCount,
                isDiscountOnAmount,
                status
              }) => (
                <tr key={promocodeId}>
                  <td>{promocodeId}</td>
                  <td>{promocode}</td>
                  <td>{crmPromotion.name}</td>
                  <td>{crmPromotion.promotionType}</td>
                  <td>{discountPercentage} {isDiscountOnAmount ? "% Discount" : "% Bonus"}</td>
                  <td>{perUserLimit}</td>
                  <td>{maxUsersAvailed === null ? "-" : maxUsersAvailed}</td>
                  <td>{maxUsersAvailedCount}</td>
                  {/* <td>{isActive ? "Active" : "Inactive"}</td> */}
                  <td>
                    <span
                      className={[
                        "crm-promo-code-pill",
                        status === 1
                          ? "crm-promo-code-pill--active"
                          : status === 0
                            ? "crm-promo-code-pill--upcoming"
                            : "crm-promo-code-pill--expired",
                      ].join(" ")}
                    >
                      {STATUS_LABELS[status] || "-"}
                    </span>
                  </td>


                  <td>
                    <div className="crm-promo-code-actions">
                      <Trigger message={"View"} id={promocodeId + "view"} />
                      <Button
                        id={promocodeId + "view"}
                        className="crm-promo-code-icon-btn"
                        size="sm"
                        variant="info"
                        onClick={() =>
                          navigate(`${AdminRoutes.CrmPromoCodeView.split(":").shift()}${promocode}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>

                      <Trigger message="Edit" id={promocodeId + "edit"} />
                      <Button
                        id={promocodeId + "edit"}
                        hidden={isHidden({
                          module: { key: "Promocode", value: "U" },
                        })}
                        className="crm-promo-code-icon-btn"
                        size="sm"
                        variant="warning"
                        disabled={status === 2}
                        onClick={() =>
                          navigate(
                            `${AdminRoutes.CrmPromoCodeEdit.split(":").shift()}${promocodeId}`
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>

                      <Trigger message="Delete" id={promocodeId + "delete"} />
                      <Button
                        id={promocodeId + "delete"}
                        hidden={isHidden({
                          module: { key: "Promocode", value: "U" },
                        })}
                        className="crm-promo-code-icon-btn"
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(promocode)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                    {/* {!isActive ? (
                      <>
                        <Trigger
                          message="Set Status Active"
                          id={promocodeId + "active"}
                        />
                        <Button
                          id={promocodeId + "active"}
                          hidden={isHidden({
                            module: { key: "Promocode", value: "U" },
                          })}
                          className="m-1"
                          size="sm"
                          variant="success"
                          onClick={() => handleShow(promocodeId, isActive)}
                        >
                          <FontAwesomeIcon icon={faCheckSquare} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Trigger
                          message="Set Status In-Active"
                          id={promocodeId + "inactive"}
                        />
                        <Button
                          id={promocodeId + "inactive"}
                          hidden={isHidden({
                            module: { key: "Promocode", value: "U" },
                          })}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          onClick={() => handleShow(promocodeId, isActive)}
                        >
                          <FontAwesomeIcon icon={faWindowClose} />
                        </Button>
                      </>
                    )} */}
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={tableHeaders.length} className="text-center py-4 crm-promo-code-empty">
                No Data Found
              </td>
            </tr>
          )}
              </tbody>
            </Table>
          </div>
        </div>

        {promoCodeList?.promocodeDetail?.count !== 0 && (
          <PaginationComponent
            page={promoCodeList?.count < page ? setPage(1) : page}
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
      </div>
    </>
  );
};

export default CRMPromoCode;

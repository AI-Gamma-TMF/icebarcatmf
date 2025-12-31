import React, { useEffect } from "react";
import { Button, Row, Col, Table, Form, Card } from "@themesberg/react-bootstrap";
import { CRM_PROMOTION_TYPE, tableHeaders } from "./constant";
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faEye,
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
import useCrmPromoCodeListing from "./hooks/usePromoCodeListing";
import "./crmPromoBonusListing.scss";

const CRMPromoBonus = () => {
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
    selectedType,
    setSelectedType,
    setpromoName,
    setIsActive,
    setScAmount,
    setGcAmount,
  } = useCrmPromoCodeListing();

  const { isHidden } = useCheckPermission();

  const resetFilters = () => {
    setSearch("");
    setIsActive("all");
    setpromoName("");
    setSelectedType("");
    setScAmount("");
    setGcAmount("");
  };
  useEffect(() => {
    if (promoCodeList?.details?.count < page && page !== 1) {
      setPage(1);
    }
  }, [promoCodeList?.details?.count, page]);
  return (
    <>
      <div className="dashboard-typography crm-promo-bonus-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="crm-promo-bonus-page__title">CRM Promo Bonus</h3>
            <p className="crm-promo-bonus-page__subtitle">
              Create and manage CRM promo bonus campaigns
            </p>
          </div>

          <div className="crm-promo-bonus-page__actions">
            <Button
              variant="primary"
              className="crm-promo-bonus-page__create-btn"
              hidden={isHidden({ module: { key: "CrmPromotion", value: "C" } })}
              size="sm"
              onClick={() => {
                navigate(AdminRoutes.CrmPromoBonusCreate);
              }}
            >
              Create
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters crm-promo-bonus-filters mb-4">
          <Card.Body>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={6} lg={4}>
                <Form.Label>Search By Promocode</Form.Label>
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
          <div className="crm-promo-bonus-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders?.map((h, idx) => (
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
                ) : promoCodeList?.details?.count > 0 ? (
                  promoCodeList?.details?.rows?.map(
                    ({ crmPromotionId, promocode, name, promotionType }) => {
                      return (
                        <tr key={crmPromotionId}>
                          <td>{promocode}</td>
                          <td>{name}</td>
                          <td>
                            {promotionType === "scheduled-campaign" ? "SCHEDULED" : "TRIGGERED"}
                          </td>
                          <td>
                            <div className="crm-promo-bonus-actions">
                              <Trigger message={"View"} id={crmPromotionId + "view"} />
                              <Button
                                id={crmPromotionId + "view"}
                                className="crm-promo-bonus-icon-btn"
                                size="sm"
                                variant="info"
                                onClick={() =>
                                  navigate(
                                    `${AdminRoutes.CrmPromoBonusView.split(":").shift()}${promocode}`
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>

                              <Trigger message="Delete" id={crmPromotionId + "delete"} />
                              <Button
                                id={crmPromotionId + "delete"}
                                hidden={isHidden({
                                  module: { key: "CrmPromotion", value: "U" },
                                })}
                                className="crm-promo-bonus-icon-btn"
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(promocode)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="text-center py-4 crm-promo-bonus-empty"
                    >
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {promoCodeList?.details?.count !== 0 && (
          <PaginationComponent
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
        />
      )}
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
        />
      )}
    </>
  );
};

export default CRMPromoBonus;

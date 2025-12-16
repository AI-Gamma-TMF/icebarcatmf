import React, { useEffect } from "react";
import { Button, Row, Col, Table, Form } from "@themesberg/react-bootstrap";
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
      <Row className="mb-2">
        <Col>
          <h3>CRM Promo Bonus</h3>
        </Col>
        <Col>
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              hidden={isHidden({ module: { key: "CrmPromotion", value: "C" } })}
              size="sm"
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigate(AdminRoutes.CrmPromoBonusCreate);
              }}
            >
              Create
            </Button>
          </div>
        </Col>
        <Row>
          <Col xs={12} md={3} className="mb-3">
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
          <Col xs={12} md={3} className="mb-3">
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
          <Col xs={12} md={3} style={{ marginTop: "25px" }} className="mb-3">
            <Trigger message="Reset Filters" id={"redo"} />
            <Button id={"redo"} variant="success" onClick={resetFilters}>
              <FontAwesomeIcon icon={faRedoAlt} />
            </Button>
          </Col>
        </Row>
      </Row>
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
            {tableHeaders?.map((h, idx) => (
              <th
                key={idx}
                onClick={() =>
                  h.value !== "" && h.value !== "Action" && setOrderBy(h.value)
                }
                style={{
                  cursor: (h.value !== "" && h.value !== "Action" && "pointer"),
                }}
                className={selected(h) ? "border-3 border border-blue" : ""}
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
          {promoCodeList?.details?.count > 0 ? (
            promoCodeList?.details?.rows?.map(
              ({
                crmPromotionId,
                promocode,
                name,
                promotionType,
              }) => {
                return (
                  <tr key={crmPromotionId}>
                    <td>{promocode}</td>
                    <td>{name}</td>
                    <td>
                      {promotionType === "scheduled-campaign"
                        ? "SCHEDULED"
                        : "TRIGGERED"}
                    </td>
                    <td>
                      <Trigger message={"View"} id={crmPromotionId + "view"} />
                      <Button
                        id={crmPromotionId + "view"}
                        className="m-1"
                        size="sm"
                        variant="info"
                        onClick={() =>
                          navigate(
                            `${AdminRoutes.CrmPromoBonusView.split(
                              ":"
                            ).shift()}${promocode}`
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      <Trigger
                        message="Delete"
                        id={crmPromotionId + "delete"}
                      />
                      <Button
                        id={crmPromotionId + "delete"}
                        hidden={isHidden({
                          module: { key: "CrmPromotion", value: "U" },
                        })}
                        className="m-1"
                        size="sm"
                        variant="warning"
                        onClick={() => handleDelete(promocode)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                );
              }
            )
          ) : (
            <tr>
              <td colSpan={10} className="text-danger text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {loading && <InlineLoader />}
      {promoCodeList?.details?.count !== 0 && (
        <PaginationComponent
          page={page}
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

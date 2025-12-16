import React from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Form,
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
      <Col className="mt-3">
        <div className="d-flex justify-content-between">
          <h3></h3>
          <Button
            variant="success"
            hidden={isHidden({ module: { key: "PromotionBonus", value: "C" } })}
            size="sm"
            style={{ marginRight: "10px" }}
            onClick={() => {
              navigate(AdminRoutes.PromotionBonusCreate);
            }}
          >
            Create
          </Button>
        </div>
      </Col>

      <Row>
        <Col xs={12} md={3} className="mb-3">
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

        <Col xs={12} md={3} className="mb-3">
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
          {AffilError && (
            <div style={{ color: "red", marginTop: "5px" }}>{AffilError}</div>
          )}
        </Col>

        <Col xs={12} md={3} className="mb-3">
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
          {bonusScError && (
            <div style={{ color: "red", marginTop: "5px" }}>{bonusScError}</div>
          )}
        </Col>
        <Col xs={12} md={3} className="mb-3">
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
          {bonusGcError && (
            <div style={{ color: "red", marginTop: "5px" }}>{bonusGcError}</div>
          )}
        </Col>

        <Col xs={12} md={3} className="mb-3">
          <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
            <Form.Label>Status</Form.Label>

            <Form.Select
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e?.target?.value);
              }}
              value={statusFilter}
              style={{ minWidth: "230px" }}
            >
              <option value="all">All</option>
              <option value="true">Active</option>
              <option value="false">In-active</option>
            </Form.Select>
          </div>
        </Col>

        <Col xs={12} md={3} className="mb-3">
          <Form.Label>Valid Till</Form.Label>
          <div className="d-flex scan-date align-items-center gap-2">
            <Datetime
              key={validDate}
              inputProps={{
                placeholder: "MM-DD-YYYY",
                readOnly: true,
              }}
              style={{ width: "100%" }}
              value={validDate}
              onChange={(date) => setValidDate(date)}
              timeFormat={false}
            />
          </div>
        </Col>

        <Col xs={12} md={3} className="mb-3" style={{ marginTop: "30px" }}>
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            className=""
            onClick={resetFilters}
          >
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
        className="text-center mt-4"
      >
        <thead className="thead-dark">
          <tr>
            {tableHeaders.map((h, idx) => (
              <th
                key={idx}
                onClick={() =>
                  h.value !== "" && h.value !== "Action" && setOrderBy(h.value)
                }
                style={{
                  cursor: ( h.value !== "" && h.value !== "Action" && "pointer"),
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

        {loading ? (
          <tr>
            <td colSpan={10} className="text-center">
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {promotionList?.count > 0 ? (
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
                      <td>
                        {validTill === null ? "-" : formatDateMDY(validTill)}
                      </td>
                      <td>
                        {isActive   
                            ? (
                              <span className='text-success'>Active</span>
                            )
                            : (
                              <span className='text-danger'>In-Active</span>
                            )}
                      </td>
                      {!isHidden({
                        module: { key: "PromotionBonus", value: "U" },
                      }) ||
                      !isHidden({
                        module: { key: "PromotionBonus", value: "T" },
                      }) ? (
                        <td>
                          <Trigger message={"View"} id={promocodeId + "view"} />
                          <Button
                            id={promocodeId + "view"}
                            className="m-1"
                            size="sm"
                            variant="info"
                            onClick={() =>
                              navigate(
                                `${AdminRoutes.PromotionBonusView.split(
                                  ":"
                                ).shift()}${promocodeId}`
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Trigger message="Edit" id={promocodeId + "edit"} />
                          <Button
                            id={promocodeId + "edit"}
                            hidden={isHidden({
                              module: { key: "PromotionBonus", value: "U" },
                            })}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() =>
                              navigate(
                                `${AdminRoutes.PromotionBonusEdit.split(
                                  ":"
                                ).shift()}${promocodeId}`
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Trigger
                            message="Delete"
                            id={promocodeId + "delete"}
                          />
                          <Button
                            id={promocodeId + "delete"}
                            hidden={isHidden({
                              module: { key: "PromotionBonus", value: "U" },
                            })}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() => handleDelete(promocodeId)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                          {!isActive ? (
                            <>
                              <Trigger
                                message="Set Status Active"
                                id={promocodeId + "active"}
                              />
                              <Button
                                id={promocodeId + "active"}
                                hidden={isHidden({
                                  module: { key: "PromotionBonus", value: "U" },
                                })}
                                className="m-1"
                                size="sm"
                                variant="success"
                                onClick={() =>
                                  handleShow(promocodeId, isActive)
                                }
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
                                  module: { key: "PromotionBonus", value: "U" },
                                })}
                                className="m-1"
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                  handleShow(promocodeId, isActive)
                                }
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </Button>
                            </>
                          )}
                        </td>
                      ) : (
                        "NA"
                      )}
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td colSpan={7} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>
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

import React from "react";
import { Button, Row, Col, Table, Form } from "@themesberg/react-bootstrap";
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
      <Row className="mb-2">
        <Col>
          <h3>CRM Purchase Promo Codes</h3>
        </Col>
        <Col>
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              hidden={isHidden({ module: { key: "Promocode", value: "C" } })}
              size="sm"
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigate(AdminRoutes.CrmPromoCodeCreate);
              }}
            >
              Create
            </Button>
          </div>
        </Col>
        <Row>
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>
              Search By Promocode / Promocode Id
            </Form.Label>
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
            <Form.Label>
              Discount / Bonus Percentage
            </Form.Label>
            <Form.Control
              type='search'
              placeholder='Discount / Bonus Percentage'
              value={discountPercentage}
              onChange={(event) => {
                const inputValue = event?.target?.value;
                if (/^\d*$/.test(inputValue)) {
                  setPage(1);
                  setDiscountPercentage(inputValue)
                }
              }}
            />
          </Col>

          <Col xs={12} md={3} className="mb-3">
            <Form.Label>
              Max Users Availed
            </Form.Label>
            <Form.Control
              type='search'
              placeholder='Max Users Availed'
              value={maxUsersAvailed}
              onChange={(event) => {
                const inputValue = event?.target?.value;
                if (/^\d*$/.test(inputValue)) {
                  setPage(1);
                  setMaxUsersAvailed(inputValue)
                }
              }}
            />
          </Col>

          <Col xs={12} md={3} className="mb-3">
            <Form.Group className='mb-3' controlId='formStatus'>
              <Form.Label >Status</Form.Label>
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
            </Form.Group>
          </Col>

          <Col xs={12} md={3}>
            <Form.Label>
              Promotion Name
            </Form.Label>
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
          <Col xs={12} md={3}>
            <Form.Label>
              Promotion Type
            </Form.Label>

            <Form.Select
              onChange={(e) => {
                setPage(1);
                setSelectedType(e.target.value);
              }}
              value={selectedType}
            >
              {/* <option value=''>{t('transactions.filters.actionTypeOpt')}</option> */}
              {CRM_PROMOTION_TYPE &&
                CRM_PROMOTION_TYPE?.map(({ label, value }) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
            </Form.Select>
          </Col>

          <Col xs={12} md={3} style={{ marginTop: "30px" }}>
            <Trigger message='Reset Filters' id={'redo'} />
            <Button
              id={'redo'}
              variant='success'
              onClick={resetFilters}
            >
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
            {tableHeaders.map((h, idx) => (
              <th
                key={idx}
                onClick={() => h.value !== "" && h.value !=='Action' && setOrderBy(h.value)}
                style={{
                  cursor: (h.value !== "" && h.value !=='Action' && "pointer"),
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
          {loading ? (
            <tr>
              <td colSpan={10} className="text-center">
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
                  <td>{STATUS_LABELS[status] || '-'}</td>


                  <td>
                    <Trigger message={"View"} id={promocodeId + "view"} />
                    <Button
                      id={promocodeId + "view"}
                      className="m-1"
                      size="sm"
                      variant="info"
                      onClick={() =>
                        navigate(
                          `${AdminRoutes.CrmPromoCodeView.split(
                            ":"
                          ).shift()}${promocode}`
                        )
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
                      className="m-1"
                      size="sm"
                      variant="warning"
                      disabled={status === 2}
                      onClick={() =>
                        navigate(
                          `${AdminRoutes.CrmPromoCodeEdit.split(
                            ":"
                          ).shift()}${promocodeId}`
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
                      className="m-1"
                      size="sm"
                      variant="warning"
                      onClick={() => handleDelete(promocode)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
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
              <td colSpan={10} className="text-danger text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
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
    </>
  );
};

export default CRMPromoCode;

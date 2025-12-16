import React from "react";
import {
  Button,
  Row,
  Col,
  Table,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";


import Trigger from "../../../components/OverlayTrigger";
import { AdminRoutes } from "../../../routes";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../../components/Pagination";
import { InlineLoader } from "../../../components/Preloader";
import { ConfirmationModal, DeleteConfirmationModal } from "../../../components/ConfirmationModal";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useCheckPermission from "../../../utils/checkPermission";
import { getDateTime } from "../../../utils/dateFormatter";
import useRedeemRulesListing from "../hooks/useRedeemRulesListing";





const RedeemRequestRule = () => {
  const navigate = useNavigate()
  const { promoCodeList, loading, page, totalPages, setPage, limit, setLimit, show, setShow, handleYes, active,
    handleDelete, handleDeleteYes, deleteModalShow, setDeleteModalShow, 
    // handleShow, setSearch, search, setOrderBy, sort, over, setOver, setSort, selected, 
    loadingDeleteRules, customerLoading }
    = useRedeemRulesListing();


  const { isHidden } = useCheckPermission()
  return (
    <>
      <Row className="mb-2">
        <Col>
          <h3>Rule Config</h3>
        </Col>
        <Col>
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              hidden={isHidden({ module: { key: 'PromotionBonus', value: 'C' } })}
              size="sm"
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigate(AdminRoutes.CreateRedeemReqRuleConfig);
              }}
            >
              Create
            </Button>
          </div>
        </Col>
        <Col xs={12}>
          {/* <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
            Search
          </Form.Label>

          <Form.Control
            type='search'
            placeholder='Search Promocode'
            value={search}
            style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
            onChange={(event) => {
              setPage(1)
              const mySearch = event.target.value.replace(searchRegEx, '')
              setSearch(mySearch)
            }}
          /> */}
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
            {/* {tableHeaders.map((h, idx) => (
              <th
                key={idx}
                onClick={() => h.value !== "" && setOrderBy(h.value)}
                style={{
                  cursor: "pointer",
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
            ))} */}
            <th>Rule Id</th>
            <th>Rule</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customerLoading ? (
            <tr><td colSpan={10}><InlineLoader /></td></tr>
          ) :
            promoCodeList?.redeemRules?.count > 0 ? (
              promoCodeList?.redeemRules?.rows?.map(
                ({
                  ruleId,
                  ruleName,
                  isActive,
                  createdAt
                }) => {
                  return (
                    <tr key={ruleId}>
                      <td>{ruleId}</td>
                      <td>{ruleName}</td>
                      <td>{getDateTime(createdAt)}</td>
                      <td>{isActive ? "Active" : "Inactive"}</td>
                      {/* <td>{formatDateMDY(createdAt)}</td> */}
                      {/* <td>{validTill === null ? "-" : formatDateMDY(validTill)}</td> */}
                      <td>
                        <Trigger message="Edit" id={ruleId + "edit"} />
                        <Button
                          id={ruleId + "edit"}
                          // hidden={isHidden({ module: { key: 'PromotionBonus', value: 'U' } })}
                          className="m-1"
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.EditRedeemReqRuleConfig.split(":").shift()}${ruleId}`
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Trigger message="Delete" id={ruleId + "delete"} />
                        <Button
                          id={ruleId + "delete"}
                          hidden={isHidden({ module: { key: 'PromotionBonus', value: 'U' } })}
                          className="m-1"
                          size="sm"
                          variant="warning"
                          onClick={() => handleDelete(ruleId)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                        {/* {!isActive ? (
                        <>
                          <Trigger
                            message="Set Status Active"
                            id={ruleId + "active"}
                          />
                          <Button
                            id={ruleId + "active"}
                            hidden={isHidden({ module: { key: 'PromotionBonus', value: 'U' } })}
                            className="m-1"
                            size="sm"
                            variant="success"
                            onClick={() => handleShow(ruleId, isActive)}
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
                            hidden={isHidden({ module: { key: 'PromotionBonus', value: 'U' } })}
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
                  );
                }
              )) :
              <tr>
                <td colSpan={10} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
          }
        </tbody>

      </Table>
      {loading && <InlineLoader />}
      {promoCodeList?.redeemRules?.count !== 0 && (
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
        />
      )}
      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
            loading={loadingDeleteRules}
          />)
      }
    </>
  );
};

export default RedeemRequestRule;

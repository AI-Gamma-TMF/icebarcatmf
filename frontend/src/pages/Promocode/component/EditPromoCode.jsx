import React, { useEffect } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Table,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";
import Datetime from "react-datetime";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate, useParams } from "react-router-dom";
import { editPromoSchema } from "../schemas.js";
import useEditPromoCode from "../hooks/useEditPromoCode.js";
import moment from "moment";
import PaginationComponent from "../../../components/Pagination/index.jsx";

const EditPromoCode = () => {
  const navigate = useNavigate();
  const { promocodeId } = useParams();
  // const yesterday = new Date(Date.now());



  const { promoDetail, packageData, handleEditPromotionBonusSubmit, selectedId, setSelectedId, handleSelectAll, handleAddGame, isInitialValues, updateLoading, loading, limit, setLimit, page, setPage, totalPages } = useEditPromoCode(promocodeId);

  useEffect(() => {
    if (promoDetail?.package) {
      setSelectedId(promoDetail.package);
    } else {
      setSelectedId([]);
    }
  }, [promoDetail]);

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Edit Purchase Promo Codes</h3>
        </Col>
      </Row>

      <Formik
        enableReinitialize={isInitialValues}
        initialValues={{
          promocode: promoDetail?.promocode || "",
          // isActive: promoDetail?.isActive || false,
          validTill: promoDetail?.validTill
            ? moment.utc(promoDetail.validTill).local()
            : "",
          validFrom: promoDetail?.validFrom
            ? moment.utc(promoDetail.validFrom).local()
            : "",
          maxUsersAvailed: promoDetail?.maxUsersAvailed || 0,
          maxUsersAvailedCount: promoDetail?.maxUsersAvailedCount,
          perUserLimit: promoDetail?.perUserLimit || 0,
          isDiscountOnAmount: promoDetail?.isDiscountOnAmount || false,
          discountPercentage: promoDetail?.discountPercentage || 0,
          // bonusPercentage: promoDetail?.bonusPercentage || 0,
          // isValidUntil: !!promoDetail?.validTill,
          description: promoDetail?.description || "",
        }}
        validationSchema={editPromoSchema(promoDetail?.maxUsersAvailedCount)}
        onSubmit={handleEditPromotionBonusSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <Row>
              <Col>
                <BForm.Label>
                  Promocode
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="promocode"
                  placeholder="Enter Promocode"
                  value={values.promocode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={promoDetail?.crmPromocode}
                />
                <ErrorMessage
                  component="div"
                  name="promocode"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>Discount on Amount</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="isDiscountOnAmount"
                  checked={values.isDiscountOnAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
              <Col>
                <BForm.Label>
                  {values.isDiscountOnAmount
                    ? "Discount Percentage On Amount"
                    : "Bonus Coins percentage"}
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-top">
                      Enter zero if you do not want to add a limit.
                    </Tooltip>
                  }
                >
                  <BForm.Control
                    type="number"
                    name="discountPercentage"
                    placeholder="Enter Percentage"
                    min="0"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    max="100"
                    value={values.discountPercentage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="discountPercentage"
                  className="text-danger"
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  Max Users Availed (Zero as none limit)
                </BForm.Label>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-top">
                      Enter zero if you do not want to add a limit.
                    </Tooltip>
                  }
                >
                  <BForm.Control
                    type="number"
                    name="maxUsersAvailed"
                    placeholder="Enter Max Users Availed"
                    min="0"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    value={values.maxUsersAvailed}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="maxUsersAvailed"
                  className="text-danger"
                />
              </Col>

              <Col>
                <BForm.Label>
                  Per Promocode User Limit (Zero as none limit)
                </BForm.Label>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-top">
                      Enter zero if you do not want to add a limit.
                    </Tooltip>
                  }
                >
                  <BForm.Control
                    type="number"
                    name="perUserLimit"
                    placeholder="Enter Per User Limit"
                    min="0"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    value={values.perUserLimit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="perUserLimit"
                  className="text-danger"
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  Promo Code Description
                  {/* <span className="text-danger"> *</span> */}
                </BForm.Label>
                <BForm.Control
                  as="textarea"
                  name="description"
                  placeholder="Enter description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="description"
                  className="text-danger"
                />
              </Col>
              {/* <Col md={2}>
                <BForm.Label>Active</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="isActive"
                  checked={values.isActive}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col> */}

              <Col md={4} lg={3}>
                <BForm.Label>Valid From</BForm.Label>
                <Datetime
                  inputProps={{
                    placeholder: "MM-DD-YYYY",
                    disabled: promoDetail?.status === 1, // if promocode ongoing admin will not edit valid from
                    readOnly: true,
                  }}
                  dateFormat="MM/DD/YYYY"
                  timeFormat={true}
                  isValidDate={(current) =>
                    current.isAfter(moment().subtract(1, "days"))
                  }
                  onChange={(e) => setFieldValue("validFrom", moment(e).utc())}
                  value={
                    values.validFrom ? moment(values.validFrom).local() : ""
                  }
                />
                <ErrorMessage
                  component="div"
                  name="validFrom"
                  className="text-danger"
                />
              </Col>

              {/* <Col md={2}>
                <BForm.Label>Valid Until</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="isValidUntil"
                  checked={values.isValidUntil}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col> */}
              {/* {values.isValidUntil && ( */}
              <Col md={4} lg={3}>
                <BForm.Label>Valid Till</BForm.Label>
                <Datetime
                  inputProps={{
                    placeholder: "MM-DD-YYYY",
                    disabled: false,
                    readOnly: true,
                  }}
                  dateFormat="MM/DD/YYYY"
                  timeFormat={true}
                  isValidDate={(current) =>
                    current.isAfter(moment().subtract(1, "days"))
                  }
                  onChange={(e) => setFieldValue("validTill", moment(e).utc())}
                  value={
                    values.validTill ? moment(values.validTill).local() : ""
                  }
                />
                <ErrorMessage
                  component="div"
                  name="validTill"
                  className="text-danger"
                />
              </Col>
              {/* )} */}
            </Row>

            <Row className="mt-3">
              <BForm.Label>Package Details</BForm.Label>
              <Col md={2}>
                {selectedId?.length > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => setSelectedId([])}
                    style={{ width: "100px", marginTop: "20px" }}
                  >
                    Clear
                  </Button>
                )}
              </Col>
              <div style={{ overflow: "auto" }}>
                <Table
                  bordered
                  striped
                  hover
                  size="sm"
                  className="text-center mt-4"
                >
                  <thead className="thead-dark">
                    <tr>
                      <th>
                        <input
                          name="selectAll"
                          type="checkbox"
                          className="form-check-input cursor-pointer"
                          checked={
                            selectedId?.length > 0 &&
                            selectedId?.length === packageData?.rows?.length
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>Package ID</th>
                      <th>Amount</th>
                      <th>GC + Bonus GC Coin</th>
                      <th>SC + Bonus SC Coin</th>
                      <th>Package Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        </td>
                      </tr>
                    ) : packageData?.rows?.length > 0 ? (
                      packageData.rows.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <input
                              name="select"
                              type="checkbox"
                              className="form-check-input cursor-pointer"
                              checked={selectedId.includes(item.packageId)}
                              onChange={(e) => handleAddGame(e, item)}
                            />
                          </td>
                          <td>{item.packageId}</td>
                          <td>{item.amount}</td>
                          <td>
                            {item.gcCoin} + {item.bonusGc}
                          </td>
                          <td>
                            {item.scCoin} + {item.bonusSc}
                          </td>
                          <td>
                            {item.welcomePurchaseBonusApplicable
                              ? "Welcome Purchase Package"
                              : item.firstPurchaseApplicable &&
                                item.isSpecialPackage
                              ? "Special First Purchase Package"
                              : item.firstPurchaseApplicable
                              ? "First Purchase Package"
                              : item.isSpecialPackage
                              ? "Special Package"
                              : "Basic Package"}
                          </td>
                          <td>{item.isActive ? "Active" : "Inactive"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-danger text-center">
                          No Data Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <BForm.Label>
                  Note: The promo code is not applicable to any special bonus
                  packages.
                </BForm.Label>
              </div>
            </Row>
            {packageData?.count !== 0 && packageData?.rows?.length > 0 && (
              <PaginationComponent
                page={packageData?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button
                variant="warning"
                onClick={() => navigate(AdminRoutes.PromoCodeBonus)}
              >
                Cancel
              </Button>

              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={updateLoading}
              >
                Submit
                {updateLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditPromoCode;

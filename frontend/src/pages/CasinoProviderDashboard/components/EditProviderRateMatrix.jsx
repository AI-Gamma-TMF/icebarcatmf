import { Formik, Form, ErrorMessage, Field } from "formik";
import { Col, Row, Form as BForm, Button, Spinner, Table } from "@themesberg/react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useEditProviderRate from "../hooks/useEditProviderRate.js";
import { providerSchema } from "../schema.js";
import { providerRateTableHeaders } from "../constant.js";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { InlineLoader } from "../../../components/Preloader/index.jsx";
import { formatNumber } from "../../../utils/helper.js";
import Trigger from "../../../components/OverlayTrigger/index.jsx";
import useCheckPermission from "../../../utils/checkPermission.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteConfirmationModal } from "../../../components/ConfirmationModal/index.jsx";
import { useEffect, useState } from "react";
import { toast } from "../../../components/Toast/index.jsx";
import { AdminRoutes } from "../../../routes.js";

const EditProviderRateMatrix = () => {
  const navigate = useNavigate();
  const { isHidden } = useCheckPermission()
  const { providerId } = useParams();
  const {
    matrixDetails,
    loading,
    handleEditProviderRateSubmit,
    updateLoading,
    isInitialValues,
    setIsInitialValues,
    setOrderBy,
    selected,
    over,
    setOver,
    sort,
    setSort,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleDelete,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,
  } = useEditProviderRate(providerId);

  const [rateList, setRateList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [initialRateList, setInitialRateList] = useState([]);

  const getNextMinGGR = () => {
    if (rateList.length === 0) return 0;
    const last = rateList[rateList.length - 1];
    return (last?.ggrMaximum ?? last?.ggrMinimum) + 1;
  };



  const handleDelete2 = (index, rateId) => {
    const updatedList = [...rateList];
    updatedList.splice(index, 1); // Remove the selected item

    // If there's a next item, update its ggrMinimum
    if (index < updatedList.length && index > 0) {
      const prevItem = updatedList[index - 1];
      updatedList[index] = {
        ...updatedList[index],
        ggrMinimum: (prevItem.ggrMaximum ?? prevItem.ggrMinimum) + 1,
      };
    }

    // Edge case: if first item is deleted, ensure the new first item starts at 0
    if (index === 0 && updatedList.length > 0) {
      updatedList[0] = {
        ...updatedList[0],
        ggrMinimum: 0,
      };
    }
    setRateList(updatedList);
    // handleDelete(rateId)
  };

  const handleEdit = (index, setValues) => {
    const rate = rateList[index];
    setValues({
      ggrMinimum: rate.ggrMinimum,
      ggrMaximum: rate.ggrMaximum ?? '',
      rate: rate.rate,
    });
    setEditIndex(index);
  };

  useEffect(() => {
    if (matrixDetails?.providerRateDetail?.rows?.length) {
      const cleanedRates = [...matrixDetails.providerRateDetail.rows]
        .map(item => ({
          rateId: item.rateId,
          ggrMinimum: Number(item.ggrMinimum),
          ggrMaximum: item.ggrMaximum !== null ? Number(item.ggrMaximum) : null,
          rate: Number(item.rate)
        }))
        .sort((a, b) => a.ggrMinimum - b.ggrMinimum); // Ensure ascending order

      setRateList(cleanedRates);
      setInitialRateList(cleanedRates);
    }
  }, [matrixDetails]);

  const isRateListChanged = () => {
    if (initialRateList.length !== rateList.length) return true;

    return rateList.some((rate, index) => {
      const initial = initialRateList[index];
      return (
        rate.ggrMinimum !== initial.ggrMinimum ||
        rate.ggrMaximum !== initial.ggrMaximum ||
        rate.rate !== initial.rate
      );
    });
  };


  console.log("rates", rateList);

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Edit Provider Rate Matrix</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            enableReinitialize
            initialValues={{
              ggrMinimum: getNextMinGGR(),
              ggrMaximum: '',
              rate: '',
              aggregatorName: matrixDetails?.aggregatorName || '',
              providerName: matrixDetails?.providerName || ''
            }}
            validationSchema={providerSchema}
            onSubmit={(values, { resetForm }) => {
              const normalizeMax = (val) => {
                if (val === '' || val === null || String(val).toLowerCase() === 'infinite') return null;
                return Number(val);
              };

              const updatedRate = {
                ggrMinimum: Number(values.ggrMinimum),
                ggrMaximum: normalizeMax(values.ggrMaximum),
                rate: Number(values.rate),
              };

              let updatedList = [...rateList];

              if (editIndex !== null) {
                // Remove overlapping entries with updated range (excluding the one being edited)
                updatedList = updatedList.filter((item, index) => {
                  if (index === editIndex) return true; // keep the edited one for now
                  const inRange = (
                    (item.ggrMinimum >= updatedRate.ggrMinimum && item.ggrMinimum <= updatedRate.ggrMaximum) ||
                    (item.ggrMaximum !== null &&
                      item.ggrMaximum >= updatedRate.ggrMinimum &&
                      item.ggrMaximum <= updatedRate.ggrMaximum)
                  );
                  return !inRange;
                });

                // Update the edited item
                updatedList[editIndex] = updatedRate;

                // Sort again by ggrMinimum to maintain order
                updatedList.sort((a, b) => a.ggrMinimum - b.ggrMinimum);

                // Update the next item's ggrMinimum if needed
                const nextIndex = updatedList.findIndex((_, idx) => idx > editIndex);
                if (nextIndex !== -1) {
                  updatedList[nextIndex] = {
                    ...updatedList[nextIndex],
                    ggrMinimum: (updatedRate.ggrMaximum ?? updatedRate.ggrMinimum) + 1,
                  };
                }

                setEditIndex(null);
              } else {
                // New entry
                if (updatedList.length > 0) {
                  updatedList[updatedList.length - 1].ggrMaximum = updatedRate.ggrMinimum - 1;
                }
                updatedList.push(updatedRate);
              }

              // Final sort and state update
              updatedList.sort((a, b) => a.ggrMinimum - b.ggrMinimum);
              setRateList(updatedList);

              resetForm({
                values: {
                  ggrMinimum: updatedRate.ggrMaximum !== null ? updatedRate.ggrMaximum + 1 : 0,
                  ggrMaximum: '',
                  rate: '',
                },
              });
            }}

          >
            {({ handleSubmit, setValues, values }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="my-3">
                  <Col sm={6} lg={6}>
                    <BForm.Label>
                      Aggregator
                    </BForm.Label>
                    <BForm.Control
                      type="text"
                      name="aggregatorName"
                      value={values.aggregatorName}
                      disabled
                    />
                  </Col>

                  <Col sm={6} lg={6}>
                    <BForm.Label>
                      Game Provider
                    </BForm.Label>
                    <BForm.Control
                      type="text"
                      name="providerName"
                      value={values.providerName}
                      disabled
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={3}>
                    <BForm.Label>Min GGR <span className="text-danger">*</span></BForm.Label>
                    <Field className="form-control" name="ggrMinimum" type="number" disabled />
                    <ErrorMessage name="ggrMinimum" className="text-danger" component="div" />
                  </Col>
                  <Col md={3}>
                    <BForm.Label>Max GGR (add "infinite" for last range) <span className="text-danger">*</span></BForm.Label>
                    <Field className="form-control" name="ggrMaximum" type="text" onKeyDown={(evt) => ['E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()} />
                    <ErrorMessage name="ggrMaximum" className="text-danger" component="div" />
                  </Col>
                  <Col md={3}>
                    <BForm.Label>Rate (%) <span className="text-danger">*</span></BForm.Label>
                    <Field className="form-control" name="rate" type="number" />
                    <ErrorMessage name="rate" className="text-danger" component="div" />
                  </Col>

                  <Col md={3} >
                    <Button
                      style={{ marginTop: '32px' }}
                      variant="primary"
                      type="submit"
                      disabled={editIndex === null && rateList.length > 0 && rateList[rateList.length - 1].ggrMaximum === null}
                    >
                      {editIndex !== null ? 'Update' : 'Add'}
                    </Button>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xs="auto">
                    <h5 className="mb-0">Provider Rates Matrix</h5>
                  </Col>

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
                        {providerRateTableHeaders.map((h, idx) => (
                          <th
                            key={idx}
                            // onClick={() => h.value !== 'action' &&
                            //   h.value !== 'gameName' &&
                            //   h.value !== 'winningDate' &&
                            //   setOrderBy(h.value)}
                            // style={{
                            //   cursor: "pointer",
                            // }}
                            className={selected(h) ? "border-3 border border-blue" : ""}
                          >
                            {h.labelKey}{" "}
                            {/* {selected(h) &&
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
                              ))} */}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center">
                            <InlineLoader />
                          </td>
                        </tr>
                      ) : rateList.length > 0 ? (
                        rateList.map(({ ggrMinimum, ggrMaximum, rate, rateId }, index) => (
                          <tr key={index}>
                            <td>{formatNumber(ggrMinimum, { isDecimal: true })}</td>
                            <td>{ggrMaximum !== null ? formatNumber(ggrMaximum, { isDecimal: true }) : "Infinite"}</td>
                            <td>{rate}</td>
                            <td>
                              <Trigger message="Edit" id={`edit-${index}`} />
                              <Button
                                id={`edit-${index}`}
                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                className="m-1"
                                size="sm"
                                variant="warning"
                                onClick={() => handleEdit(index, setValues)}
                              // disabled={ggrMaximum === null}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              {
                                rateList.length === 1 ?
                                  <>
                                    <Trigger message="Delete" id={`delete-${index}`} />
                                    <Button
                                      id={rateId + "delete"}
                                      hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                      className="m-1"
                                      size="sm"
                                      variant="warning"
                                      onClick={() => handleDelete(providerId)}
                                    // disabled={status === 1 || status === 2}
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                  </> :
                                  <>
                                    <Trigger message="Delete" id={`delete-${index}`} />
                                    <Button
                                      id={`delete-${index}`}
                                      hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                      className="m-1"
                                      size="sm"
                                      variant="warning"
                                      onClick={() => handleDelete2(index, rateId)}
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                  </>
                              }
                            </td>
                          </tr>
                        )
                        )
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-danger text-center">
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Row>
              </Form>
            )}
          </Formik>
          <div className="text-end mt-3">
            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button variant="warning" onClick={() => navigate(AdminRoutes.DashboardCasinoProviders, {
                state: { openMatrixOnce: true }
              })}>
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => {

                  if (rateList.length === 0) return;

                  const firstNodeInvalid = rateList[0].ggrMinimum !== 0;
                  if (firstNodeInvalid) {
                    toast('First GGR minimum must start from 0.', 'error');
                    return;
                  }

                  const lastIndex = rateList.length - 1;
                  const lastNode = rateList[lastIndex];

                  const invalidNodeIndex = rateList.findIndex((node, idx) => {
                    return node.ggrMaximum === null && idx !== lastIndex;
                  });

                  if (rateList.length >= 1 && lastNode.ggrMaximum !== null) {
                    toast('Please add one more slab with GGR Maximum as null (infinite range).', 'error');
                    return;
                  }

                  if (invalidNodeIndex !== -1) {
                    toast('Only the last slab can have "infinite" GGR (i.e., ggrMaximum: null).', 'error');
                    return;
                  }

                  if (rateList.length === 1 && lastNode.ggrMaximum !== null) {
                    toast('If only one slab exists, it must end with an infinite GGR (ggrMaximum: null).', 'error');
                    return;
                  }


                  const payload = {
                    aggregatorId: matrixDetails?.aggregatorId || "",
                    providerId: matrixDetails?.providerId || "",
                    rateEntries: rateList,
                  };

                  handleEditProviderRateSubmit(payload);
                }}
                disabled={updateLoading || !isRateListChanged()}
              >
                Submit All Rates
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



          </div>
        </Col>

        {deleteModalShow &&
          (
            <DeleteConfirmationModal
              deleteModalShow={deleteModalShow}
              setDeleteModalShow={setDeleteModalShow}
              handleDeleteYes={handleDeleteYes}
              loading={deleteLoading}
            />)
        }
      </Row>
      <Row className="ms-1 mt-1 fw-bold">
        <div style={{ marginTop: '10px', color: '#555', fontSize: '14px' }}>
          <strong>Note:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
            <li>The first rate <strong>must start at 0 GGR</strong> (e.g., 0 - 1000).</li>
            <li>The final rate <strong>must end at ∞ (infinity)</strong> (e.g., 5000 - ∞).</li>
            <li>Ensure the ranges are:
              <ul>
                <li>Continuous (no gaps),</li>
                <li>Non-overlapping,</li>
                <li>In increasing order based on GGR.</li>
              </ul>
            </li>
          </ul>
        </div>
      </Row>
    </div >
  );
};

export default EditProviderRateMatrix;

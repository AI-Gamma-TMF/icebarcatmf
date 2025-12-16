import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row, Form as BForm, Spinner } from '@themesberg/react-bootstrap'
import { faPlus, faPenToSquare, faTrashCan , faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Formik, ErrorMessage } from 'formik'
import { userStatusSchema } from '../../PlayerDetails/components/EditInfo/schema'
import CreateReason from './CreateReason'
import usePlayerStatus from '../hooks/usePlayerStatus'
import { userStatus, userStatus2 } from '../constant'
import EditDeleteReason from './EditDelete'
import { DeleteConfirmationModal } from '../../../components/ConfirmationModal'


export const PlayerStatusModal = ({ show, setShow, status, playerId, loading, setBtnClick }) => {
  const [isFav, setIsFav] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showEditDeleteReasonModal, setShowEditDeleteReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [selectedReasonId, setSelectedReasonId] = useState(null);
  const [reasons, setReasons] = useState([]);
  const [deleteModalShow, setDeleteModalShow] = useState(false)

  const {
    t,
    reasonData,
    updateUserStatusMutation,
    isAccountClose,
    setIsAccountClose,
    deleteReasonMutation,
    userStatusDetails
  } = usePlayerStatus({playerId, setBtnClick});

  useEffect(() => {
    if (reasonData?.data?.rows) {
      setReasons(reasonData.data.rows);
      setIsAccountClose((status === 'Active' || status === 'Internal-User') ? true : false)
    }
  }, [reasonData]);

  const handleReasonChange = (e, setFieldValue) => {
    const reasonId = e.target.value;
    const reason = reasons.find(r => r.reasonId === parseInt(reasonId));
    setSelectedReason(reasonId);
    setFieldValue('reasonId', reason?.reasonId || '');
    setFieldValue('reasonTitle', reason?.reasonTitle || '');
    setFieldValue('reasonDescription', reason?.reasonDescription || '');
  };

  const handleDelete = (id) => {
    setSelectedReasonId(id);
    setDeleteModalShow(true)
  }

  return (
      <Formik
        initialValues={{
          reasonTitle: '',
          reasonDescription: '',
          type: 12,
          favorite: false,
          isAllowToSentEmail: true,
          clearUserWallet: false,
          clearUserVault: false,
          cancelRedeemRequest: false,
          customDescription: null
        }}
        validationSchema={userStatusSchema()}
        onSubmit={
          (formValues, { resetForm }) => {
            const data = {
              "userId": playerId,
              "reasonId": formValues.reasonId,
              "type": status === "Active" ? Number(formValues.type) : userStatus2[status] ? userStatus2[status][1] : 4,
              "favorite": isFav,
              "action": (status === 'Active' || status === 'Internal-User') ? true : false,
              "isAccountClose": (status === 'Active' || status === 'Internal-User') ? true : false,
              "isAllowToSentEmail": formValues.isAllowToSentEmail,
              "cancelRedeemRequest": formValues.type === '2' ? false: formValues.cancelRedeemRequest,
              "clearUserVault": formValues.type === '2' ? false: formValues.clearUserVault,
              "clearUserWallet": formValues.type === '2' ? false: formValues.clearUserWallet,
              customDescription: formValues.reasonDescription ? formValues.reasonDescription : null,
            };
            updateUserStatusMutation({
              ...data,
            });
            resetForm();
            setIsFav(false);
            setShow(false);
          }
        }
      >
        {({ values, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue, }) => (
          <Modal size='lg' show={show} onHide={() => {
            setShow(false);
            setIsFav(false)
            resetForm();
          }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to change the status of {userStatusDetails?.username}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {userStatusDetails?.statusDetails && userStatusDetails?.statusDetails?.remark &&
              <div style={{display:"flex",justifyContent:"space-between"}} >
                <div style={{display:"flex",gap:"10px"}}>
                  <h6>Remark :</h6>
                  <p>{userStatusDetails?.statusDetails?.remark}</p>
                </div>
                <div style={{display:"flex",gap:"10px"}}>
                  <h6>Posted By :</h6>
                  {userStatusDetails?.statusDetails?.moreDetails ?
                    <p>{userStatusDetails?.statusDetails?.moreDetails?.firstName} {userStatusDetails?.statusDetails?.moreDetails?.lastName}</p> :
                    <p>Admin</p>
                  }
                </div>
              </div>  
            }
              <Row className="mt-3">
                <Col>
                  <BForm.Label>
                    Reason Type
                    <span className='text-danger'> *</span>
                  </BForm.Label>
                  <BForm.Select
                    name='type'
                    value={status === "Active" ? values.type : userStatus2[status] ? userStatus2[status][1] : 4}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={status !== "Active"}
                  >
                    {status === "Active" ? userStatus.map((statusObj) => (
                      <option disabled={status !== "Active"} key={statusObj.value} value={statusObj.value}>
                        {statusObj.label}
                      </option>
                    ))
                      : <option key={userStatus2[status] ? userStatus2[status][1] : 4} value={userStatus2[status] ? userStatus2[status][1] : 4}>
                        {userStatus2[status] ? userStatus2[status][0] : "None"}
                      </option>
                    }
                  </BForm.Select>
                </Col>
              </Row>

              <Row className="mt-3">
                <BForm.Label>
                  Select Reason
                  <span className='text-danger'>*</span>
                </BForm.Label>
                <Col md={12} sm={12} className=''>

                  <div className='w-100' style={{ marginRight: '5px' }}>
                    <BForm.Select
                      name='reasonTitle'
                      value={selectedReason}
                      onChange={(e) => handleReasonChange(e, setFieldValue)}
                      onBlur={handleBlur}
                    >
                      <option value="" label="Select reason" />
                      {reasons.map((reason) => (
                        <option key={reason.reasonId} value={reason.reasonId}>
                          <div>
                            <span> {reason.reasonTitle} </span>
                            {reason.reasonCount > 0 && (<span> ( count:  {reason.reasonCount})</span>)}
                          </div>
                        </option>

                      ))}
                    </BForm.Select>
                    <ErrorMessage
                      component='div'
                      name='reasonTitle'
                      className='text-danger'
                    />
                    <div className='mt-2'>
                      <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => setShowReasonModal(true)}><FontAwesomeIcon icon={faPlus} />  Add Reason</span>
                      {values.reasonTitle &&
                        <>
                          <span style={{ marginLeft: '15px', color: '#1976d2', cursor: 'pointer' }} onClick={() => setShowEditDeleteReasonModal(true)}> <FontAwesomeIcon icon={faPenToSquare} /> Edit Reason</span>
                          <span style={{ marginLeft: '15px', color: '#1976d2', cursor: 'pointer' }} onClick={() => handleDelete(values.reasonId)}><FontAwesomeIcon icon={faTrashCan} /> Delete Reason</span>
                        </>}
                    </div>
                  </div>
                </Col>               
              </Row>
              <Row className="mt-3">
                <Col>
                  <BForm.Label>
                    Description
                    <span className='text-danger'> *</span>
                  </BForm.Label>
                  <BForm.Control
                    as='textarea'
                    name='reasonDescription'
                    placeholder={'Enter Reason Description'}
                    style={{ height: '150px' }}
                    value={values.reasonDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    component='div'
                    name='reasonDescription'
                    className='text-danger'
                  />
                </Col>
              </Row>

              {(status !== "Internal-User" && values.type !== "4") && <><Row className="mt-3">
                <Col className='d-flex'>
                  <BForm.Check
                    type='checkbox'
                    className='me-2'
                    name='isAllowToSentEmail'
                    onChange={(e) => { setFieldValue('isAllowToSentEmail', e.target.checked) }}
                    onBlur={handleBlur}
                    value={values.isAllowToSentEmail}
                    defaultChecked={values.isAllowToSentEmail}
                  />
                  <BForm.Label>
                    Send Email
                  </BForm.Label>

                </Col>
              </Row>
                {(status === "Active" && Number(values.type) !== 2 ) &&<>
                  <Row className="mt-2">
                    <Col className='d-flex'>
                      <BForm.Check
                        type='checkbox'
                        className='me-2'
                        name='isCountDown'
                        onChange={(e) => { setFieldValue('cancelRedeemRequest', e.target.checked) }}
                        onBlur={handleBlur}
                        value={values.isCountDown}
                        defaultChecked={values.isCountDown}
                      />
                      <BForm.Label>
                        Cancel all redeem request
                      </BForm.Label>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col className='d-flex'>
                      <BForm.Check
                        type='checkbox'
                        className='me-2'
                        name='clearUserWallet'
                        onChange={(e) => { setFieldValue('clearUserVault', e.target.checked) }}
                        onBlur={handleBlur}
                        value={values.clearUserWallet}
                        defaultChecked={values.clearUserWallet}
                      />
                      <BForm.Label>
                        Clear vault
                      </BForm.Label>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col className='d-flex'>
                      <BForm.Check
                        type='checkbox'
                        className='me-2'
                        name='clearUserWallet'
                        onChange={(e) => { setFieldValue('clearUserWallet', e.target.checked) }}
                        onBlur={handleBlur}
                        value={values.clearUserWallet}
                        defaultChecked={values.clearUserWallet}
                      />
                      <BForm.Label>
                        Clear wallet
                      </BForm.Label>
                    </Col>
                  </Row>                  
                </>}
              </>}

              <Row className="mt-2">
                <Col className='d-flex'>
                  <div className='fab-icon me-2'>
                    <FontAwesomeIcon
                      icon={faStar}
                      size='1x'
                      style={{ color: isFav ? '#ffdd77' : '' }}
                      onClick={() => setIsFav(!isFav)}
                    />
                  </div>
                  <BForm.Label>
                    Favourite
                  </BForm.Label>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <Button variant='secondary' onClick={handleSubmit} disabled={loading} >
                {t('confirmationModal.yes')} {loading&& <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />}
              </Button>

              <Button variant='primary' onClick={() => {
                setFieldValue('favorite', isFav)
                setIsFav(false)
                setShow(false);
                resetForm(); 
              }}>
                {t('confirmationModal.no')}
              </Button>
            </Modal.Footer>
            <CreateReason
              show={showReasonModal}
              setShow={setShowReasonModal}
              selectedReason={values.reasonTitle}
              reasonsList={reasonData?.data?.rows ?? []}
              isAccountClose={isAccountClose}
            />

            <EditDeleteReason
              show={showEditDeleteReasonModal}
              setShow={setShowEditDeleteReasonModal}
              selectedReason={values.reasonTitle}
              reasonsList={reasonData?.data?.rows ?? []}
              isAccountClose={isAccountClose}
              onComplete={(obj) => {
                setFieldValue('packageType', obj.value || '');
                // setFieldValue('reasonDescription', '');
                // setFieldValue('reasonTitle', '');
                // setFieldValue('reasonId', '');
                // setFieldValue('packageType', '');

                setFieldValue('reasonDescription', obj?.reasonDescription || '');
                setFieldValue('reasonTitle', obj?.reasonTitle ?? '');
                setFieldValue('reasonId', obj?.reasonId ?? '');
              }}
            />

            {deleteModalShow && (
              <DeleteConfirmationModal
                handleDeleteYes={() => {
                  setDeleteModalShow(false);
                  deleteReasonMutation({ reasonId: selectedReasonId });
                  setFieldValue('reasonDescription', ''); 
                  setFieldValue('reasonTitle', '');
                }}
                setDeleteModalShow={setDeleteModalShow}
                deleteModalShow={deleteModalShow}
              />
            )}
          </Modal>
        )}
      </Formik>
  );
};
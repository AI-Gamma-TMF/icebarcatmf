import React from 'react'
import {
  Button,
  Row,
  Col,
  Accordion,
  Modal,
  Form
} from '@themesberg/react-bootstrap'

import useEmailTemplate from './hooks/useEmailTemplate'
import { useNavigate } from 'react-router-dom'
import { AdminRoutes } from '../../routes'
import { getDateTimeByYMD } from '../../utils/dateFormatter'
import Preloader from '../../components/Preloader'
import { DeleteConfirmationModal } from '../../components/ConfirmationModal'

const EmailTemplate = () => {
  const navigate = useNavigate()
  const {
    loading,
    emailTemplates,
    show,
    setShow,
    templateData,
    manualModalData,
    t,
    isHidden,
    lang,
    setLang,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow
  } = useEmailTemplate()

  return (
    <>
      <Row>
        <Col>
          <h3>{t('title')}</h3>
        </Col>
        <Col xs='auto'>
          <Button
            variant='success'
            className='f-right'              
            size='sm'
            onClick={() => navigate(AdminRoutes.CreateEmailTemplate)}
            hidden={isHidden({ module: { key: 'EmailTemplate', value: 'C' } })}
          >
            {t('createButton')}
          </Button>
        </Col>
      </Row>
      {loading ? <Preloader /> : emailTemplates && <Accordion defaultActiveKey={emailTemplates?.['Manual'] && Object.values(emailTemplates?.['Manual']).length === 0 ? 1 : 0}>
        {/* {emailTemplateOrder?.map(

          (template, index) =>
            Object.prototype.hasOwnProperty.call(emailTemplates, template) && 
              Object.values(emailTemplates?.[template]).length !== 0 && <Accordion.Item
                eventKey={index}
                key={`${template}-${index}`}
              >
                <Accordion.Header>{template}</Accordion.Header>
                <Accordion.Body className='p-1 p-md-2'>
                 <Table
                    bordered
                    striped
                    responsive
                    hover
                    size='sm'
                    className='text-center'
                  >
                    <thead className='thead-dark'>
                      {template === 'Manual' ? <tr>
                        {[t('table.id'), t('table.label'), t('table.status'), t('table.action')].map((c) => {
                          return ( <th key={c}>{c}</th>)
                        })}
                      </tr> : <tr>
                        {[t('table.id'), t('table.label'), t('table.action')].map((c) => {
                          return ( <th key={c}>{c}</th>)
                        })}
                      </tr>}
                    </thead>
                    <tbody>
                      {typeof(emailTemplates?.[`${template}`]) === 'object' && Object.values(emailTemplates?.[`${template}`]).map(
                        ({
                          emailTemplateId,
                          label,
                          isComplete,
                          templateCode,
                          actionEmailType,
                          dynamicData,
                          scheduledAt
                        }) => {
                          return (
                            <tr key={emailTemplateId}>
                              <td>{emailTemplateId}</td>
                              <td>{label}</td>
                              {actionEmailType === 'manual' && <td>{isComplete === 1 ? 'Initiate' : isComplete === 2 ? 'Inprogress' : isComplete === 3 ? 'Complete' : isComplete === 4 ? 'Fail' : '-'}</td>}
                              <td>
                                
                                  <Trigger message='Edit' id={emailTemplateId+'edit'} />
                                    <Button
                                    id={emailTemplateId+'edit'}
                                      className='m-1'
                                      size='sm'
                                      variant='warning'
                                      hidden={isHidden({ module: { key: 'EmailTemplate', value: 'U' } })}
                                      onClick={() =>
                                        index === 0 ? navigate(
                                      `${AdminRoutes.EditManualTemplate.split(':').shift()}${emailTemplateId}`
                                        ) : navigate(
                                          `${AdminRoutes.EditEmailTemplates.split(':').shift()}${emailTemplateId}`
                                            )}
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </Button>

                                  <Trigger message={t('toggle')} id={emailTemplateId+'toggle'} />
                                    <Button
                                    id={emailTemplateId+'toggle'}
                                      className='m-1'
                                      size='sm'
                                      variant='info'
                                      onClick={() =>
                                        setModalData(
                                          {data:{templateCode,actionEmailType, dynamicData, label, scheduledAt}}
                                        )}
                                    >
                                      <FontAwesomeIcon icon={faEye} />
                                    </Button>
                                    {actionEmailType === 'manual' && <>
                                      <Trigger message={'Delete'} id={emailTemplateId +'delete'} />
                                      <Button
                                      id={emailTemplateId +'delete'}
                                        className='m-1'
                                        size='sm'
                                        variant='danger'
                                        hidden={isHidden({ module: { key: 'EmailTemplate', value: 'D' } })}
                                        onClick={() => handleDeleteModal(emailTemplateId)}
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </Button>
                                    </>}
                                
                              </td>
                            </tr>
                          )
                        }
                      )
                    }
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            
        )} */}
      </Accordion>}

      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
          />)}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName='modal-90w'
        size='lg'
        aria-labelledby='example-custom-modal-styling-title'
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <Row className="m-3">
            <Col>
              <Form.Label>{t('language')}</Form.Label>
            </Col>
            <Col>
              <Form.Select
                name='language'
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value)
                }}
              >
                <option value='EN'>{t('english')}</option>
              </Form.Select>
            </Col>
          </Row>
          {manualModalData.actionEmailType === 'manual' && 
          <>
          <Row className="m-3">
            <Col>
              <Form.Label>{'Schedule time'}</Form.Label>
            </Col>
            <Col>
              {getDateTimeByYMD(manualModalData?.scheduledAt)}
            </Col>
          </Row>
          <Row className="m-3">
            <Col>
              <Form.Label>{'Subject'}</Form.Label>
            </Col>
            <Col>
              {manualModalData?.label}
            </Col>
          </Row>
          </>
          }
          <Row className="m-3">
          <div
            dangerouslySetInnerHTML={{
              __html: templateData?.[lang]
            }}
          />
          </Row>
        </Modal.Body>
      </Modal>   
    </>
  )
}

export default EmailTemplate
import React, { useEffect } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Modal,
} from '@themesberg/react-bootstrap'
import useAddAsset from '../../hooks/useAddAsseet'
import { PAGE_ASSET_TYPE } from '../../constants'
import { createAssetSchema } from '../../schema'
import Trigger from '../../../../components/OverlayTrigger'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../content-page.scss'
import draftToHtml from 'draftjs-to-html'
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js'

const AddNewAsset = ({
  t,
  pageId,
  selectedAsset,
  assetType,
  handleClose,
  showModal,
  type
}) => {
  const {
    loading,
    createAsset,
    updateAsset,
    editorState,
    setEditorState,
    onPopupClose
  } = useAddAsset(handleClose)

  useEffect(() => {
    if(type === 'Edit' && assetType === PAGE_ASSET_TYPE.TEXT) {
      if(!editorState) setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(selectedAsset?.assetValue))))
    }
  }, [type, assetType, selectedAsset?.assetValue])

  return (
    <Modal
      show={showModal}
      onHide={onPopupClose}
      backdrop='static'
      keyboard={false}
      size={`${assetType === PAGE_ASSET_TYPE.TEXT ? 'xl' : 'md'}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>{type} {`${assetType === PAGE_ASSET_TYPE.DIGITAL ? 'Digital' : assetType === PAGE_ASSET_TYPE.TEXT ? 'Text' : 'Message'} Asset`}</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={assetType !== PAGE_ASSET_TYPE.DIGITAL ?
          {
          assetKey: type == 'Edit' ? selectedAsset?.assetKey ? selectedAsset?.assetKey : '' : '',
          assetValue: type == 'Edit' ? selectedAsset?.assetValue ? selectedAsset?.assetValue : '' : '',
          }
          :
          {
          assetKey: type == 'Edit' ? selectedAsset?.assetKey ? selectedAsset?.assetKey : '' : '',
          assetValue: null
          }
        }
        validationSchema={createAssetSchema(t, assetType)}
        onSubmit={(values) => {
          type === 'Edit'
            ? updateAsset({pageId: pageId, ...values})
            : createAsset({pageId: pageId, assetType: assetType, ...values})
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
          <Form>
            <Modal.Body>
              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                  {t('asset.inputField.assetKey.label')}<span className='text-danger'> *</span>
                  </BForm.Label>

                  <BForm.Control
                    type='text'
                    name='assetKey'
                    placeholder={t('asset.inputField.assetKey.placeholder')}
                    value={values.assetKey}
                    disabled={type === 'Edit'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component='div'
                    name='assetKey'
                    className='text-danger'
                  />
                </Col>
              </Row>

              {assetType === PAGE_ASSET_TYPE.TEXT &&
                  <Row className='mt-3'>
                    <Col>
                      <BForm.Label>
                      {t('asset.inputField.assetValue.label')}<span className='text-danger'> *</span>
                      </BForm.Label>

                      <Editor
                        editorState={editorState}
                        wrapperClassName="create-editor-wrapper"
                        editorClassName="editor-main-sec"
                        toolbarClassName="editor-toolbar-sec"
                        handlePastedText={() => false}
                        onEditorStateChange={(value) => {
                          setFieldValue('assetValue', editorState ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : '')
                          setEditorState(value)
                        }}
                        toolbar={{
                          options: ['inline', 'blockType', 'list', 'link', 'textAlign', 'history', 'colorPicker'],
                          colorPicker: {
                            popupClassName:'editor-colorpicker',
                            colors: ['#ffdc12', '#ffffff', '#000000'],
                          }
                        }}
                      />

                      <ErrorMessage
                        component='div'
                        name='assetValue'
                        className='text-danger'
                      />
                    </Col>
                    {/* <textarea // Uncomment for HTML view
                      disabled 
                      value={editorState ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : ''}
                    /> */}
                  </Row>
                }

                {assetType === PAGE_ASSET_TYPE.MESSAGE &&
                  <Row className='mt-3'>
                    <Col>
                      <BForm.Label>
                      {t('asset.inputField.assetValue.label')}<span className='text-danger'> *</span>
                      </BForm.Label>

                      <BForm.Control
                        type='text'
                        name='assetValue'
                        placeholder={t('asset.inputField.assetValue.placeholder')}
                        value={values.assetValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <ErrorMessage
                        component='div'
                        name='assetValue'
                        className='text-danger'
                      />
                    </Col>
                  </Row>
                }

                {assetType === PAGE_ASSET_TYPE.DIGITAL &&
                  <Row className='mt-3'>
                    <Col>
                      <BForm.Label>
                      {t('asset.inputField.assetImageValue.label')}<span className='text-danger'> *</span>
                      </BForm.Label>

                      <BForm.Text>
                        <Trigger message={t('asset.inputField.assetImageValue.message')} id={'mes'} />
                          <input
                            id={'mes'}
                            title=' '
                            name='assetValue'
                            type='file'
                            onChange={(event) => {
                              setFieldValue(
                                'assetValue',
                                event.currentTarget.files[0]
                              )
                            }}
                          />
                        {values?.assetValue && (
                          <img
                            alt='not found'
                            width='60px'
                            src={URL.createObjectURL(values.assetValue)}
                          />
                        )}
                        {!values?.assetValue && selectedAsset?.assetValue && (
                          <img
                            alt='not found'
                            width='60px'
                            src={selectedAsset.assetValue}
                          />
                        )}
                      </BForm.Text>

                      <ErrorMessage
                        component='div'
                        name='assetValue'
                        className='text-danger'
                      />
                    </Col>
                  </Row>
                }
            </Modal.Body>

            <div className='mt-4'>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button variant='warning' onClick={() => onPopupClose()}>
                {t('cancelButton')}
                </Button>

                <Button
                  variant='success'
                  onClick={handleSubmit}
                  className='ml-2'
                >
                  {t('submitButton')}
                  {loading && (
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  )}
                </Button>
              </Modal.Footer>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddNewAsset

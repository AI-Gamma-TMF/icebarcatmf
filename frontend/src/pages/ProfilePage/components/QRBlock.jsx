import React ,{useState}from 'react'
import { ErrorMessage, Form, Formik } from 'formik'
import { Col, InputGroup, Row, Form as BForm, Button, Spinner } from '@themesberg/react-bootstrap'
import { QRBlockContainer } from '../style'
import ModalView from '../../../components/Modal'
import { qrSubmitSchema } from '../schema'
import { allowOnlyNumber } from '../constants'
import { useVerify2FAMutation } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast'
const QRBlock = (props) => {
  const { qrcodeUrlInfo, toggleForQRModal, allowLogin, from2FAQr, setUserDetails, adminDetails} = props
const [dataLoading,setdataloading] = useState(false)
  const onSuccess = () => {
    toggleForQRModal()
    !allowLogin && toast("Successfully enable 2FA varification", 'success')
    setUserDetails && setUserDetails({...adminDetails,authEnable: true })
    allowLogin && allowLogin()
    setdataloading(false)
  }

  const onError = (error) => {
    if (error.response?.data?.errors?.[0]?.errorCode == 3107) {
      toast(error.response?.data?.errors?.[0]?.description, 'error')
    } else {
      toast("Something went wrong", 'error')
    }
  }

  const mutation = useVerify2FAMutation({ onSuccess, onError })

  const updateData = (formValues) => {
    setdataloading(true)
    mutation.mutate(formValues)
  }

  return (
    <ModalView
      openModal={qrcodeUrlInfo.isOpenModal}
      toggleModal={toggleForQRModal}
      size={from2FAQr ? 'lg' : null}
      hideHeader
      center
      className=''
      hideFooter
    >
      <QRBlockContainer>
        <Row>
          {from2FAQr && <Col sm={6}>
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent(qrcodeUrlInfo?.qrString)}`} />
            <p className='text-sm text-center' >Note: To scan QR code please use google authenticator</p>
          </Col>}
          <Col sm={from2FAQr ? 6 : 12} className='qr-code-form'>
            <div className='space-y-4'>
              <div>
                <h4 className={'styles.heading4'}>Verify Code</h4>
                <p className="text-sm">
                  {from2FAQr ? "For changing the setting " : 'Befor SignIn '}, please verify the authentication code:
                </p>
              </div>
            </div>
            <Formik
              enableReinitialize
              initialValues={{
                token: ''
              }}
              validationSchema={qrSubmitSchema}
              onSubmit={(
                formValues
              ) => {
                updateData(formValues)
              }}
            >
              {({ values, handleSubmit, handleBlur, setFieldValue }) => {
                return (
                  <Form>
                    <div>
                      <InputGroup>
                        <BForm.Control
                          type='text'
                          name='token'
                          placeholder='Add Code Here'
                          value={values.token}
                          onChange={(event) => {
                            setFieldValue('token', allowOnlyNumber(event.target.value))
                          }}
                          onBlur={handleBlur}
                          className='twofa-field'
                          maxlength='6'
                        />

                      </InputGroup>

                      <ErrorMessage
                        component='div'
                        name='token'
                        className='text-danger'
                      />
                    </div>
                    <div className='mt-4 mb-3'>
                      <Button
                        variant='success'
                        onClick={handleSubmit}
                        type='button'
                        className='ml-2'
                        disabled={dataLoading}
                      >
                        Submit
                        {dataLoading && (
                          <Spinner
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        )}
                      </Button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </Col>
        </Row>
      </QRBlockContainer>
    </ModalView>
  )
}

export default QRBlock

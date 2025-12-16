import React from 'react'
import Select from 'react-select'
import { Button, Form as BForm } from '@themesberg/react-bootstrap'
import { Form, ErrorMessage, Formik } from 'formik'
import { addDeductCoinFormSchema, addDeductScCoinFormSchema } from './schema'
import { SimpleEditFormContainer } from '../../style'
import { allowOnlyNumber, coinConst, deductConst } from './constant'

const AddDeductCoin = (props) => {
  const { closeModal, isLoading, selectedInnerButton, handleOpenModal } = props 

    const headDisplay = () => {
      const { innerItem } = selectedInnerButton;
      if (innerItem === 'addDeductCoinsChild' || innerItem === 'addDeduct1ScCoinChild' || innerItem === 'addDeduct2ScCoinsChild') {
        return (
          <div className='simple-text-head'>
            <h6>Add/Deduct coin</h6>
          </div>
        )
      }
      return null;
    }

  const schema = selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' || selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild' ? addDeductScCoinFormSchema():addDeductCoinFormSchema()

  return (
    <SimpleEditFormContainer>
      <Formik
        initialValues={{
          reason: '',
          coinType: selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' ||  selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild' ? { value: 'sc', label: 'Sweep Coins' } : coinConst[0],
          operationType: selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' ||  selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild' ? { value: '1', label: 'Add' } : null,
          gcAmount: '',
          scAmount: selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' ? '1' : selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild' ? '2' : ''
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          handleOpenModal(values);
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form>
            {headDisplay()}
            <div className='form-group my-3'>
              <label
                htmlFor='coinType'
                className={touched.coinType && errors.coinType ? 'text-danger' : ''}
              >
                Coin Type
              </label>
              <Select
                placeholder='Coin Type'
                className='custom-select'
                name='coinType'
                options={coinConst}
                // isLoading={isGetStateLoading}
                value={values.coinType}
                // isDisabled={isEdit}
                onChange={(selectedOption) => {
                  const event = { target: { name: 'coinType', value: selectedOption } }
                  handleChange(event)
                }}
                onBlur={handleBlur}
                isDisabled={selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' || selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild'}

              />
              <ErrorMessage
                component='div'
                name='coinType'
                className='text-danger'
              />
            </div>
            <div className='form-group my-3'>
              <label
                htmlFor='operationType'
                className={touched.operationType && errors.operationType ? 'text-danger' : ''}
              >
                Operation Type
              </label>
              <Select
                name='operationType'
                placeholder='Operation Type'
                className='custom-select'
                options={deductConst}
                value={values.operationType}
                // isLoading={isGetStateLoading}
                // value={{ value: '1', label: 'USA' }}
                // isDisabled={isEdit}
                onChange={(selectedOption) => {
                  const event = { target: { name: 'operationType', value: selectedOption } }
                  handleChange(event)
                }}
                onBlur={handleBlur}
                isDisabled={selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' || selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild'}

              />
              <ErrorMessage
                component='div'
                name='operationType'
                className='text-danger'
              />
            </div>
            <div className='form-group my-3'>
              {selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' || selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild' ?
                <>
                 <label
                htmlFor='reason'
                className={touched.scAmount && errors.scAmount ? 'text-danger' : ''}
              >
                {
                  (values?.coinType?.value === 'both' ||
                  values?.coinType?.value === 'gc')
                    ? 'Gold Coins'
                    : values?.coinType?.value === 'sc' ? ' Sweeps Coins' : 'Sweeps Coins'
                }
              </label>

                <BForm.Control
                type='number'
                name='scAmount'
                placeholder='Amount'
                value={values.scAmount}
                onChange={(event) => {
                  setFieldValue('scAmount', event.target.value)
                }}
                // onChange={handleChange}
                onBlur={handleBlur}
                disabled={selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' || selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild'}

              />
              <ErrorMessage
                component='div'
                name='scAmount'
                className='text-danger'
              />
              </>:
              <>
               <label
                htmlFor='reason'
                className={touched.gcAmount && errors.gcAmount ? 'text-danger' : ''}
              >
                {
                  (values?.coinType?.value === 'both' ||
                  values?.coinType?.value === 'gc')
                    ? 'Gold Coins'
                    : values?.coinType?.value === 'sc' ? ' Sweeps Coins' : 'Sweeps Coins'
                }
              </label>
              <BForm.Control
                type='number'
                name='gcAmount'
                placeholder='Amount'
                value={values.gcAmount}
                onChange={(event) => {
                  setFieldValue('gcAmount', event.target.value)
                }}
                // onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                component='div'
                name='gcAmount'
                className='text-danger'
              />
              </>
              }
            </div>
            {
              values?.coinType?.value === 'both' &&
                <div className='form-group my-3'>
                  <label
                    htmlFor='scAmount'
                    className={touched.scAmount && errors.scAmount ? 'text-danger' : ''}
                  >
                    Sweep Coins
                  </label>
                  <BForm.Control
                    type='text'
                    name='scAmount'
                    placeholder='Amount'
                    value={values.scAmount}
                    onChange={(event) => {
                      setFieldValue('scAmount', allowOnlyNumber(event.target.value))
                    }}
                    onBlur={handleBlur}
                    isDisabled={selectedInnerButton.innerItem === 'addDeduct1ScCoinChild' || selectedInnerButton.innerItem === 'addDeduct2ScCoinsChild'}

                  />
                  <ErrorMessage
                    component='div'
                    name='scAmount'
                    className='text-danger'
                  />
                </div>
              }
            <div className='form-group my-3'>
              <label
                htmlFor='reason'
                className={touched.reason && errors.reason ? 'text-danger' : ''}
              >
                Reason
              </label>
              <BForm.Control
                as='textarea'
                name='reason'
                placeholder='Reason'
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                component='div'
                name='reason'
                className='text-danger'
              />
            </div>
            <div className='edit-btn-wrap'>
              <Button
                variant='success'
                onClick={handleSubmit}
                className='me-2'
                disabled={isLoading}
              >
                 {isLoading ? 'Loading' : 'Update'}
              </Button>
              <Button
                variant='warning'
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </SimpleEditFormContainer>
  )
}

export default AddDeductCoin
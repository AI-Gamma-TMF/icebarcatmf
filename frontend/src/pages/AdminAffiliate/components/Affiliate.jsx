import React, { useEffect, useState } from 'react'
import {
  Button,
  Form as BForm,
  Row,
  Col,
  Spinner,
} from '@themesberg/react-bootstrap'
import { Form, ErrorMessage } from 'formik'
import { AdminRoutes } from '../../../routes'
import { useGetStateListQuery } from '../../../reactQuery/hooks/customQueryHook'
import { stateListConst } from '../../PlayerDetails/components/EditPlayer/constant'
import Select from 'react-select'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useNavigate } from 'react-router-dom'

const Affiliate = ({
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  setFieldValue,
  isFormSubmitting,
  isEdit = false,
}) => {

  const [enabled, setEnabled] = useState(false);
  const [selectState, setSelectState] = useState({label:values.state,value:values.state});
  const [selectPhone, setSelectPhone] = useState(values.phone);
  const navigate = useNavigate()

  const {
    data: stateData,
    isLoading: isGetStateLoading,
  } = useGetStateListQuery({ params: {}, enabled })

  useEffect(()=>{
    setEnabled(true)
  },[])

  const handlePhone =(phone, country)=>{
  
    const newStr = phone.substring(country.dialCode?.length);
   
     setSelectPhone(phone)
     setFieldValue('phone', newStr)
     setFieldValue('phoneCode', `+${country.dialCode}`)
  }

  const findOptionByValue = (optionsList,selectedValue ) => {
    if(optionsList.length>0){
    return optionsList.find(option => option?.name === selectedValue?.value);
    }
    return []
  };
  
  return (
    <>
      <Form>
        <Row>
          <Col md={6} sm={12}>
            <BForm.Label>First Name</BForm.Label>
            <BForm.Control
              type='text'
              name='firstName'
              placeholder="First Name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isEdit}
            />

            <ErrorMessage
              component='div'
              name='firstName'
              className='text-danger'
            />
          </Col>

          <Col md={6} sm={12}>
            <BForm.Label>Last Name</BForm.Label>

            <BForm.Control
              type='text'
              name='lastName'
              placeholder="Last Name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isEdit}
            />

            <ErrorMessage
              component='div'
              name='lastName'
              className='text-danger'
            />
          </Col>
          
        </Row>

        <Row className='mt-3'>
          <Col md={6} sm={12}>
            <BForm.Label>Email</BForm.Label>
            <BForm.Control
              type='text'
              name='email'
              placeholder="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isEdit}
            />
            <ErrorMessage
              component='div'
              name='email'
              className='text-danger'
            />
          </Col>

          <Col md={6} sm={12}>
            <BForm.Label>Phone Number</BForm.Label>
            <PhoneInput
              inputStyle={{width:"100%"}}
              country={'us'}
              value={selectPhone}
              onChange={handlePhone}
              countryCodeEditable={false}
              onlyCountries={['us']}
              disabled={isEdit}
            />           
            <ErrorMessage
              component='div'
              name='phone'
              className='text-danger'
            />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col md={6} sm={12}>
            <BForm.Label>State</BForm.Label>
              <Select
              placeholder='State'
              isDisabled={isEdit}
              className={'react-select custom-select'}
              classNamePrefix={'react-select'}
              options={stateListConst(stateData)}
              onChange={(SelectedValue) => {
                setSelectState(SelectedValue)
                setFieldValue('state', SelectedValue.label)
              }}
              isLoading={isGetStateLoading}
              value={findOptionByValue(stateListConst(stateData),selectState)}
            />
            <ErrorMessage
              component='div'
              name='state'
              className='text-danger'
            />
          </Col>

          <Col md={6} sm={12}>
            <BForm.Label>Preferred contact method</BForm.Label>

            <BForm.Control
              type='text'
              disabled={isEdit}
              name='preferredContact'
              placeholder="Contact"
              value={values.preferredContact}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage
              component='div'
              name='preferredContact'
              className='text-danger'
            />
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6} sm={12}>
            <BForm.Label>Traffic source (provide Description and Link)</BForm.Label>
            <BForm.Control
              as="textarea"
              rows="6"
              name='trafficSource'
              disabled={isEdit}
              placeholder="Paste your link and describe your source"
              value={values.trafficSource}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage
              component='div'
              name='trafficSource'
              className='text-danger'
            />
          </Col>

          <Col md={6} sm={12}>
            <BForm.Label>How do you plan to attract people?</BForm.Label>

            <BForm.Control
              as="textarea"
              name='plan'
              rows="6"
              disabled={isEdit}
              placeholder="Tell use about your plan "
              value={values.plan}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage
              component='div'
              name='plan'
              className='text-danger'
            />
          </Col>
        </Row>

        <div className='mt-4 d-flex justify-content-between align-items-center'>
          <Button
            variant='warning'
            onClick={() => navigate(AdminRoutes.Affiliate)}
          >
            Cancel
          </Button>

          <Button
            variant='success'
            onClick={() => {
              handleSubmit()
            }}
            className='ml-2'
            disabled={isEdit}
          >
            Submit
            {isFormSubmitting && (
              <Spinner
                as='span'
                animation='border'
                role='status'
                aria-hidden='true'
              />
            )}
          </Button>

        </div>
      </Form>
    </>
  )
}

export default Affiliate

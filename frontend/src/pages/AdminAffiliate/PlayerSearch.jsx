import React from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import { Row, Col, Form as BForm, Button } from '@themesberg/react-bootstrap'
import { PlayerSearchContainer } from './style'
import { playerSearchSchmes } from './schemas'
import { initialSet } from './constants'
const PlayerSearch = (props) => {
  const {
    setGlobalSearch
  } = props
  const resetToggler = (resetForm) => {
    resetForm()
    setGlobalSearch(initialSet)
  }

  const handlePhoneNumber =(event,setFieldValue)=>{
    const phoneNumber = event.target.value.replace(/\D/g, '');
    setFieldValue("phoneSearch",phoneNumber);
  }
  
  return (
    <PlayerSearchContainer>
      <Formik
        initialValues={{
          idSearch: '',
          emailSearch: '',
          firstNameSearch : '',
          lastNameSearch : '',
          userNameSearch : '',
          phoneSearch : '',
          affiliateIdSearch : '',
          regIpSearch : '',
          lastIpSearch : ''
        }}
        validationSchema={playerSearchSchmes()}
        onSubmit={(formValues, { _resetForm }) => {
          const tempValue = { ...formValues }
          setGlobalSearch(tempValue)
        }}
      >
        {({
          // touched,
          // errors,
          // handleSubmit,
          values,
          handleChange,
          handleBlur,
          resetForm,
          setFieldValue
        }) => (
          <Form>
            <Row>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupEmail'>
                  <BForm.Label>Email</BForm.Label>
                  <BForm.Control
                    type='text'
                    placeholder='Email'
                    name='emailSearch'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.emailSearch}
                  />
                  <ErrorMessage
                    component='div'
                    name='emailSearch'
                    className='text-danger'
                  />
                </BForm.Group>
              </Col>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupEmail'>
                  <BForm.Label>First Name</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='firstNameSearch'
                    placeholder='First Name'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstNameSearch}
                  />
                </BForm.Group>
              </Col>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupEmail'>
                  <BForm.Label>Last Name</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='lastNameSearch'
                    placeholder='Last Name'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastNameSearch}
                  />
                </BForm.Group>
              </Col>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupEmail'>
                  <BForm.Label>Phone Number</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='phoneSearch'
                    placeholder='Phone Number'
                    onChange={(event)=>handlePhoneNumber(event,setFieldValue)}
                    onBlur={handleBlur}
                    value={values.phoneSearch}
                  />
                  <ErrorMessage
                    component='div'
                    name='phoneSearch'
                    className='text-danger'
                  />
                </BForm.Group>
              </Col>
             
            </Row>
            <Row>
             
             
            </Row>
            <Row>
              <Col>
                <div className='buttonDiv'>
                  <Button variant='primary' type='submit'>Search</Button>
                  <Button variant='secondary' onClick={() => resetToggler(resetForm)} type='button'>Reset</Button>
                </div>
              </Col>
            </Row>
          </Form>)}
      </Formik>
    </PlayerSearchContainer>
  )
}

export default PlayerSearch;
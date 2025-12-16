
import React from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import { Row, Col, Form as BForm, Button } from '@themesberg/react-bootstrap'
import { PlayerSearchContainer } from './style'
import { playerSearchSchmes } from './schema'
import { initialSet } from './constants'
// import { onDownloadCsvClick } from '../../utils/helper'

const PlayerSearch = (props) => {
  const {
   
    setGlobalSearch,
    // getCsvDownloadUrl,
    // playersData
  } = props


  const resetToggler = (resetForm) => {
    resetForm()
    setGlobalSearch(initialSet)
  }
  // const [downloadInProgress, setDownloadInProgress] = useState(false);

  // const handleDownloadClick = async (values) => {
  //   try {
  //     const { idSearch, emailSearch, firstNameSearch, lastNameSearch, userNameSearch, phoneSearch, tierSearch } = values;
  //     const baseFilename = 'Player_Details';
  //     const parts = [idSearch, emailSearch, firstNameSearch, lastNameSearch, userNameSearch, phoneSearch, tierSearch]
  //       .filter(value => value !== '');
      
  //     const filename = parts.length > 0 
  //       ? `${baseFilename}_${parts.join('_')}`
  //       : baseFilename;
        
  //     // setDownloadInProgress(true);
  //     const url = getCsvDownloadUrl();
  //     await onDownloadCsvClick(url, filename)
  //   } catch (error) {
  //     console.error('Error downloading CSV:', error);
  //   } finally {
  //     // setDownloadInProgress(false);
  //   }
  // };

  return (
    <PlayerSearchContainer>
      <Formik
        initialValues={{
          idSearch: '',
          emailSearch: '',
          firstNameSearch: '',
          lastNameSearch: '',
          userNameSearch: '',
          affiliateIdSearch: '',
          phoneSearch: '',
          tierSearch: ''
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
          values,
          handleChange,
          // handleSubmit, 
          handleBlur,
          resetForm,
          // setFieldValue
        }) => (
          <Form>
            <Row>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='idSearch'>
                  <BForm.Label>Player Id</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='idSearch'
                    placeholder='Player ID'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.idSearch}
                  />
                  <ErrorMessage
                    component='div'
                    name='idSearch'
                    className='text-danger'
                  />
                </BForm.Group>
              </Col>
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
                  <BForm.Label>User Name</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='userNameSearch'
                    placeholder='UserName'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.userNameSearch}
                  />
                </BForm.Group>
              </Col>
              
            </Row>
            <Row>
              <Col>
                <div className='buttonDiv'>
                  <Button variant='primary' style={{
                    height: "40px",
                    width: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}type='submit'>Search</Button>
                
                    <Button variant='secondary'style={{
                    height: "40px",
                    width: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }} onClick={() => resetToggler(resetForm)} type='button'>Reset</Button>

                  

                </div>
              </Col>
            </Row>
          </Form>)}
      </Formik>
    </PlayerSearchContainer>
  )
}

export default PlayerSearch;
import React, { useState, useRef } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import { Row, Col, Form as BForm, Button } from '@themesberg/react-bootstrap'
import { PlayerSearchContainer } from '../Players/style'
import { playerSearchSchmes } from '../Players/schemas'
import { initialSet } from './constants'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import Trigger from '../../components/OverlayTrigger'
import { onDownloadCsvClick } from '../../utils/helper'

const PlayerSearch = (props) => {
  const {
    setGlobalSearch,
    getCsvDownloadUrl,
    setSelectAll,
    setMultiSelectPlayers,
    setPage,
    setImportedFile,
    setImportModalShow,
    playersData,
    promocodeStatus,
    setPromocodeStatus
  } = props

  const resetToggler = (resetForm) => {
    resetForm()
    setGlobalSearch(initialSet)
    setSelectAll(false)
    setMultiSelectPlayers([])
    setPage(1)

  }
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  const fileInputRef = useRef(null);

  const handleDownloadClick = async (values) => {
    try {
      const { unifiedSearch, phoneSearch, tierSearch } = values;
      const baseFilename = 'Promocode_Blocking';
      const parts = [unifiedSearch, phoneSearch, tierSearch]
        .filter(value => value !== '');

      const filename = parts.length > 0
        ? `${baseFilename}_${parts.join('_')}`
        : baseFilename;

      setDownloadInProgress(true);
      const url = getCsvDownloadUrl();
      // await onDownloadCsvDirectClick(url, filename)
      await onDownloadCsvClick(url, filename)
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setDownloadInProgress(false);
    }
  };

  const handleImportChange = (e) => {
    const file = e.target.files[0]
    setImportedFile(e.target.files[0]);
    if (file) {
      setImportModalShow(true)
    }
    // Reset the input value to allow re-selection
    e.target.value = null;
  }

  const handleImportClick = () => {
    fileInputRef.current.click();
  }

  return (
    <PlayerSearchContainer>
      <Formik
        initialValues={{
          unifiedSearch: '',
          // idSearch: '',
          // emailSearch: '',
          // firstNameSearch: '',
          // lastNameSearch: '',
          // userNameSearch: '',
          affiliateIdSearch: '',
          phoneSearch: '',
          tierSearch: '',
          promocodeStatus: ''
        }}
        validationSchema={playerSearchSchmes()}
        onSubmit={(formValues, { _resetForm }) => {
          const tempValue = { ...formValues }
          setGlobalSearch(tempValue)
          setSelectAll(false)
          setMultiSelectPlayers([])
        }}
      >
        {({
          values,
          handleChange,
          // handleSubmit,
          handleBlur,
          resetForm,
          setFieldValue
        }) => (
          <Form>
            <Row>
              <Col className='col-lg-4 col-sm-12 col-12'>
                <BForm.Group className='mb-3' controlId='unifiedSearch'>
                  <BForm.Label>Search by ID, Username, Email, First/Last Name</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='unifiedSearch'
                    placeholder='Enter keyword'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unifiedSearch}
                  />
                  <ErrorMessage
                    component='div'
                    name='unifiedSearch'
                    className='text-danger'
                  />
                </BForm.Group>
              </Col>
              <Col className="col-lg-3 col-sm-6 col-12">
                <BForm.Group className='mb-3' controlId='promocodeStatus'>
                  <BForm.Label>Status</BForm.Label>
                  <BForm.Select
                    as='select'
                    name='promocodeStatus'
                    value={promocodeStatus}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPromocodeStatus(value);
                      setFieldValue('promocodeStatus', value);
                    }}
                    onBlur={handleBlur}
                  >
                    <option value='all'>All</option>
                    <option value='true'>Blocked</option>
                    <option value='false'>Unblocked</option>
                  </BForm.Select>
                  <ErrorMessage
                    component='div'
                    name='promocodeStatus'
                    className='text-danger'
                  />
                </BForm.Group>

              </Col>

              <Col xs={4} style={{ marginTop: "30px" }}>
                <Button variant='primary' type='submit'>Search</Button>
              </Col>

              {/* 
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
              </Col> */}
            </Row>
            {/* <Row>
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
            </Row> */}
            <Col className="flex align-items-center">
              <div className="buttonDiv mt-3 pt-2">
                <div>
                  <Button variant='secondary' onClick={() => resetToggler(resetForm)} type='button'>Reset</Button>
                  <Trigger message='Import .csv with first column title email and email ids as follows.' id={"csvFileInput"} />
                  <Button
                    variant='secondary'
                    style={{ marginLeft: '10px' }}
                    onClick={handleImportClick}
                    type="button"
                    id={"csvFileInput"}
                  >
                    Import CSV
                  </Button>
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleImportChange}
                    style={{ display: "none" }} // Hide the file input
                  />
                  <Trigger message='Download as CSV' id={'csv'} />
                  <Button
                    id={'csv'}
                    variant='success' style={{ marginLeft: '10px' }}
                    onClick={() => handleDownloadClick(values)}
                    disabled={downloadInProgress || playersData?.count == 0}
                  >
                    {downloadInProgress ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <FontAwesomeIcon icon={faFileDownload} />
                    )}
                  </Button>
                </div>

              </div>
            </Col>
          </Form>)}
      </Formik>
    </PlayerSearchContainer>
  )
}

export default PlayerSearch;
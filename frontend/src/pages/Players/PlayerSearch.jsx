import React, { useState } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import { Row, Col, Form as BForm, Button } from '@themesberg/react-bootstrap'
import { PlayerSearchContainer } from './style'
import { playerSearchSchmes } from './schemas'
import { initialSet } from '../../components/MultiFunctionTable/constant'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import Trigger from '../../components/OverlayTrigger'
import { onDownloadCsvClick } from '../../utils/helper'
import useTierListing from '../Tier/hooks/useTierListing'
import { InlineLoader } from '../../components/Preloader'
const PlayerSearch = (props) => {
  const {
    setBtnClick,
    setGlobalSearch,
    getCsvDownloadUrl,
    playersData,
    loading, btnClick,setPage
  } = props

  const { tierList } = useTierListing()
  const tierOptions = tierList?.tiers?.rows

  const resetToggler = (resetForm) => {
    resetForm()
    setBtnClick(true)
    setPage(1)
    setGlobalSearch(initialSet)
  }
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  const handleDownloadClick = async (values) => {
    try {
      const { idSearch, emailSearch, firstNameSearch, lastNameSearch, userNameSearch, phoneSearch, tierSearch } = values;
      const baseFilename = 'Player_Details';
      const parts = [idSearch, emailSearch, firstNameSearch, lastNameSearch, userNameSearch, phoneSearch, tierSearch]
        .filter(value => value !== '');

      const filename = parts.length > 0
        ? `${baseFilename}_${parts.join('_')}`
        : baseFilename;

      setDownloadInProgress(true);
      const url = getCsvDownloadUrl();
      await onDownloadCsvClick(url, filename)
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setDownloadInProgress(false);
    }
  };

  return (
    <PlayerSearchContainer>
      <Formik
        initialValues={{
          // unifiedSearch: '',
          idSearch: '',
          emailSearch: '',
          firstNameSearch: '',
          lastNameSearch: '',
          userNameSearch: '',
          affiliateIdSearch: '',
          phoneSearch: '',
          tierSearch: '',
          statusSearch: 'all',
          filterBy: '',
          operator: '',
          value: ''
        }}
        validationSchema={playerSearchSchmes()}
        onSubmit={(formValues, { _resetForm }) => {
          const tempValue = { ...formValues }
          setBtnClick(true)
          setPage(1)
          setGlobalSearch(tempValue)
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          resetForm,
        }) => (
          <Form>
            <Row>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='idSearch'>
                  <BForm.Label>Player Id</BForm.Label>
                  <BForm.Control
                    type='number'
                    name='idSearch'
                    placeholder='Player ID' 
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
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
            </Row>
            <Row>
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
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupEmail'>
                  <BForm.Label>Mobile Number</BForm.Label>
                  <BForm.Control
                    type='number'
                    name='phoneSearch'
                    placeholder='Mobile number'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onWheel={(e) => e.target.blur()}
                    value={values.phoneSearch}
                    onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                  />
                </BForm.Group>
                <ErrorMessage
                  component='div'
                  name='phoneSearch'
                  className='text-danger'
                />
              </Col>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupTier'>
                  <BForm.Label>Tier</BForm.Label>
                  <BForm.Select
                    as='select'
                    name='tierSearch'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tierSearch}
                  >
                    <option disabled id={'none'} value=''>-- Select Tier --</option>
                    {tierOptions?.map((tier) => {
                      return (
                        <option key={tier?.tierId} id={tier?.tierId} value={tier?.level}>{tier?.name}</option>
                      )
                    })}
                  </BForm.Select>

                </BForm.Group>
              </Col>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupStatusSearch'>
                  <BForm.Label>Status Search</BForm.Label>
                  <BForm.Select
                    as='select'
                    name='statusSearch'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.statusSearch}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inActive">Inactive</option>
                    <option value="isBan">Banned</option>
                    <option value="isRestrict">Restricted</option>
                    <option value="isInternalUser">Internal User</option>
                  </BForm.Select>                 
                </BForm.Group>
              </Col>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupFilterBy'>
                  <BForm.Label>Filter By</BForm.Label>
                  <BForm.Select
                    as='select'
                    name='filterBy'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.filterBy}
                  >
                    <option disabled id={'none'} value=''>-- Select Filter By --</option>
                    <option value='totalPurchaseAmount'>Total Purchase Amount</option>
                    <option value='totalRedemptionAmount'>Total Redemption Amount</option>
                    <option value='playThrough'>Play Through</option>
                  </BForm.Select>

                </BForm.Group>
              </Col>

              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupOperator'>
                  <BForm.Label>Operator</BForm.Label>
                  <BForm.Select
                    as='select'
                    name='operator'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.operator}
                    disabled={!values.filterBy}
                  >
                    <option disabled id={'none'} value=''>-- Select Operator --</option>
                    <option value='='>=</option>
                    <option value='>'>{`>`}</option>
                    <option value='>='>{`>=`}</option>{' '}
                    <option value='<'>{`<`}</option>{' '}
                    <option value='<='>{`<=`}</option>
                  </BForm.Select>

                </BForm.Group>
              </Col>
              <Col className='col-lg-3 col-sm-6 col-12'>
                <BForm.Group className='mb-3' controlId='formGroupFilterValue'>
                  <BForm.Label>Filter Value</BForm.Label>
                  <BForm.Control
                    type='number'
                    name='value'
                    placeholder='Filter Value'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.value}
                    disabled={!values.operator}
                     onKeyDown={(evt) =>['e', 'E', '+'].includes(evt.key) && evt.preventDefault()}
                  />
                </BForm.Group>
              </Col>

              
            </Row>
            <Row>
              <Col>
                <div className='buttonDiv'>
                  <Button variant='primary' type='submit' >
                    {loading && btnClick ? <InlineLoader /> : 'Search'}</Button>

                  <div>
                    <Button variant='secondary' onClick={() => resetToggler(resetForm)} type='button'>Reset</Button>

                    <Trigger message='Download as CSV' id={'csv'} />
                    <Button
                      id={'csv'}
                      variant='success' style={{ marginLeft: '10px' }}
                      onClick={() => handleDownloadClick(values)}
                      disabled={downloadInProgress || playersData ===undefined || playersData?.count === 0}
                    >
                      {downloadInProgress ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <FontAwesomeIcon icon={faFileDownload} />
                      )}
                    </Button>
                  </div>

                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Note: Press search to load the data.</div>
              </Col>
            </Row>
          </Form>)}
      </Formik>
    </PlayerSearchContainer>
  )
}

export default PlayerSearch;
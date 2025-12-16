import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Button,
  Form as BForm,
  Row,
  Col
} from '@themesberg/react-bootstrap';
import { useGetStateListQuery } from '../../../reactQuery/hooks/customQueryHook';
import { stateListConst } from '../../PlayerDetails/components/EditPlayer/constant';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import { useNavigate } from 'react-router-dom';
import { updateAffiliateProfileSchema } from "../schema";
import useEditProfile from "../Hooks/useEditProfile";
import { useUserStore } from "../../../store/store";
const EditProfile = () => {
  const {
    handleOnSubmitPassword,
    formikRef
  } = useEditProfile();

  const {userDetails} = useUserStore((state) => state)

const isEdit =true;
const [enabled, setEnabled] = useState(false);
const [selectState, setSelectState] = useState({value:userDetails.state,label:userDetails.state});
const [selectPhone, setSelectPhone] = useState("1"+userDetails.phone);
// const [selectPhoneCode, setSelectPhoneCode] = useState('1');
// const navigate = useNavigate()
const [copied, setCopied] = useState(false);

const {
  data: stateData,
  isLoading: isGetStateLoading,
} = useGetStateListQuery({ params: {}, enabled })

useEffect(()=>{
  setEnabled(true)
},[])

const handlePhone =(phone, _country)=>{
   setSelectPhone(phone);
  //  setSelectPhoneCode(`+${country.dialCode}`)
}

const handleCopy = () => {
  // Copy text to clipboard
  navigator.clipboard.writeText(userDetails.affiliateUrl)
    .then(() => {
      // Set copied state to true to show a message or update UI if needed
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    })
    .catch((error) => {
      console.error('Error copying to clipboard:', error);
      // Handle error if needed
    });
};

  return (
    <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={{
          firstName: userDetails.firstName||'', // Initial value for first name
          lastName: userDetails.lastName||'', // Initial value for last name
          email: userDetails.email||'', // Initial value for email
          phone: userDetails.phone,
          phoneCode: userDetails.phoneCode || '1', // Initial value for phone
          state: userDetails.state, // Initial value for state
          preferredContact: userDetails.preferredContact, // Initial value for traffic source description
          trafficSource: userDetails.trafficSource, // Initial value for attracting people details
          plan: userDetails.plan,
          isTermsAccepted: true,
        }}
        validationSchema={updateAffiliateProfileSchema}
        onSubmit={(formValues) => handleOnSubmitPassword(formValues)
            // handleCreateAffiliate(formValues)
        }
      >
        {({
          values,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
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
                  country={'us'}
                  inputStyle={{width:"100%"}}
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
                    setFieldValue('state', SelectedValue.value)
                  }}
                  isLoading={isGetStateLoading}
                  value={selectState}
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

            <Row className='mt-3' style={{display:"flex",alignItems:"center"}}>
              <Col md={5} sm={12}>
                <BForm.Label>Referral Url</BForm.Label>
                <BForm.Control
                  as="textarea"
                  name='plan'
                  disabled
                  placeholder=""
                  value={userDetails.affiliateUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
              <Col md={1} sm={12}>
                 <Button style={{ marginTop: "15px" }} onClick={handleCopy}>
                   {copied ? 'Copied!' : 'Copy'}
                  </Button>
             </Col>
            </Row>

          </Form>
        )}
      </Formik>
  );
};

export default EditProfile;

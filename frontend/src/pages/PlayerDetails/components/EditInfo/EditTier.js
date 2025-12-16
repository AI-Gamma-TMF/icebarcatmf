import React from 'react';
import Select from 'react-select';
import { Button, Spinner } from '@themesberg/react-bootstrap';
import { Form, ErrorMessage, Formik } from 'formik';

import { SimpleEditFormContainer } from '../../style';
import useTierListing from '../../../Tier/hooks/useTierListing';
import usePlayerDetails from '../../usePlayerDetails';

const EditTier = (props) => {
  const { closeModal, onSubmit, isLoading, selectedInnerButton } = props;
  const { tierList } = useTierListing();
  const tierData = tierList?.rows;
const {userData}=usePlayerDetails()
const availableTiers = tierData?.filter(tier => parseInt(tier.level) > userData?.tierDetails?.currentTier?.level)


  const tierOptions = availableTiers?.map((tier) => ({
    value: tier.tierId,
    label: `${tier.name}`,
  }));

  
  const headDisplay = () => {
    switch (selectedInnerButton?.innerItem) {
      case 'updateTier':
        return (
          <div className="simple-text-head">
            <h6>Update Tier</h6>
          </div>
        );
      default:
        return null;
    }
  };
 
 
  
  return (
    <SimpleEditFormContainer>
      <Formik
        initialValues={{
          tierLevel: '', // Correct initial value
        }}
       
        onSubmit={(formValues, { _resetForm }) => {
         
          onSubmit(formValues);
        }}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form>
            {headDisplay()}
            <div className="form-group my-3">
              <label
                htmlFor="tierLevel"
                className={
                  touched.tierLevel && errors.tierLevel ? 'text-danger' : ''
                }
              >
                Select Tier Level
              </label>
              <Select
                placeholder="Update Tier"
                className="custom-select"
                name="tierLevel"
                options={tierOptions}
                value={tierOptions?.find(
                  (option) => option.value === values.tierLevel
                )}
                onChange={(selectedOption) => {
                  setFieldValue('tierLevel', selectedOption.value);
                }}
                onBlur={handleBlur}
              />
              <ErrorMessage
                component="div"
                name="tierLevel"
                className="text-danger"
              />
            </div>
            <div className="edit-btn-wrap">
              <Button
                variant="success"
                onClick={handleSubmit}
                className="me-2"
                disabled={isLoading}
              >
                Update
                {isLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
              <Button variant="warning" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </SimpleEditFormContainer>
  );
};

export default EditTier;
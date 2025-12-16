import React from 'react';
import { Col, Form as BForm, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap';
import { ErrorMessage } from 'formik';

const PackageActiveToggle = ({ values, handleChange, handleBlur, t, isEdit }) => {
    return (
        <>
            <Col xs={12} className="mb-3">
                <OverlayTrigger
                    placement='top'
                    overlay={
                        <Tooltip id='tooltip-active'>
                            {values.isActive ? 'The package is currently active.' : 'The package is currently inactive.'}
                        </Tooltip>
                    }
                >
                    <div
                        className='d-flex align-items-center  rounded p-2 justify-content-between'
                        style={{ border: '0.0625rem solid #d1d7e0' }}
                    >
                        <p className='mb-0'>
                            {t('createPackage.inputFields.active')}
                        </p>
                        <BForm.Check
                            name='isActive'
                            className='ml-2'
                            checked={values.isActive}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isEdit || values.isScheduledPackage}
                        />
                    </div>
                </OverlayTrigger>
                <ErrorMessage component='div' name='isActive' className='text-danger' />
            </Col>
        </>
    );
};

export default PackageActiveToggle;

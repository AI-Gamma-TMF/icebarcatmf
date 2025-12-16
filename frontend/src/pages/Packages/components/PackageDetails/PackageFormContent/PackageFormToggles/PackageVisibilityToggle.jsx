import React from 'react';
import { Col, Form as BForm, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap';
import { ErrorMessage } from 'formik';

const PackageVisibilityToggle = ({ values, handleChange, handleBlur, t }) => {
    return (
        <>
            <Col xs={12} className="mb-3">
                <OverlayTrigger
                    placement='top'
                    overlay={
                        <Tooltip id='tooltip-visible-store'>
                            {values.isVisibleInStore
                                ? 'The package is visible in the store.'
                                : 'Select package to make it visible in the store.'}
                        </Tooltip>
                    }
                >
                    <div
                        className='d-flex align-items-center    rounded p-2 justify-content-between '
                        style={{ border: '0.0625rem solid #d1d7e0' }}
                    >
                        <p className='mb-0'>
                            {t('createPackage.inputFields.visibleInStore')}
                        </p>

                        <BForm.Check
                            name='isVisibleInStore'
                            checked={values.isVisibleInStore}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </OverlayTrigger>
                <ErrorMessage component='div' name='isVisibleInStore' className='text-danger' />
            </Col>
        </>
    );
};

export default PackageVisibilityToggle;

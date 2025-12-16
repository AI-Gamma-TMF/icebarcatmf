import React from 'react';
import { Col, Form as BForm, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap';
import { ErrorMessage } from 'formik';
import PackageVisibilityToggle from './PackageVisibilityToggle';

const PackageSpecialScheduledToggle = ({ values, handleChange, handleBlur, t, setFieldValue, packageData }) => {
    return (
        <>
            {values?.welcomePurchaseBonusApplicable !== true && (
                <PackageVisibilityToggle
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    t={t}
                />
            )}

            <Col xs={12} className="mb-3">
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip id='tooltip-special-package'>Subscribe</Tooltip>}
                >
                    <div
                        className='d-flex align-items-center  rounded p-2 justify-content-between'
                        style={{ border: '0.0625rem solid #d1d7e0' }}
                    >
                        <p className='mb-0'>
                            {t('createPackage.inputFields.subscriberOnly')}
                        </p>

                        <BForm.Check
                            name='isSubscriberOnly'
                            checked={values.isSubscriberOnly}
                            onChange={(e) => {
                                handleChange(e);
                                const isChecked = e.target.checked;

                                if (isChecked) {
                                    setFieldValue('isSubscriberOnly', true);
                                }
                            }}
                            onBlur={handleBlur}
                            disabled={values.welcomePurchaseBonusApplicable}
                        />
                    </div>
                </OverlayTrigger>
                <ErrorMessage component='div' name='isSubscriberOnly' className='text-danger' />
            </Col>

            <Col xs={12} className="mb-3">
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip id='tooltip-special-package'>This is a special package.</Tooltip>}
                >
                    <div
                        className='d-flex align-items-center  rounded p-2 justify-content-between'
                        style={{ border: '0.0625rem solid #d1d7e0' }}
                    >
                        <p className='mb-0'>
                            {t('createPackage.inputFields.specialPackage')}
                        </p>

                        <BForm.Check
                            name='isSpecialPackage'
                            checked={values.isSpecialPackage}
                            // onChange={handleChange}
                            onChange={(e) => {
                                handleChange(e);
                                const isChecked = e.target.checked;

                                // Automatically enable scheduled package if special is checked
                                if (isChecked) {
                                    setFieldValue('isScheduledPackage', true);
                                    setFieldValue('isActive', false); // Also disable active
                                    // setFieldValue('isValidFrom', true); // ← add this
                                    // setFieldValue('isValidUntil', true); // ← add this
                                }
                            }}
                            onBlur={handleBlur}
                            disabled={values.welcomePurchaseBonusApplicable}
                        />
                    </div>
                </OverlayTrigger>
                <ErrorMessage component='div' name='isSpecialPackage' className='text-danger' />
            </Col>


            <Col xs={12} className="mb-3">
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip id='tooltip-scheduled-package'>
                        {packageData?.isScheduled
                            ? 'This package is already scheduled and cannot be unscheduled.'
                            : 'This is a scheduled package.'}
                    </Tooltip>}
                >
                    <div className='d-flex align-items-center rounded p-2 justify-content-between' style={{ border: '0.0625rem solid #d1d7e0' }}>
                        <p className='mb-0'>
                            Scheduled Package
                        </p>
                        <BForm.Check
                            name='isScheduledPackage'
                            checked={values.isScheduledPackage}
                            onChange={(e) => {
                                handleChange(e);
                                const isChecked = e.target.checked;

                                // Only update isActive if not triggered by special package
                                if (!values.isSpecialPackage && isChecked) {
                                    setFieldValue('isActive', false);
                                    // setFieldValue('isValidFrom', true);
                                    // setFieldValue('isValidUntil', true);
                                }
                            }}
                            onBlur={handleBlur}
                            disabled={values.isSpecialPackage || packageData?.isScheduled}
                        />
                    </div>
                </OverlayTrigger>
                <ErrorMessage component='div' name='isScheduledPackage' className='text-danger' />
            </Col>
        </>
    );
};

export default PackageSpecialScheduledToggle;

import React from 'react';
import { Row, Col, Form as BForm, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap';
import { ErrorMessage } from 'formik';

const PackageAmountSection = ({ values, handleChange, handleBlur, t, isEdit }) => {
    return (
        <>
            <Row className='mt-3'>
                <Col>
                    <BForm.Label>
                        {`${t('createPackage.inputFields.amountField.label')} ( $ )`}
                        <span className='text-danger'> *</span>
                    </BForm.Label>
                    <OverlayTrigger
                        placement='top'
                        overlay={<Tooltip id='tooltip-amount'>Enter the amount for the package.</Tooltip>}
                    >
                        <BForm.Control
                            type='number'
                            name='amount'
                            min='0'
                            onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
                            placeholder={t('createPackage.inputFields.amountField.placeholder')}
                            value={values.amount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isEdit}
                        />
                    </OverlayTrigger>
                    <ErrorMessage component='div' name='amount' className='text-danger' />
                </Col>
                <Col>
                    <BForm.Label>
                        {t('createPackage.inputFields.gcField.label')}
                        <span className='text-danger'> *</span>
                    </BForm.Label>
                    <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip-amount'>gc coin</Tooltip>}>
                        <BForm.Control
                            type='number'
                            name='gcCoin'
                            min='0'
                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                            placeholder={t('createPackage.inputFields.gcField.placeholder')}
                            value={values.gcCoin}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isEdit}
                        />
                    </OverlayTrigger>
                    <ErrorMessage component='div' name='gcCoin' className='text-danger' />
                </Col>
                <Col>
                    <BForm.Label>
                        {t('createPackage.inputFields.scField.label')}
                        <span className='text-danger'> *</span>
                    </BForm.Label>
                    <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip-amount'>sc coin</Tooltip>}>
                        <BForm.Control
                            type='number'
                            name='scCoin'
                            min='0'
                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                            placeholder={t('createPackage.inputFields.scField.placeholder')}
                            value={values.scCoin}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isEdit}
                        />
                    </OverlayTrigger>
                    <ErrorMessage component='div' name='scCoin' className='text-danger' />
                </Col>

                {/* {!values?.firstPurchaseApplicable && ( */}
                <Col>
                    <BForm.Label>{t('createPackage.inputFields.bonusSc.label')}</BForm.Label>
                    <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip-bonus-sc'>sc bonus</Tooltip>}>
                        <BForm.Control
                            type='number'
                            name='bonusSc'
                            min='0'
                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                            placeholder={t('createPackage.inputFields.bonusSc.placeholder')}
                            value={values.bonusSc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isEdit}
                        />
                    </OverlayTrigger>
                    <ErrorMessage component='div' name='bonusSc' className='text-danger' />
                </Col>

                <Col>
                    <BForm.Label>{t('createPackage.inputFields.bonusGc.label')}</BForm.Label>
                    <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip-bonus-sc'>gc bonus</Tooltip>}>
                        <BForm.Control
                            type='number'
                            name='bonusGc'
                            min='0'
                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                            placeholder={t('createPackage.inputFields.bonusGc.placeholder')}
                            value={values.bonusGc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isEdit}
                        />
                    </OverlayTrigger>
                    <ErrorMessage component='div' name='bonusGc' className='text-danger' />
                </Col>
            </Row>
        </>
    );
};

export default PackageAmountSection;

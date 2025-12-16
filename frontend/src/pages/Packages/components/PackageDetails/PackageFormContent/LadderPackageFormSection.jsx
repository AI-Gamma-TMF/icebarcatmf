import React, { useState } from 'react';
import { Row, Col, Form as BForm, OverlayTrigger, Tooltip, Button, Table } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from 'formik';
import { toast } from '../../../../../components/Toast';
import Trigger from '../../../../../components/OverlayTrigger';

const LadderPackageFormSection = ({ values, t, handleChange, handleBlur, isEdit, ladderPackageList,
    setLadderPackageList, setFieldValue
}) => {

    const [showRows, setShowRows] = useState(false);


    const handleAddLadderPackages = () => {
        const packageData = {
            packageName: values?.packageName,
            amount: values?.amount,
            scCoin: values?.scCoin,
            gcCoin: values?.gcCoin,
            scBonus: values?.bonusSc,
            gcBonus: values?.bonusGc,
            isSpecialPackage: values?.isSpecialPackage,
        };

        const alreadyExistsPackageName = ladderPackageList.find((pkg) => pkg.packageName === packageData.packageName);
        if (alreadyExistsPackageName !== undefined) {
            toast(`Package with same name already exists in the list`, 'error');
            return;
        }
        if (packageData.isSpecialPackage === true) {
            const specialLadderPackage = ladderPackageList.find((pkg) => pkg.isSpecialPackage === true);
            if (specialLadderPackage !== undefined) {
                toast('Only one package can be a special package', 'error');
                return;
            }
        }

        setLadderPackageList((prevList) => {
            const updatedLadderPackageList = [...prevList, packageData];
            setFieldValue('ladderPackageData', updatedLadderPackageList);
            return updatedLadderPackageList;
        });

        setFieldValue('packageName', '');
        setFieldValue('amount', '');
        setFieldValue('scCoin', '');
        setFieldValue('gcCoin', '');
        setFieldValue('bonusSc', '');
        setFieldValue('bonusGc', '');
        setFieldValue('isSpecialPackage', false);
    };

    const handleDeletePackage = (packageName) => {
        const updatedLadderPackageList = ladderPackageList?.filter((pkg) => pkg.packageName !== packageName);
        setLadderPackageList(updatedLadderPackageList);
        setFieldValue('ladderPackageData', updatedLadderPackageList);
    };

    const handleButtonClick = () => {
        setShowRows(!showRows);
    };
    const handleCancel = () => {
        setShowRows(false);

        setLadderPackageList([]);
        setFieldValue('packageName', '');
        setFieldValue('amount', '');
        setFieldValue('scCoin', '');
        setFieldValue('gcCoin', '');
        setFieldValue('bonusSc', '');
        setFieldValue('bonusGc', '');
        setFieldValue('isSpecialPackage', false);
    };

    return (
        <>
            <div className='container-fluid'>
                <Row className='rounded mt-2 p-2' style={{ border: '0.0625rem solid #d1d7e0' }}>
                    <Button
                        variant='outline-primary'
                        className='f-right ml-2'
                        onClick={handleButtonClick}
                        hidden={showRows}
                    >
                        Add Packages
                    </Button>

                    {showRows && (
                        <div className='container-fluid'>
                            <Row className='mt-3'>
                                <Col md={6}>
                                    <BForm.Label>
                                        Package Name<span className='text-danger'> *</span>
                                    </BForm.Label>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id='tooltip-package-name'>Enter the name of the package.</Tooltip>}
                                    >
                                        <BForm.Control
                                            type='text'
                                            name='packageName'
                                            placeholder={t('Package Name')}
                                            value={values.packageName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={(evt) => ['+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                                        />
                                    </OverlayTrigger>
                                    <ErrorMessage component='div' name='packageName' className='text-danger' />
                                </Col>

                                <Col md={3}>
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

                                <Col md={3}>
                                    <BForm.Label>
                                        {t('createPackage.inputFields.gcField.label')}
                                        <span className='text-danger'> *</span>
                                    </BForm.Label>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id='tooltip-gc'>Enter the GC value.</Tooltip>}
                                    >
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
                            </Row>
                            <Row className='mt-3 d-flex align-items-end'>
                                <Col md={3}>
                                    <BForm.Label>
                                        {t('createPackage.inputFields.scField.label')}
                                        <span className='text-danger'> *</span>
                                    </BForm.Label>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id='tooltip-sc'>Enter the SC value.</Tooltip>}
                                    >
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

                                <Col md={3}>
                                    <BForm.Label>{t('createPackage.inputFields.bonusSc.label')}</BForm.Label>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id='tooltip-bonus-sc'>Enter SC bonus value.</Tooltip>}
                                    >
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

                                <Col md={3}>
                                    <BForm.Label>{t('createPackage.inputFields.bonusGc.label')}</BForm.Label>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id='tooltip-bonus-gc'>Enter GC bonus value.</Tooltip>}
                                    >
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

                                <Col md={3}>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={<Tooltip id='tooltip-special-package'>This is a special package.</Tooltip>}
                                    >
                                        <div
                                            className='d-flex align-items-center rounded p-2 justify-content-between'
                                            style={{ border: '0.0625rem solid #d1d7e0' }}
                                        >
                                            <p className='mb-0'>
                                                {t('createPackage.inputFields.specialPackage')}
                                                <span className='text-danger'> *</span>
                                            </p>
                                            <BForm.Check
                                                name='isSpecialPackage'
                                                checked={values.isSpecialPackage}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={values.welcomePurchaseBonusApplicable}
                                            />
                                        </div>
                                    </OverlayTrigger>
                                    <ErrorMessage component='div' name='isSpecialPackage' className='text-danger' />
                                </Col>
                            </Row>

                            <Row className='mt-3'>
                                <div className='mt-4 d-flex justify-content-between align-items-center'>
                                    <Button variant='warning' onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant='primary'
                                        onClick={handleAddLadderPackages}
                                        disabled={
                                            values?.packageName === '' ||
                                            values?.amount === '' ||
                                            values?.amount <= 0 ||
                                            values?.gcCoin === '' ||
                                            values?.scCoin === ''
                                        }
                                    >
                                        Add Package
                                    </Button>
                                </div>
                            </Row>

                            {ladderPackageList?.length > 0 && (
                                <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                                    <thead className='thead-dark'>
                                        <tr>
                                            {[
                                                'PACKAGE NAME',
                                                'AMOUNT',
                                                'GC COIN',
                                                'SC COIN',
                                                'GC bONUS',
                                                'SC BONUS',
                                                'SPECIAL PACKAGE',
                                                'ACTION',
                                            ].map((h) => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ladderPackageList?.map((pkg, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{pkg.packageName}</td>
                                                    <td>{pkg.amount}</td>
                                                    <td>{pkg.gcCoin}</td>
                                                    <td>{pkg.scCoin}</td>
                                                    <td>{pkg.gcBonus}</td>
                                                    <td>{pkg.scBonus}</td>
                                                    <td>{pkg.isSpecialPackage ? 'Yes' : 'No'}</td>
                                                    <td>
                                                        <Trigger message='Delete' id={pkg?.packageName + 'delete'} />
                                                        <Button
                                                            id={pkg?.packageName + 'delete'}
                                                            className='m-1'
                                                            size='sm'
                                                            variant='danger'
                                                            onClick={() => handleDeletePackage(pkg.packageName)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    )}
                </Row>

                <ErrorMessage component='div' name='ladderPackageData' className='text-danger' />
            </div>
        </>
    );
};

export default LadderPackageFormSection;

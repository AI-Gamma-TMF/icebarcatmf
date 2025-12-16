import React from 'react';
import {
    Button,
    Form as BForm,
    Table
} from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
import Trigger from '../../../../../components/OverlayTrigger';
import useCheckPermission from '../../../../../utils/checkPermission';

const SubPackageListTable = ({ values, editRowId, editValues, handleEditSubpackage, handleCancelEdit,
    handleEditClick, handleSubpackageSubmit, setFieldValue
}) => {

    const handleDeleteSubPackages = (intervalDays) => {
        const updatedPackages = values?.intervalsConfig?.filter((pkg) => pkg.intervalDays !== intervalDays);
        setFieldValue('intervalsConfig', updatedPackages);
    };

    const { isHidden } = useCheckPermission();
    return (
        <>
            <Table bordered striped responsive hover size='sm' className='text-center'>
                <thead className='thead-dark'>
                    <tr>
                        {[
                            'INTERVAL DAYS',
                            'DISCOUNTED AMOUNT',
                            'GC COIN',
                            'SC COIN',
                            'GC BONUS',
                            'SC BONUS',
                            'BONUS PERCENTAGE',
                            'NUMBER OF PURCHASES',
                            'ENABLE LAST PURCHASE DATE',
                            'ACTIVE',
                            'ACTION',
                        ]?.map((h) => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {values?.intervalsConfig.map((pkg, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <>
                                            <BForm.Control
                                                type='number'
                                                name='intervalDays'
                                                step='any'
                                                min='0'
                                                onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                                                value={editValues.intervalDays || ''}
                                                onChange={handleEditSubpackage}
                                            />
                                        </>
                                    ) : (
                                        pkg.intervalDays
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <>
                                            {' '}
                                            <BForm.Control
                                                type='number'
                                                name='discountedAmount'
                                                step='any'
                                                min='0'
                                                onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
                                                value={editValues.discountedAmount || ''}
                                                onChange={handleEditSubpackage}
                                            />
                                        </>
                                    ) : (
                                        pkg.discountedAmount
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <BForm.Control
                                            style={{ width: '5rem' }}
                                            type='number'
                                            name='subpackageGcCoin'
                                            step='any'
                                            min='0'
                                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                                            value={editValues.subpackageGcCoin || ''}
                                            onChange={handleEditSubpackage}
                                        />
                                    ) : (
                                        pkg.subpackageGcCoin
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <BForm.Control
                                            style={{ width: '5rem' }}
                                            type='number'
                                            name='subpackageScCoin'
                                            step='any'
                                            min='0'
                                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                                            value={editValues.subpackageScCoin || ''}
                                            onChange={handleEditSubpackage}
                                        />
                                    ) : (
                                        pkg.subpackageScCoin
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <BForm.Control
                                            type='number'
                                            style={{ width: '5rem' }}
                                            name='subpackageGcBonus'
                                            step='any'
                                            min='0'
                                            value={editValues.subpackageGcBonus || ''}
                                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                                            onChange={handleEditSubpackage}
                                        />
                                    ) : (
                                        pkg.subpackageGcBonus
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <BForm.Control
                                            style={{ width: '5rem' }}
                                            type='number'
                                            name='subpackageScBonus'
                                            step='any'
                                            min='0'
                                            value={editValues.subpackageScBonus || ''}
                                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                                            onChange={handleEditSubpackage}
                                        />
                                    ) : (
                                        pkg.subpackageScBonus
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <BForm.Control
                                            type='number'
                                            name='subpackageBonusPercentage'
                                            step='any'
                                            min='0'
                                            onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
                                            value={editValues.subpackageBonusPercentage || ''}
                                            onChange={handleEditSubpackage}
                                            disabled
                                        />
                                    ) : (
                                        pkg?.subpackageBonusPercentage
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <BForm.Control
                                            type='number'
                                            name='subpackageNoOfPurchase'
                                            step='any'
                                            min='0'
                                            onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                                            value={editValues.subpackageNoOfPurchase || ''}
                                            onChange={handleEditSubpackage}
                                        />
                                    ) : (
                                        pkg?.subpackageNoOfPurchase
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <BForm.Check
                                            type='switch'
                                            name='subpackagePurchaseDate'
                                            checked={editValues.subpackagePurchaseDate}
                                            onChange={handleEditSubpackage}
                                        />
                                    ) : pkg?.subpackagePurchaseDate ? (
                                        'Yes'
                                    ) : (
                                        'No'
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <BForm.Check
                                            name='subpackageIsActive'
                                            checked={editValues.subpackageIsActive}
                                            onChange={handleEditSubpackage}
                                        />
                                    ) : pkg.subpackageIsActive ? (
                                        'Yes'
                                    ) : (
                                        'No'
                                    )}
                                </td>
                                <td>
                                    {editRowId === pkg?.intervalDays ? (
                                        <>
                                            <Trigger message={'Save'} id={pkg?.intervalDays + 'save'} />
                                            <Button
                                                id={pkg?.intervalDays + 'save'}
                                                className='m-1'
                                                size='sm'
                                                variant='warning'
                                                onClick={handleSubpackageSubmit}
                                                disabled={
                                                    editValues?.intervalDays <= 0 ||
                                                    editValues?.discountedAmount === '' ||
                                                    editValues?.discountedAmount <= 0 ||
                                                    editValues?.subpackageGcCoin === '' ||
                                                    editValues?.subpackageScCoin === '' ||
                                                    editValues?.subpackageGcBonus === '' ||
                                                    editValues?.subpackageScBonus === '' ||
                                                    editValues?.subpackageBonusPercentage < 0
                                                }
                                            >
                                                <FontAwesomeIcon icon={faSave} />
                                            </Button>
                                            <Trigger message={'Cancel'} id={pkg?.intervalDays + 'cancel'} />

                                            <Button
                                                id={pkg?.intervalDays + 'cancel'}
                                                className='m-1'
                                                size='sm'
                                                variant='warning'
                                                onClick={handleCancelEdit}
                                            >
                                                <FontAwesomeIcon icon={faCancel} />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Trigger message='Delete' id={pkg?.intervalDays + 'delete'} />
                                            <Button
                                                id={pkg?.intervalDays + 'delete'}
                                                className='m-1'
                                                size='sm'
                                                variant='danger'
                                                onClick={() => handleDeleteSubPackages(pkg?.intervalDays)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>

                                            <Trigger message={'Edit'} id={pkg?.intervalDays + 'edit'} />
                                            <Button
                                                id={pkg?.intervalDays + 'edit'}
                                                className='m-1'
                                                size='sm'
                                                variant='warning'
                                                onClick={() => handleEditClick(pkg)}
                                                hidden={isHidden({ module: { key: 'Package', value: 'U' } })}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
};

export default SubPackageListTable;

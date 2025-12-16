import React, { useEffect, useState } from 'react'
import useCheckPermission from '../../utils/checkPermission'
import {
    Button,
    Form,
    Row,
    Col,
    Table,
    Form as BForm,
} from '@themesberg/react-bootstrap'
import { InlineLoader } from '../../components/Preloader'
import Trigger from '../../components/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faEdit, faCancel, faWindowClose, faSave } from '@fortawesome/free-solid-svg-icons'
import PaginationComponent from '../../components/Pagination'
import { ConfirmationModal } from '../../components/ConfirmationModal'
// import { getItem } from '../../utils/storageUtils'
// import { timeZones } from '../Dashboard/constants'
// import { getFormattedTimeZoneOffset } from '../../utils/helper'
import useReferralBonus from './hooks/useReferralBonus'

const ReferralBonusListing = () => {
    const { isHidden } = useCheckPermission()
    // const [dataBonus, setDataBonus] = useState([])
    const [editRowId, setEditRowId] = useState(null) 
    const [editValues, setEditValues] = useState({})

    const { updateBonus } = useReferralBonus()

    const handleSubmit = (updateValues) => {
        updateBonus(updateValues)
        setEditRowId(null) 
    }

    const {
        t,
        // navigate,
        limit,
        page,
        // search,
        setPage,
        setLimit,
        // setSearch,
        // bonusType,
        // setBonusType,
        handleStatusShow,
        statusShow,
        setStatusShow,
        // handleDeleteModal,
        status,
        handleYes,
        bonusData,
        totalPages,
        loading,
        active,
        setActive,
        // handleDeleteYes,
        // deleteModalShow,
        // setDeleteModalShow,
        bonus
    } = useReferralBonus()

    useEffect(() => {
        const set = new Set()
        bonusData?.rows?.map((bonus) => { set.add(bonus?.bonusType) })
        // setDataBonus(Array.from(set))
    }, [bonusData])

    // const timeZone = getItem("timezone");
    // const timezoneOffset = timeZone != null ? timeZones.find(x => x.code === timeZone).value : getFormattedTimeZoneOffset()

    const handleEditClick = (row) => {
        setEditRowId(row.bonusId)
        setEditValues({
            scAmount: row.scAmount,
            gcAmount: row.gcAmount,
            minimumPurchase: row.minimumPurchase
        })
    }

    const handleChange = (e, field) => {
        setEditValues({
            ...editValues,
            [field]: e.target.value
        })
    }

    return (
        <>
            <Row>
                <Col xs='9'>
                    <h3>Referral Bonus</h3>
                </Col>

            </Row>
            <Row className='mt-2'>
               
                <Col xs='12' sm='6' lg='3'>
                    <Form.Label>
                        {t('filter.status')}
                    </Form.Label>

                    <Form.Select
                        value={active}
                        onChange={(event) => {
                            setPage(1)
                            setActive(
                                event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
                            )}
                          }
                    >
                        <option key='' value=''>{t('filter.all')}</option>
                        <option key='true' value>{t('filter.active')}</option>
                        <option key='false' value={false}>{t('filter.inActive')}</option>
                    </Form.Select>
                </Col>
            </Row>
            {<Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                <thead className='thead-dark'>
                    <tr>
                        {[t('headers.scAmount'), t('headers.gcAmount'), t('headers.minPurchase'),  t('headers.status'), t('headers.action')].map((h) => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Boolean(bonusData) &&
                        bonusData?.rows?.map(
                            (bonus) => {
                                const { bonusId, bonusName, validFrom, isActive, minimumPurchase, gcAmount, scAmount, description, btnText, termCondition } = bonus;
                                return (
                                    <tr key={bonusId}>
                                        <td>
                                            {editRowId === bonusId ? (
                                              <BForm.Control
                                              type="number"
                                              name="scAmount"
                                              min="0"
                                              step="any" 
                                              value={editValues.scAmount || ''}
                                              onChange={(e) => handleChange(e, 'scAmount')}
                                              onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                                if (allowedKeys.includes(e.key)) return;
        
                                                if (!/\d|\.|Shift|Control|Alt/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                              onInput={(e) => {
                                                const value = e.target.value;
                                                if (!/^\d*\.?\d*$/.test(value)) {
                                                    e.target.value = '';
                                                }
                                            }}
                                            
                                          />
                                          
                                            ) : (
                                                scAmount
                                            )}
                                        </td>
                                        <td>
                                            {editRowId === bonusId ? (
                                                <BForm.Control
                                                    type="number"
                                                    name="gcAmount"
                                                    min="0"
                                                    step="any" 
                                                    value={editValues.gcAmount || ''}
                                                    onChange={(e) => handleChange(e, 'gcAmount')}
                                                    onKeyDown={(e) => {
                                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                                        if (allowedKeys.includes(e.key)) return;
                
                                                        if (!/\d|\.|Shift|Control|Alt/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                      onInput={(e) => {
                                                        const value = e.target.value;
                                                        if (!/^\d*\.?\d*$/.test(value)) {
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                gcAmount
                                            )}
                                        </td>
                                        <td>
                                            {editRowId === bonusId ? (
                                                <BForm.Control
                                                    type="number"
                                                    name="minimumPurchase"
                                                    min="0"
                                                    step="any"
                                                    value={editValues.minimumPurchase || ''}
                                                    onChange={(e) => handleChange(e, 'minimumPurchase')}
                                                    onKeyDown={(e) => {
                                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                                        if (allowedKeys.includes(e.key)) return;
                
                                                        if (!/\d|\.|Shift|Control|Alt/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                      onInput={(e) => {
                                                        const value = e.target.value;
                                                        if (!/^\d*\.?\d*$/.test(value)) {
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                minimumPurchase
                                            )}
                                        </td>
                                        <td>
                                            {isActive
                                                ? (
                                                    <span className='text-success'>{t('filter.active')}</span>
                                                )
                                                : (
                                                    <span className='text-danger'>{t('filter.inActive')}</span>
                                                )}
                                        </td>
                                        <td>
                                            {editRowId === bonusId ? (
                                                <>
                                                    <Trigger message={t('message.save')} id={bonusId + 'save'} />
                                                    <Button
                                                       id={bonusId +'save'}
                                                        className='m-1'
                                                        size='sm'
                                                        variant='warning'
                                                        onClick={() => handleSubmit({
                                                            bonusId,
                                                            bonusName,
                                                            startDate: validFrom,
                                                            gcAmount: editValues.gcAmount,
                                                            scAmount: editValues.scAmount,
                                                            description,
                                                            isActive,
                                                            btnText,
                                                            termCondition,
                                                            minimumPurchase: editValues.minimumPurchase
                                                        })}
                                                        hidden={isHidden({ module: { key: 'Bonus', value: 'U' } })}
                                                    >
                                                        <FontAwesomeIcon icon={faSave} />
                                                    </Button>
                                                    <Trigger message={t('message.cancel')} id={bonusId + 'cancel'} />

                                                    <Button
                                                       id={bonusId +'cancel'}
                                                        className='m-1'
                                                        size='sm'
                                                        variant='warning'
                                                        onClick={() => setEditRowId(null)}
                                                        hidden={isHidden({ module: { key: 'Bonus', value: 'U' } })}
                                                    >
                                                        <FontAwesomeIcon icon={faCancel} />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Trigger message={t('message.edit')} id={bonusId + 'edit'} />
                                                    <Button
                                                       id={bonusId +'edit'}
                                                        
                                                        className='m-1'
                                                        size='sm'
                                                        variant='warning'
                                                        onClick={() => handleEditClick(bonus)}
                                                        hidden={isHidden({ module: { key: 'Bonus', value: 'U' } })}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    
                                                    {!isActive
                                                        ? (
                                                            <>
                                                                <Trigger message={t('message.statusActive')} id={bonusId + 'active'} />
                                                                <Button
                                                                id={bonusId +'active'}
                                                                    className='m-1'
                                                                    size='sm'
                                                                    variant='success'
                                                                    onClick={() =>
                                                                        handleStatusShow(bonus, isActive)}
                                                                    hidden={isHidden({ module: { key: 'Bonus', value: 'T' } })}
                                                                >
                                                                    <FontAwesomeIcon icon={faCheckSquare} />
                                                                </Button>
                                                            </>
                                                        )
                                                        : (
                                                            <>
                                                                <Trigger message={t('message.statusInactive')} id={bonusId + 'inactive'} />
                                                                <Button
                                                                id={bonusId +'inactive'}
                                                                    className='m-1'
                                                                    size='sm'
                                                                    variant='danger'
                                                                    onClick={() =>
                                                                        handleStatusShow(bonus, isActive)}
                                                                    hidden={isHidden({ module: { key: 'Bonus', value: 'T' } })}
                                                                >
                                                                    <FontAwesomeIcon icon={faWindowClose} />
                                                                </Button>
                                                            </>
                                                        )}
                                                   
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )
                            }
                        )}
                    {bonusData?.count === 0 &&
                        (
                            <tr>
                                <td
                                    colSpan={6}
                                    className='text-danger text-center'
                                >
                                    {t('noDataFound')}
                                </td>
                            </tr>
                        )}
                </tbody>
            </Table>}
            {loading && <InlineLoader />}
            {bonusData?.count !== 0 && (
                <PaginationComponent
                page={bonusData?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                />
            )}
             {statusShow && 
      <ConfirmationModal
        isBonus={true}
        bonus={bonus}
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleYes}
        active={status}
      />}
        

        </>
    )
}

export default ReferralBonusListing

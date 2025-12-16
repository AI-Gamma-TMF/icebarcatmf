import React, { useState } from "react";
import { Col, Row, Form as BForm, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import Trigger from "../../../../components/OverlayTrigger";

const SelectedPackageFilters = ({
    setPage,
    packageId,
    setPackageId,
    scCoin,
    setScCoin,
    gcCoin,
    setGcCoin,
    amount,
    setAmount,
    isActive,
    setIsActive,
    setLimit
}) => {
    const [error, setError] = useState('')
    const [scError, setScError] = useState('')
    const [gcError, setGcError] = useState('')


    const reset = () => {
        setPackageId('')
        setScCoin('')
        setGcCoin('')
        setAmount('')
        setIsActive('all')
        setError('')
        setScError('')
        setGcError('')
        setPage(1)
        setLimit(15)
    }

    return (
        <Row>
            <Col xs={3} className="mb-3">
                <BForm.Label>
                    Package Id
                </BForm.Label>

                <BForm.Control
                    type='search'
                    placeholder='Search By Package Id'
                    value={packageId}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            if (inputValue.length <= 10) {
                                setPage(1);
                                setPackageId(inputValue);
                                setError('')
                            } else {
                                setError('Package Id cannot exceed 10 digits')
                            }
                        }
                    }}
                />
                {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
            </Col>

            <Col xs={3} className="mb-3">
                <BForm.Label >
                    SC Coin
                </BForm.Label>

                <BForm.Control
                    type='search'
                    placeholder='Search By SC coin'
                    value={scCoin}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            if (inputValue.length <= 10) {
                                setPage(1);
                                setScCoin(inputValue);
                                setScError('')
                            } else {
                                setScError('SC Coin cannot exceed 10 digits')
                            }
                        }
                    }}
                />
                {scError && <div style={{ color: 'red', marginTop: '5px' }}>{scError}</div>}

            </Col>

            <Col xs={3} className="mb-3">
                <BForm.Label>
                    GC Coin
                </BForm.Label>

                <BForm.Control
                    type='search'
                    placeholder='Search By GC coin'
                    value={gcCoin}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            if (inputValue.length <= 10) {
                                setPage(1);
                                setGcCoin(inputValue);
                                setGcError('')
                            } else {
                                setGcError('GC Coin cannot exceed 10 digits')
                            }
                        }
                    }}
                />
                {gcError && <div style={{ color: 'red', marginTop: '5px' }}>{gcError}</div>}

            </Col>


            <Col xs={3} className="mb-3">
                <BForm.Label >
                    Amount
                </BForm.Label>

                <BForm.Control
                    type='search'
                    placeholder='Search By Amount'
                    value={amount}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            setPage(1);
                            setAmount(inputValue);
                        }
                    }}
                />
            </Col>

            <Col xs={3} className="mb-3">
                <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                    <BForm.Label>
                        Status
                    </BForm.Label>

                    <BForm.Select
                        onChange={(e) => {
                            setPage(1)
                            setIsActive(e?.target?.value)
                        }}
                        value={isActive}
                    >
                        <option value='all'>All</option>
                        <option value='true'>Active</option>
                        <option value='false'>In-Active</option>
                    </BForm.Select>
                </div>
            </Col>

            <Col xs={3} style={{ marginTop: "30px" }}>
                <Trigger message='Reset Filters' id={'redo'} />
                <Button
                    id={'redo'}
                    variant='success'
                    onClick={reset}
                >
                    <FontAwesomeIcon icon={faRedoAlt} />
                </Button>
            </Col>
        </Row>
    )
}

export default SelectedPackageFilters
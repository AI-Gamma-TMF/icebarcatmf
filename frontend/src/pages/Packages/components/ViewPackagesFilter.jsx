import React, { useState } from "react";
import { Col, Row, Form, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { searchRegEx } from "../../../utils/helper";
import Trigger from "../../../components/OverlayTrigger";

const ViewPackagesFilter = ({
    setPageNo,
    userIdSearch,
    setUserIdSearch,
    usernameSearch,
    setUsernameSearch,
    setScCoin,
    setBonusSc,
    setPromocodeBonus,
    setCoinsCredited
}) => {

    const [error, setError] = useState('')

    const resetFilters = () => {
        setUserIdSearch('')
        setUsernameSearch('')
        setScCoin('')
        setBonusSc('')
        setPromocodeBonus('')
        setCoinsCredited('')
        setError('')
    };

    return (
        <Row>
            <Col xs={3}>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
                    User Id
                </Form.Label>

                <Form.Control
                    type='search'
                    placeholder='Search by User Id'
                    value={userIdSearch}
                    style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*$/.test(inputValue)) {
                            if (inputValue.length <= 10) {
                                setPageNo(1)
                                setUserIdSearch(inputValue)
                                setError('')
                            } else {
                                setError('User Id cannot exceed 10 digits')
                            }
                        }
                    }}
                />
                {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
            </Col>
            <Col xs={3}>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
                    Search by Username or Email
                </Form.Label>

                <Form.Control
                    type='search'
                    placeholder='Search by Username or Email'
                    value={usernameSearch}
                    style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                    onChange={(event) => {
                        setPageNo(1)
                        const mySearch = event.target.value.replace(searchRegEx, '')
                        setUsernameSearch(mySearch)
                    }}
                />
            </Col>
            {/* <Col xs={3}>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
                    SC Coin
                </Form.Label>

                <Form.Control
                    type='search'
                    placeholder='SC Coin'
                    value={scCoin}
                    style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*$/.test(inputValue)) {
                            setPageNo(1);
                            setScCoin(inputValue);
                        }
                    }}
                />
            </Col>
            <Col xs={3}>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
                    Bonus SC
                </Form.Label>

                <Form.Control
                    type='search'
                    placeholder='Bonus SC'
                    value={bonusSc}
                    style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*$/.test(inputValue)) {
                            setPageNo(1);
                            setBonusSc(inputValue);
                        }
                    }}
                />
            </Col>
            <Col xs={3}>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
                    Promocode Bonus
                </Form.Label>

                <Form.Control
                    type='search'
                    placeholder='Promocode Bonus'
                    value={promocodeBonus}
                    style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*$/.test(inputValue)) {
                            setPageNo(1);
                            setPromocodeBonus(inputValue);
                        }
                    }}
                />
            </Col>

            <Col xs={3}>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
                    Promocode Used Count
                </Form.Label>

                <Form.Control
                    type='search'
                    placeholder='Promocode Used Count'
                    value={coinsCredited}
                    style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*$/.test(inputValue)) {
                            setPageNo(1);
                            setCoinsCredited(inputValue);
                        }
                    }}
                />
            </Col> */}

            <Col xs={3} style={{ marginTop: "35px" }}>
                <Trigger message="Reset Filters" id={"redo"} />
                <Button
                    id={"redo"}
                    variant="success"
                    className=""
                    onClick={resetFilters}
                >
                    <FontAwesomeIcon icon={faRedoAlt} />
                </Button>
            </Col>

        </Row>
    )
}

export default ViewPackagesFilter
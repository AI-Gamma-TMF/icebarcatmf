import React from "react";
import {
    Button,
    Row,
    Col,
    Form,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faRedoAlt
} from '@fortawesome/free-solid-svg-icons'
import Trigger from "../../../components/OverlayTrigger";
// import { useUserStore } from "../../../store/store";

const RaffleFilters = ({
    setPage,
    setLimit,
    searchByTitle,
    setSearchByTitle,
    status,
    setStatus,
    isActive,
    setIsActive,
    wgrBaseAmt,
    setWgrBaseAmt,
    // startDate,
    // setStartDate,
    // endDate,
    // setEndDate,
    // errorStart,
    // errorEnd,
    // handleStartDateChange,
    // handleEndDateChange
}) => {

    // const timeZoneCode = useUserStore((state) => state.timeZoneCode);

    const resetFilters = () => {
        setPage(1)
        setLimit(15)
        setSearchByTitle('')
        setStatus('all')
        setIsActive('all')
        setWgrBaseAmt('')
        // setStartDate(convertTimeZone(getDateDaysAgo(10), timeZoneCode))
        // setEndDate(convertTimeZone(new Date(), timeZoneCode))
    }

    return (

        <Row>
            <Col xs={12} md={3} className="mb-3">
                <Form.Label>
                    Search by Title or Id
                </Form.Label>
                <Form.Control
                    type='search'
                    placeholder='Search...'
                    value={searchByTitle}
                    onChange={(event) => {
                        setPage(1)
                        const search = event?.target?.value.replace(/[~`!$%@^&*#=)()><?]+/g, '')
                        setSearchByTitle(search)
                    }}
                />
            </Col>

            <Col xs={12} md={3} className="mb-3">
                <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                    <Form.Label>
                        Status
                    </Form.Label>

                    <Form.Select
                        onChange={(e) => {
                            setPage(1)
                            setStatus(e.target.value)
                        }}
                        value={status}
                    >
                        <option value='all'>All</option>
                        <option value='upcoming'>Up-coming</option>
                        <option value='ongoing'>On-Going</option>
                        <option value='completed'>Completed</option>
                    </Form.Select>
                </div>
            </Col>

            <Col xs={12} md={3} className="mb-3">
                <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                    <Form.Label>
                        Account Status
                    </Form.Label>

                    <Form.Select
                        onChange={(e) => {
                            setPage(1)
                            setIsActive(e.target.value)
                        }}
                        value={isActive}
                    >
                        <option value='all'>All</option>
                        <option value='true'>Active</option>
                        <option value='false'>In-Active</option>
                    </Form.Select>
                </div>
            </Col>

            <Col xs={12} md={3} className="mb-3">
                <Form.Label>
                    Wage Base Amount
                </Form.Label>
                <Form.Control
                    type='search'
                    placeholder='Wage Base Amount'
                    value={wgrBaseAmt}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            setPage(1);
                            setWgrBaseAmt(inputValue);
                        }
                    }}
                />
            </Col>

            {/* <Col xs={3} className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Datetime
                    key={startDate}
                    // inputProps={{
                    //   placeholder: "MM-DD-YYYY",
                    // }}
                    value={startDate}
                    onChange={handleStartDateChange}
                    //onChange={(date) => setStartDate(date)}
                    timeFormat={false}
                />
                {errorStart && <div style={{ color: 'red', marginTop: '5px' }}>{errorStart}</div>}
            </Col>

            <Col xs={3} className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Datetime
                    key={endDate}
                    // inputProps={{
                    //   placeholder: "MM-DD-YYYY",
                    // }}
                    value={endDate}
                    onChange={handleEndDateChange}
                    //onChange={(date) => setEndDate(date)}
                    timeFormat={false}
                />
                {errorEnd && <div style={{ color: 'red', marginTop: '5px' }}>{errorEnd}</div>}
            </Col> */}


            <Col xs={12} md={3} style={{ marginTop: "30px" }}>
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

export default RaffleFilters
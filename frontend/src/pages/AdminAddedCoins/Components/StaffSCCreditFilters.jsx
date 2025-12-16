import React from 'react';
import { Row, Form, Col, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import Trigger from '../../../components/OverlayTrigger';

const StaffSCCreditFilters = ({
    search,
    setSearch,
    resetFilters,
    setPage,
}) => {

    return (
        <Row className='mb-3 w-100 m-auto'>
            <Col xs="12" lg="auto" className="mt-2 mt-lg-0">
                <div className="d-flex justify-content-start mt-3 align-items-center w-100 flex-wrap">
                    <Form.Label
                        column="sm"
                        style={{ marginBottom: "0", marginRight: "15px" }}
                    >
                        Search
                    </Form.Label>
                    <Form.Control
                        type="search"
                        value={search}
                        placeholder={"Search by Email or Name"}
                        onChange={(event) => {
                            setPage(1);
                            setSearch(event?.target?.value);
                        }}
                        style={{ minWidth: "230px" }}
                    />
                </div>
            </Col>

            <Col xs="12" lg="auto" className="mt-2 align-items-end d-flex mt-lg-0">
                <Trigger message="Reset Filters" id={"redo"} />
                <Button id={"redo"} variant="success" onClick={resetFilters}>
                    <FontAwesomeIcon icon={faRedoAlt} />
                </Button>
            </Col>
        </Row>
    )
}

export default StaffSCCreditFilters
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
        <Row className="dashboard-filters admin-coins-filters g-3 align-items-end">
            <Col xs={12} md={10}>
                <Form.Label className="form-label">Search</Form.Label>
                <Form.Control
                    className="admin-coins-filters__control"
                    type="search"
                    value={search}
                    placeholder="Search by Email or Name"
                    onChange={(event) => {
                        setPage(1);
                        setSearch(event?.target?.value);
                    }}
                />
            </Col>

            <Col xs={12} md={2} className="d-flex justify-content-end">
                <Trigger message="Reset Filters" id={"redo"} />
                <Button
                    id={"redo"}
                    className="admin-coins-page__reset-btn"
                    variant="success"
                    onClick={resetFilters}
                >
                    <FontAwesomeIcon icon={faRedoAlt} />
                </Button>
            </Col>
        </Row>
    )
}

export default StaffSCCreditFilters
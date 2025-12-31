import React from 'react';
import { Row, Col, Card } from "@themesberg/react-bootstrap";
import useStaffSCCreditDetails from './hooks/useStaffSCCreditDetails';
import StaffSCCreditSummary from './Components/StaffSCCreditSummary';
import StaffSCCreditTable from './Components/StaffSCCreditTable';
import StaffSCCreditFilters from './Components/StaffSCCreditFilters';
import './adminAddedCoins.scss';

const StaffSCCreditDetails = () => {
    const {
        setLimit,
        setPage,
        totalPages,
        limit,
        page,
        StaffSCCreditData,
        loading,
        search,
        setSearch,
        resetFilters,
        orderBy,
        setOrderBy,
        sort,
        setSort,
        over,
        setOver,
        selected,
        isFetching,
    } = useStaffSCCreditDetails();


    return (
        <>
            <div className="admin-coins-page dashboard-typography">
                <Row className="d-flex align-items-center mb-2">
                    <Col>
                        <h3 className="admin-coins-page__title">Admin Added Coins</h3>
                    </Col>
                </Row>

                <StaffSCCreditSummary
                    StaffSCCreditSummaryData={StaffSCCreditData?.reportData}
                />

                <Card className="p-2 mb-2 admin-coins-page__card">
                    <StaffSCCreditFilters
                        search={search}
                        setSearch={setSearch}
                        resetFilters={resetFilters}
                        setPage={setPage}
                    />

                    <div className="dashboard-section-divider" />

                    <StaffSCCreditTable
                        setLimit={setLimit}
                        setPage={setPage}
                        totalPages={totalPages}
                        limit={limit}
                        page={page}
                        data={StaffSCCreditData?.adminDetails}
                        loading={loading}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                        sort={sort}
                        setSort={setSort}
                        over={over}
                        setOver={setOver}
                        selected={selected}
                        isFetching={isFetching}
                    />
                </Card>
            </div>
        </>
    );
};

export default StaffSCCreditDetails;

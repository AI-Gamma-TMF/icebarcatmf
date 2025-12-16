import React from 'react';
import { Row, Col } from "@themesberg/react-bootstrap";
import useStaffSCCreditDetails from './hooks/useStaffSCCreditDetails';
import StaffSCCreditSummary from './Components/StaffSCCreditSummary';
import StaffSCCreditTable from './Components/StaffSCCreditTable';
import StaffSCCreditFilters from './Components/StaffSCCreditFilters';

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
            <Col>
                <h3>Admin Added Coins</h3>
            </Col>

            <StaffSCCreditSummary
                StaffSCCreditSummaryData={StaffSCCreditData?.reportData}
            />

            <Row>
                <StaffSCCreditFilters
                    search={search}
                    setSearch={setSearch}
                    resetFilters={resetFilters}
                    setPage={setPage}
                />
            </Row>

            <Row>
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
                    isFetching={ isFetching}
                />
            </Row>
        </>
    );
};

export default StaffSCCreditDetails;

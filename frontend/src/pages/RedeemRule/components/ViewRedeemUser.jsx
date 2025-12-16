import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Table, Spinner, Form, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";


import PaginationComponent from "../../../components/Pagination";
import Trigger from "../../../components/OverlayTrigger";
import { statusOptions } from "../constants";
import useRedeemRequestDetails from "../hooks/useRedeemRequestDetails";

function ViewRedeemUser() {
  
  const { ruleId } = useParams();
  const { setLimit,
    setPage,
    totalPages,
    limit,
    page,
    // setRuleId,
    loading,
    search,
    setSearch,
    // fetch,
    statusSearch,
    setStatusSearch,requestData} = useRedeemRequestDetails(ruleId)
    
    
  // const [search, setSearch] = useState('')
  // const [statusSearch, setStatusSearch] = useState('')
  // const [debouncedSearch] = useDebounce(search, 500)
  // const [debouncedStatus] = useDebounce(statusSearch, 500)
  // const {
  //   data: ruledata ,
  //   isLoading: loading,
  //   error,
  // } = useQuery({
  //   queryKey: ["ruledata", limit, page, orderBy, ruleId,debouncedSearch,debouncedStatus],
  //   queryFn: async ({ queryKey }) => {
  //     const params = {
  //       pageNo: queryKey[2],
  //       limit: queryKey[1],
  //       ruleId: queryKey[4],
  //       ...(queryKey[3] && { orderBy: queryKey[3] }),
  //     };
  //     if (queryKey[5]) params.email = queryKey[5]
  //     if (queryKey[6]) params.status = queryKey[6]
  //     return getRedeemWithdrawRequest(params);
  //   },
  //   select: (res) => res?.data,
  //   refetchOnWindowFocus: false,
  // });
  // const { data: ruleData, isLoading: loading, refetch: fetch } = useQuery({
  //   queryKey: ['RuleList', limit, page, debouncedSearch, debouncedStatus, ruleId],
  //   queryFn: ({ queryKey }) => {
  //     const params = { pageNo: queryKey[2], limit: queryKey[1] };
  //     if (queryKey[3]) params.email = queryKey[3]
  //     if (queryKey[4]) params.status = queryKey[4]
  //     if (queryKey[5]) params.ruleId = ruleId


  //     return getRedeemWithdrawRequest(params)
  //   },
  //   refetchOnWindowFocus: false,
  //   select: (res) => res?.data?.withdrawUserDetails
  // })

  // const totalPages = Math.ceil(ruleData?.count / limit)
  const resetFilters = () => {
    setSearch("");
    setStatusSearch("");

  };
  //  const ruleData = ruledata?.withdrawUserDetails
  // const totalPages = Math.ceil(ruleData?.count / limit);
  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>View User Redeem Requests</h3>
        </Col>
      </Row>

      <Row className="w-100 m-auto">
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{
              marginBottom: "0",
              marginRight: "15px",
              marginTop: "5px",
            }}
          >
            Search by Email
          </Form.Label>

          <Form.Control
            type="search"
            value={search}
            placeholder="Search By Email"
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim());
            }}
          />
        </Col>
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{
              marginBottom: "0",
              marginRight: "15px",
              marginTop: "5px",
            }}
          >
            Status
          </Form.Label>


          <Form.Select
            onChange={(e) => {
              setPage(1);
              setStatusSearch(e.target.value);
            }}
            value={statusSearch}
          >
            {
              statusOptions &&
              statusOptions?.map(({ label, value }) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col
          xs="12"
          sm="6"
          lg="1"
          className="d-flex align-items-end mt-2 mt-sm-0 mb-0 mb-sm-3"
        >
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
      <Row className="mt-3">
        <div style={{ overflow: "auto" }}>
          <Table bordered striped hover size="sm" className="text-center mt-4">
            <thead className="thead-dark">
              <tr>
                <th>User ID</th>
                <th>Email</th>

                <th>Amount</th>
                <th>Status</th>
                <th>Provider</th>
                <th>Transaction-Id</th>
              </tr>
            </thead>
            <tbody>

              {requestData?.count > 0 ? (
                requestData.rows.map((data,index) => {
                  return (
                    <tr key={`${data.userId}-${index}`}>
                      <td>{data?.userId}</td>
                      <td>{data?.email}</td>
                      <td>{data?.amount}</td>
                      <td>
                        {data?.status === 0 ? (
                          <span className="warning">Pending</span>
                        ) : data?.status === 1 ? (
                          <span className="success">Approved</span>
                        ) : data?.status === 2 ? (
                          <span className="danger">Cancelled</span>
                        ) : data?.status === 3 ? (
                          <span className="danger">Failed</span>
                        ) : data?.status === 4 ? (
                          <span className="warning">Rollback</span>
                        ) : data?.status === 5 ? (
                          <span className="success">Approved</span>
                        ) : data?.status === 6 ? (
                          <span className="danger">Declined</span>
                        ) : data?.status === 7 ? (
                          <span className="info">In Progress</span>
                        ) : data?.status === 8 ? (
                          <span className="success">Scheduled</span>
                        ) : (
                          <span className="default">Unknown</span>
                        )}
                      </td>


                      <td>{data?.paymentProvider}</td>
                      <td>{data?.transactionId}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-danger" colSpan={5}>
                    No Data Available {loading && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                </tr>
              )}


            </tbody>
          </Table>
          {requestData?.count !== 0 &&

            <PaginationComponent
              page={requestData?.count < page ? setPage(1) : page}
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          }
        </div>
      </Row>
    </div>
  );
}

export default ViewRedeemUser;

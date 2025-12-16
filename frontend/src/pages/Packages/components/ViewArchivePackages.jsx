import React, { useState } from "react";
import { useParams , Link } from "react-router-dom";
import { Col, Row, Table, Spinner } from "@themesberg/react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getArchivePackageHistory } from "../../../utils/apiCalls";
import useCheckPermission from "../../../utils/checkPermission";


const ViewArchivePackages = () => {
    const { isHidden } = useCheckPermission()
    const [limit, _setLimit] = useState(15);
    const [pageNo, _setPageNo] = useState(1);
    const [orderBy, _setOrderBy] = useState('');

    const { packageId } = useParams();

    const { data: packageData = [], isLoading: loading } = useQuery({
        queryKey: ['packageData', limit, pageNo, orderBy, packageId],
        queryFn: async ({ queryKey }) => {
            const params = {
                pageNo: queryKey[2],
                limit: queryKey[1],
                packageId: queryKey[4],
                ...(queryKey[3] && { orderBy: queryKey[3] })
            };
            return getArchivePackageHistory(params);
        },
        select: res => res?.data?.userDetails || [],
        refetchOnWindowFocus: false,
    });

    return (
        <div>
            <Row>
                <Col sm={8}>
                    <h3>View Archived Packages</h3>
                </Col>
            </Row>

            <Row className="mt-3">
                <div style={{ overflow: 'auto' }}>
                    <Table bordered striped hover size='sm' className='text-center mt-4'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Id</th>
                                <th>Email</th>
                                <th>User Name</th>
                                <th>Claimed Count</th>
                                <th>Claimed Amount</th>

                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            )
                            }
                            {packageData?.map((user, idx) => (
                                <tr key={idx}>
                                    <td>{user.actioneeId}</td>
                                    <td>
                                        {isHidden({ module: { key: "Users", value: "R" } }) ? (
                                            user.transactionUser.email
                                        ) : (
                                            <Link to={`/admin/player-details/${user.actioneeId}`}>{user.transactionUser.email}</Link>
                                        )}
                                    </td>
                                    <td>{user.transactionUser.username}</td>
                                    <td>{user.claimedCount}</td>
                                    <td>{user.claimedAmount}</td>
                                </tr>
                            ))}
                            {(packageData?.length === 0) && (
                                <tr>
                                    <td className='text-danger' colSpan={5}>No Data Available</td>
                                </tr>
                            )}

                        </tbody>
                    </Table>
                </div>
            </Row>
        </div>
    );
};

export default ViewArchivePackages;

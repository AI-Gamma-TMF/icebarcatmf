import React, { useState } from "react";
import { useDebounce } from 'use-debounce'
import { useParams , Link } from "react-router-dom";
import { Col, Row, Table, Spinner } from "@themesberg/react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getPackageHistory } from "../../../utils/apiCalls";
import useCheckPermission from "../../../utils/checkPermission";
import ViewPackagesFilter from "./ViewPackagesFilter";
import PaginationComponent from "../../../components/Pagination";


const ViewPackages = () => {
    const { isHidden } = useCheckPermission()
    const [limit, setLimit] = useState(15);
    const [pageNo, setPageNo] = useState(1);
    const [orderBy, _setOrderBy] = useState('');
    const [userIdSearch, setUserIdSearch] = useState('')
    const [debouncedUserIdSearch] = useDebounce(userIdSearch, 500)
    const [usernameSearch, setUsernameSearch] = useState('')
    const [debouncedSearch] = useDebounce(usernameSearch, 500)
    const [scCoin, setScCoin] = useState('')
    const [bonusSc, setBonusSc] = useState('')
    const [promocodeBonus, setPromocodeBonus] = useState('')
    const [coinsCredited, setCoinsCredited] = useState('')

    const { packageId } = useParams();

    const { data: packageData = [], isLoading: loading } = useQuery({
        queryKey: ['packageData', limit, pageNo, orderBy, packageId, debouncedUserIdSearch, debouncedSearch, scCoin, bonusSc, promocodeBonus, coinsCredited],
        queryFn: async ({ queryKey }) => {
            const params = {
                pageNo: queryKey[2],
                limit: queryKey[1],
                packageId: queryKey[4],
                ...(queryKey[3] && { orderBy: queryKey[3] })
            };
            if (queryKey[5]) params.idSearch = queryKey[5]
            if (queryKey[6]) params.search = queryKey[6]
            if (queryKey[7]) params.scCoin = queryKey[7]
            if (queryKey[8]) params.bonusSc = queryKey[8]
            if (queryKey[9]) params.promocodeBonus = queryKey[9]
            if (queryKey[10]) params.coinsCredited = queryKey[10]

            return getPackageHistory(params);
        },
        select: res => res?.data,
        refetchOnWindowFocus: false,
    });

    const totalPages = Math.ceil(packageData?.count / limit);

    return (
        <div>
            <Row>
                <Col sm={8}>
                    <h3>View Packages</h3>
                </Col>
            </Row>

            <ViewPackagesFilter
                setPageNo={setPageNo}
                userIdSearch={userIdSearch}
                setUserIdSearch={setUserIdSearch}
                usernameSearch={usernameSearch}
                setUsernameSearch={setUsernameSearch}
                scCoin={scCoin}
                setScCoin={setScCoin}
                bonusSc={bonusSc}
                setBonusSc={setBonusSc}
                promocodeBonus={promocodeBonus}
                setPromocodeBonus={setPromocodeBonus}
                coinsCredited={coinsCredited}
                setCoinsCredited={setCoinsCredited}
            />

            <Row className="mt-3">
                <div style={{ overflow: 'auto' }}>
                    <Table bordered striped hover size='sm' className='text-center mt-4'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>User Id</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Number of times purchased</th>
                                <th>Amount</th>
                                <th>Coins Credited</th>
                                <th>SC Coin</th>
                                <th>Bonus SC</th>
                                <th>Promocode Bonus</th>
                                <th>Promocode Applied</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={10} className="text-center">
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />                                    </td>
                                </tr>
                            )
                            }

                            {packageData?.userDetails?.map((user, idx) => (
                                <tr key={idx}>
                                    <td>{user?.actioneeId}</td>
                                    <td>{user?.transactionUser?.username}</td>
                                    <td>
                                        {isHidden({ module: { key: "Users", value: "R" } }) ? (
                                            user.transactionUser.email
                                        ) : (
                                            <Link to={`/admin/player-details/${user.actioneeId}`}>{user.transactionUser.email}</Link>
                                        )}
                                    </td>
                                    <td>{user?.claimedCount}</td>
                                    <td>{Number(user?.claimedAmount)?.toFixed(2)}</td>
                                    <td>{user?.creditedCoins}</td>
                                    <td>{user?.scCoin}</td>
                                    <td>{user?.package?.bonusSc}</td>
                                    <td>{user?.promocodeBonus}</td>
                                    <td>{user?.promocodeUseCount}</td>
                                </tr>
                            ))}
                            {(packageData?.userDetails?.length === 0) && (
                                <tr>
                                    <td className='text-danger text-center' colSpan={10}>No Data Available</td>
                                </tr>
                            )}

                        </tbody>
                    </Table>
                </div>
                {packageData?.count !== 0 && (
                    <PaginationComponent
                        page={packageData?.count < pageNo ? setPageNo(1) : pageNo}
                        totalPages={totalPages}
                        setPage={setPageNo}
                        limit={limit}
                        setLimit={setLimit}
                    />
                )}
            </Row>
        </div>
    );
};

export default ViewPackages;

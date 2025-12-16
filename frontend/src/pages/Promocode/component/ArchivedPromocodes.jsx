import React, { useEffect } from 'react'
import {
    Button,
    Row,
    Col,
    Table,
    Form,
} from "@themesberg/react-bootstrap";
import { archivedTableHeaders, STATUS_LABELS } from "../constant";
import { getDateTime } from "../../../utils/dateFormatter";
import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown, faArrowAltCircleUp, faEye } from "@fortawesome/free-regular-svg-icons";
import { AdminRoutes } from "../../../routes";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../../components/Pagination";
import { InlineLoader } from "../../../components/Preloader";
import { searchRegEx } from "../../../utils/helper";
// import useCheckPermission from "../../../utils/checkPermission";
import usePromoCodeListing from '../hooks/usePromoCodeListing';

const ArchivedPromocodes = () => {
    const navigate = useNavigate()
    const { 
        loading,
        promoCodeList,
        limit,
        setLimit,
        // show,
        page,
        setPage,
        // orderBy,
        setOrderBy,
        sort,
        setSort,
        // promocodeId,
        // setPromocodeId,
        search, setSearch,
        selected,
        over, setOver,
        totalPages,
        // isArchive, 
        setIsArchive
    } = usePromoCodeListing()
    // const { isHidden } = useCheckPermission()

    useEffect(()=> {
        setIsArchive(true)
    }, [])

    return (
        <>
            <Row className="mb-2">
                <Col>
                    <h3>Archived Promocodes</h3>
                </Col>
                <Row className="mb-2">
                    <Col xs={12} md={6} lg={6}>
                        <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
                            Search
                        </Form.Label>
                        <Form.Control
                            type='search'
                            placeholder='Search Promocode'
                            value={search}
                            style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                            onChange={(event) => {
                                setPage(1)
                                const mySearch = event.target.value.replace(searchRegEx, '')
                                setSearch(mySearch)
                            }}
                        />
                    </Col>
                </Row>
            </Row>
            <Table
                bordered
                striped
                responsive
                hover
                size="sm"
                className="text-center mt-4"
            >
                <thead className="thead-dark">
                    <tr>
                        {archivedTableHeaders.map((h, idx) => (
                            <th
                                key={idx}
                                onClick={() => h.value !== "" && setOrderBy(h.value)}
                                style={{
                                    cursor: "pointer",
                                }}
                                className={selected(h) ? "border-3 border border-blue" : ""}
                            >
                                {h.labelKey}{" "}
                                {selected(h) &&
                                    (sort === "ASC" ? (
                                        <FontAwesomeIcon
                                            style={over ? { color: "red" } : {}}
                                            icon={faArrowAltCircleUp}
                                            onClick={() => setSort("DESC")}
                                            onMouseOver={() => setOver(true)}
                                            onMouseLeave={() => setOver(false)}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            style={over ? { color: "red" } : {}}
                                            icon={faArrowAltCircleDown}
                                            onClick={() => setSort("ASC")}
                                            onMouseOver={() => setOver(true)}
                                            onMouseLeave={() => setOver(false)}
                                        />
                                    ))}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={10} className="text-center">
                                <InlineLoader />
                            </td>
                        </tr>
                    ) : promoCodeList?.promocodeDetail?.count > 0 ? (
                        promoCodeList.promocodeDetail.rows.map(
                            ({
                                promocodeId,
                                promocode,
                                discountPercentage,
                                perUserLimit,
                                maxUsersAvailed,
                                isDiscountOnAmount,
                                validFrom,
                                validTill,
                                maxUsersAvailedCount,
                                status,
                            }) => (
                                <tr key={promocodeId}>
                                    <td>{promocodeId}</td>
                                    <td>{promocode}</td>
                                    <td>{discountPercentage} {isDiscountOnAmount ? "% Discount" : "% Bonus"}</td>
                                    <td>{perUserLimit}</td>
                                    <td>{maxUsersAvailed === null ? "-" : maxUsersAvailed}</td>
                                    <td>{maxUsersAvailedCount}</td>
                                    {/* <td>
                                        {isActive ? (
                                            <span className="text-success">
                                                {t("Active")}
                                            </span>
                                        ) : (
                                            <span className="text-danger">
                                                {t("Inactive")}
                                            </span>
                                        )}</td> */}
                                        <td>{STATUS_LABELS[status] || '-'}</td>
                                    {/* <td>{formatDateMDY(createdAt)}</td> */}
                                    <td>{validFrom === null ? "-" : getDateTime(validFrom)}</td>
                                    <td>{validTill === null ? "-" : getDateTime(validTill)}</td>
                                    <td>
                                        <Trigger message={"View"} id={promocodeId + "view"} />
                                        <Button
                                            id={promocodeId + "view"}
                                            className="m-1"
                                            size="sm"
                                            variant="info"
                                            onClick={() =>
                                                navigate(
                                                    `${AdminRoutes.ArchivedPromoCodeView.split(":").shift()}${promocodeId}`
                                                )
                                            }
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="text-danger text-center">
                                No Data Found
                            </td>
                        </tr>
                    )
                    }
                </tbody>

            </Table>
            {promoCodeList?.promocodeDetail?.count !== 0 && (
                <PaginationComponent
                    page={promoCodeList?.count < page ? setPage(1) : page}
                    totalPages={totalPages}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            )}
        </>
    )
}

export default ArchivedPromocodes
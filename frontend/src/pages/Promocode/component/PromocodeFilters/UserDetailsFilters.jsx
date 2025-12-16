import React, { useState } from "react";
import { Col, Row, Form as BForm, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faFileDownload } from '@fortawesome/free-solid-svg-icons'
import Trigger from "../../../../components/OverlayTrigger";
import { onDownloadCsvClick } from "../../../../utils/helper";

const UserDetailsFilters = ({
    setPage,
    packageIdSearch,
    setPackageIdSearch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    getCsvDownloadUrl,
    promocodeHistory,
    setLimit
}) => {

    const [error, setError] = useState('')
    const [downloadInProgress, setDownloadInProgress] = useState(false);

    const resetFilters = () => {
        setPage(1);
        setLimit(15)
        setPackageIdSearch('')
        setSearch('')
        setStatusFilter('all')
        setError('')
    }

    const handleDownloadClick = async () => {
        try {
            const filename = "Promocode_Applied_History";
            setDownloadInProgress(true);
            const url = getCsvDownloadUrl();
            await onDownloadCsvClick(url, filename);
        } catch (error) {
            console.error("Error downloading CSV:", error);
        } finally {
            setDownloadInProgress(false);
        }
    };

    return (
        <Row>
            <Col xs={3} className="mb-3">
                <BForm.Label>
                    Package Id
                </BForm.Label>

                <BForm.Control
                    type='search'
                    placeholder='Search By Package Id'
                    value={packageIdSearch}
                    // style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                    onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            if (inputValue.length <= 10) {
                                setPage(1);
                                setPackageIdSearch(inputValue);
                                setError('')
                            } else {
                                setError('Package Id cannot exceed 10 digits')
                            }
                        }
                    }}
                />
                {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
            </Col>

            <Col xs={3} className="mb-3">
                <BForm.Label>
                    Search By Username, User Id, Email
                </BForm.Label>

                <BForm.Control
                    type='search'
                    placeholder='Search...'
                    value={search}
                    onChange={(event) => {
                        setPage(1)
                        setSearch(event?.target?.value)
                    }}
                />
            </Col>

            <Col xs={3} className="mb-3">
                <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                    <BForm.Label>
                        Status
                    </BForm.Label>

                    <BForm.Select
                        onChange={(e) => {
                            setPage(1)
                            setStatusFilter(e?.target?.value)
                        }}
                        value={statusFilter}
                    // style={{ minWidth: '230px' }}
                    >
                        <option value='all'>All</option>
                        <option value='true'>Active</option>
                        <option value='false'>In-Active</option>
                    </BForm.Select>
                </div>
            </Col>

            <Col xs={3} style={{ marginTop: "30px" }}>
                <Trigger message='Reset Filters' id={'redo'} />
                <Button
                    id={'redo'}
                    variant='success'
                    onClick={resetFilters}
                >
                    <FontAwesomeIcon icon={faRedoAlt} />
                </Button>

                <Trigger message="CSV Download" id={"csv"} />
                <Button
                    id={"csv"}
                    variant="success"
                    disabled={promocodeHistory?.appliedDetails?.count === 0 || downloadInProgress}
                    onClick={handleDownloadClick}
                    className="ms-2"
                >
                    {downloadInProgress ? (
                        <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    ) : (
                        <FontAwesomeIcon icon={faFileDownload} />
                    )}
                </Button>
            </Col>

        </Row>
    )
}

export default UserDetailsFilters
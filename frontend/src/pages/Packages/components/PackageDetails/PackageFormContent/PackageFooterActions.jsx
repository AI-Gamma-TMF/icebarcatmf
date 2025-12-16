import React, { useRef, useState } from 'react';
import {
    Button,
    Row,
    Col,
    Spinner
} from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import Trigger from '../../../../../components/OverlayTrigger';
import { AdminRoutes } from '../../../../../routes';
import { onDownloadCsvDirectClick } from '../../../../../utils/helper';

const PackageFooterActions = ({ values, handleImportChange, packageData,
    handleSubmit, loading, t, navigate
}) => {

    const [downloadInProgress, setDownloadInProgress] = useState(false);
    const fileInputRef = useRef(null);

    const handleReplaceCsvClick = () => {
        fileInputRef.current.click();
    };


    const getCsvDownloadUrl = () => {
        const url = `${process.env.REACT_APP_API_URL}/api/v1/package/detail/${packageData?.packageId}?&csvDownload=true`;
        return url;
    };

    const handleDownloadClick = async () => {
        try {
            const filename = `user_packages`;
            setDownloadInProgress(true);
            const url = getCsvDownloadUrl();
            await onDownloadCsvDirectClick(url, filename);
        } catch (error) {
            console.error('Error downloading CSV:', error);
        } finally {
            setDownloadInProgress(false);
        }
    };

    return (
        <>
            <Row>
                {!values?.welcomePurchaseBonusApplicable && (
                    <Col className='mt-3 mb-2 d-flex align-items-center'>
                        <Trigger message='Import .csv with column title email and email ids are mandatory.' id={'csvFileInput'} />
                        <Button
                            variant='secondary'
                            className='ml-4 me-4'
                            onClick={handleReplaceCsvClick}
                            type='button'
                            id={'csvFileInput'}
                        >
                            Import User CSV
                        </Button>
                        <input
                            type='file'
                            accept='.csv'
                            ref={fileInputRef}
                            onChange={handleImportChange}
                            style={{ display: 'none' }} // Hide the file input
                        />

                        <>
                            {packageData?.userDetails && packageData?.userDetails?.length > 0 && (
                                <>
                                    <Trigger message='Download only email IDs as a CSV ' id={'csv'} />
                                    <Button
                                        id={'csv'}
                                        variant='success'
                                        disabled={packageData?.userDetails?.length === 0}
                                        onClick={handleDownloadClick}
                                    >
                                        {downloadInProgress ? (
                                            <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                                        ) : (
                                            <FontAwesomeIcon icon={faFileDownload} />
                                        )}
                                    </Button>
                                </>
                            )}
                        </>
                    </Col>
                )}

                <Col className='mt-3 mb-2 d-flex align-items-center' style={{ justifyContent: 'flex-end' }}>
                    <Button onClick={() => navigate(AdminRoutes?.Packages)} className='m-2 text-dark'
                        style={{ backgroundColor: '#d3d3d3', borderColor: '#d3d3d3' }}>
                        {t('createPackage.cancelButton')}
                    </Button>

                    <Button onClick={handleSubmit} className='ml-4 btn btn-primary' disabled={loading}>
                        {loading ? (
                            <Spinner as='span' animation='border' role='status' aria-hidden='true' />
                        ) : (
                            <>{t('createPackage.submitButton')}</>
                        )}
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default PackageFooterActions;

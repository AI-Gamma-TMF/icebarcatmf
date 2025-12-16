import React from 'react';
import { serialize } from 'object-to-formdata';
import { Modal, Button, Row, Col, Image } from '@themesberg/react-bootstrap';
import { getDateTimeByYMD } from '../../../utils/dateFormatter';
import './PackageOverwritePrompt.scss';

const PackageOverwritePrompt = ({
    show,
    onClose,
    existingPackageData,
    overwriteFormValues,
    setOverwriteFormValues,
    isEdit,
    editPackage,
    createPackage,
    createLadderPackage,
    isReuse,
    handleReusePackageYes
}) => {
    const handleOverwrite = () => {
        onClose();
        if (overwriteFormValues) {
            const updatedValues = {
                ...overwriteFormValues,
                overwriteSpecialPackage: true,
            };
            const payload = serialize(updatedValues);

            if (isEdit) {
                editPackage(payload);
            } if (isReuse) {
                handleReusePackageYes(payload)
            } else {
                if (overwriteFormValues.isLadderPackage) {
                    createLadderPackage(payload);
                } else {
                    createPackage(payload);
                }
            }
        }
    };

    const handleCancel = () => {
        onClose();
        setOverwriteFormValues();
    };

    const data = existingPackageData?.data;

    return (
        <Modal show={show} onHide={onClose} centered dialogClassName="overwrite-modal">
            <Modal.Header closeButton className="overwrite-header">
                <Modal.Title className="overwrite-title">Overwrite Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="overwrite-body">
                <p className="overwrite-message">
                    {existingPackageData?.message}
                </p>
                <Row className="align-items-start">
                    <Col md={4}>
                        {data?.imageUrl && (
                            <Image
                                src={data.imageUrl}
                                alt="Package Image"
                                fluid
                                rounded
                                className="overwrite-image"
                            />
                        )}
                    </Col>
                    <Col md={8}>
                        <ul className="overwrite-list">
                            <li><strong>Package ID:</strong> {data?.packageId}</li>
                            <li><strong>Package Name:</strong> {data?.packageName}</li>
                            <li><strong>Amount:</strong> {data?.amount}</li>
                            <li><strong>Valid From:</strong> {getDateTimeByYMD(data?.validFrom)}</li>
                            <li><strong>Valid Till:</strong> {getDateTimeByYMD(data?.validTill)}</li>
                        </ul>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="overwrite-footer">
                <Button variant="light" className="overwrite-cancel" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="danger" className="overwrite-confirm" onClick={handleOverwrite}>
                    Overwrite
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PackageOverwritePrompt;

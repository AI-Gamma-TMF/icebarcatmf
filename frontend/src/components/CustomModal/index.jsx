import React from "react";
import {
    Col,
    Row,
    Button,
    Modal,
} from "@themesberg/react-bootstrap";


const CustomModal = ({ handleClose, showModal,handleSubmit,TextMessage,btnMsg,HeaderMsg,disabled=false}) => {

    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            backdrop='static'
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{HeaderMsg}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='mt-3'>
                    <Col sm={12} className='my-2'>
                        {TextMessage}
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSubmit} disabled={disabled}>{btnMsg}</Button>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            </Modal.Footer>

        </Modal>
    );
};

export default CustomModal;

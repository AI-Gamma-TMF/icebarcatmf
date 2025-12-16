import React from 'react'
import { Button, Modal , Spinner } from '@themesberg/react-bootstrap'
import './modalStyle.scss'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCheckSquare , faWindowClose} from '@fortawesome/free-solid-svg-icons'

const ImportCsvModal = ({ show, setShow, handleYes, loading, importedFile, importAction, setImportAction }) => {
    const { t } = useTranslation(['translation'])

    const handleSwitchChange = () => {
        setImportAction(!importAction)
    }

    return (
        <Modal 
            show={show} 
            onHide={() => {
                setShow(false)
                //setImportedFile(null)
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('Confirm Import Action')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center align-items-center mb-2">
                    <label>{`Filename : ${importedFile.name || ''}`}</label>
                </div>
                {/* <div className="d-flex justify-content-center align-items-center">
                    <label className="me-2">{t(`Unblock Players`)}</label>
                    <Form>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            checked={importAction}
                            onChange={handleSwitchChange}
                        />
                    </Form>
                    <label className="ms-2">{t(`Block Players`)}</label>
                </div> */}
                <div className="d-flex justify-content-center align-items-center">
                    {/* Left Label */}
                    <label className="me-3">Unblock Players</label>

                    {/* Custom Switch */}
                    <div
                        className="form-check form-switch d-flex align-items-center p-0"
                        style={{ cursor: "pointer" }}
                    >
                        <input
                            className="form-check-input custom-switch-input"
                            type="checkbox"
                            role="switch"
                            id="icon-switch"
                            style={{ display: "none" }} // Hide default checkbox
                            checked={importAction}
                            onChange={handleSwitchChange}
                        />

                        {/* Styled Switch Replacement */}
                        <label
                            htmlFor="icon-switch"
                            className="custom-switch-label d-flex justify-content-center align-items-center"
                            style={{
                                width: "60px",
                                height: "30px",
                                borderRadius: "15px",
                                backgroundColor: importAction ? "#dc3545" : "#28a745", // Red when on, green when off
                                position: "relative",
                                transition: "background-color 0.3s",
                            }}
                        >
                            {/* Switch Circle and Icon */}
                            <span
                                className="custom-switch-circle d-flex justify-content-center align-items-center"
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    left: importAction ? "32px" : "2px",
                                    width: "26px",
                                    height: "26px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
                                    transition: "left 0.3s",
                                }}
                            >
                                {/* Font Awesome Icon */}
                                <FontAwesomeIcon
                                    icon={importAction ? faWindowClose : faCheckSquare}
                                    style={{ color: importAction ? "red" : "green", fontSize: "1rem" }}
                                />
                            </span>
                        </label>
                    </div>

                    {/* Right Label */}
                    <label className="ms-3">Block Players</label>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant='secondary' onClick={handleYes} disabled={loading}>
                    {t('confirmationModal.yes')}
                    {
                        loading && <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    }
                </Button>

                <Button 
                    variant='primary' 
                    onClick={() => {
                        setShow(false)
                        //setImportedFile(null)
                    }
                }>
                    {t('confirmationModal.no')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ImportCsvModal
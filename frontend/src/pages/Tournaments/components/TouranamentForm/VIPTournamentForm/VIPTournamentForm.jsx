import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    Col,
    Row,
    Form as BForm,
    Button
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";
import AddVIPTournament from './AddVIPTournament';
import ImportCsvTournamentModal from './ImportCsvTournamentModal';
import { errorHandler, useUploadCsvTournamentMutation } from '../../../../../reactQuery/hooks/customMutationHook';
import { toast } from '../../../../../components/Toast';

const VIPTournamentForm = ({
    values,
    setFieldValue,
    handleBlur,
    handleChange,
    type,
    tournamentData,
    details,
    // refetchTournament,
    // loading
}) => {
    const queryClient = useQueryClient();
    const [importedFile, setImportedFile] = useState(null);
    const [importModalShow, setImportModalShow] = useState(false);
    const fileTournamentInputRef = useRef(null);

    const handleImportChange = (e) => {
        const file = e.target.files[0];
        setImportedFile(file);
        if (file) {
            setImportModalShow(true);
        }
        e.target.value = null;
    };

    const handleImportClick = () => {
        fileTournamentInputRef.current.click();
    };

    const { data: csvData, mutate: uploadCSV, isLoading: uploadCSVLoading } =
        useUploadCsvTournamentMutation({
            onSuccess: ({ data }) => {
                toast(data?.message, "success");
                queryClient.invalidateQueries({
                    queryKey: ["tournamentId"],
                });
                setImportModalShow(false);
            },
            onError: (error) => {
                errorHandler(error);
                setImportModalShow(false);
            },
        });

    const handleCSVSumbit = () => {
        const formData = new FormData();
        formData.append("file", importedFile);
        formData.append("vipTournament", true);
        uploadCSV(formData, { vipTournament: true });
    };

    const handleVIPToggle = (e) => {
        const checked = e.target.checked;
        setFieldValue("vipTournament", checked);
        if (checked) {
            setFieldValue("isSubscriberOnly", false);
        }
    };

    const handleSubscriptionToggle = (e) => {
        const checked = e.target.checked;
        setFieldValue("isSubscriberOnly", checked);
        if (checked) {
            setFieldValue("vipTournament", false);
        }
    };

    return (
        <Row className="mt-0">
            {/* VIP Tournament Toggle */}
            <Col md={6} sm={6} className="d-flex mt-3 align-items-center">
                <BForm.Label className="me-3">VIP Tournament</BForm.Label>
                <BForm.Check
                    type="switch"
                    name="vipTournament"
                    checked={values?.vipTournament}
                    onChange={handleVIPToggle}
                    onBlur={handleBlur}
                    disabled={details || values?.isSubscriberOnly}
                />
            </Col>

            {/* isSubscriberOnly Toggle */}
            <Col md={6} sm={6} className="d-flex mt-3 align-items-center">
                <BForm.Label className="me-3">Subscriber Only</BForm.Label>
                <BForm.Check
                    type="switch"
                    name="isSubscriberOnly"
                    checked={values?.isSubscriberOnly}
                    onChange={handleSubscriptionToggle}
                    onBlur={handleBlur}
                    disabled={details || values?.vipTournament}
                />
            </Col>

            {/* Import CSV */}
            <Col sm={12} className="d-flex flex-column align-items-end">
                {!details && (
                    <>
                        <Button
                            variant="secondary"
                            style={{ marginLeft: '10px' }}
                            onClick={handleImportClick}
                            type="button"
                            disabled={!values?.vipTournament}
                        >
                            Import CSV
                        </Button>

                        {!values?.vipTournament && (
                            <div className="mt-2 text-warning">
                                You need to enable the VIP Tournament before importing CSV.
                            </div>
                        )}

                        <input
                            type="file"
                            accept=".csv"
                            ref={fileTournamentInputRef}
                            onChange={handleImportChange}
                            style={{ display: "none" }}
                        />
                    </>
                )}
            </Col>

            {/* Modal */}
            {importModalShow && (
                <ImportCsvTournamentModal
                    setShow={setImportModalShow}
                    show={importModalShow}
                    handleYes={handleCSVSumbit}
                    loading={uploadCSVLoading}
                    importedFile={importedFile}
                />
            )}

            {/* VIP Title */}
            {values?.vipTournament && (
                <Row>
                    <Col xs={8} className="mb-3">
                        <BForm.Label style={{ marginBottom: 0, marginRight: "15px", marginTop: "5px" }}>
                            VIP Tournament Title
                        </BForm.Label>
                        <BForm.Control
                            type="text"
                            value={values?.vipTournamentTitle || ""}
                            name="vipTournamentTitle"
                            placeholder="Enter VIP Tournament Title"
                            onChange={(e) => setFieldValue("vipTournamentTitle", e.target.value)}
                            onBlur={handleBlur}
                            disabled={details}
                        />
                        <ErrorMessage name="vipTournamentTitle" component="div" className="text-danger mt-1" />
                    </Col>
                </Row>
            )}

            {/* Add VIP Users */}
            {values?.vipTournament && (
                <Row className="mt-0">
                    <AddVIPTournament
                        tournamentData={tournamentData}
                        isViewMode={details}
                        selectedUser={values?.allowedUsers}
                        setSelectedUser={(selectedUser) => {
                            setFieldValue("allowedUsers", selectedUser || []);
                        }}
                        type={type}
                        disabled={details}
                        setFieldValue={setFieldValue}
                        csvData={csvData}
                    />
                </Row>
            )}

            <ErrorMessage component="div" name="allowedUsers" className="text-danger" />
        </Row>
    );
};

export default VIPTournamentForm;

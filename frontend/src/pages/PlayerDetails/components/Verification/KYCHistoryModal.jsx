import React from "react";
import moment from 'moment-timezone'
import {
    Col,
    Row,
    Modal,
    Table,
} from "@themesberg/react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getKYCHistory } from "../../../../utils/apiCalls";
import { commonDateTimeFormat } from "../../../../utils/helper";
import { InlineLoader } from "../../../../components/Preloader";

const KYCHistoryModal = ({ handleClose, showModal, userId }) => {

    const { data, isLoading: loading } = useQuery({
        queryKey: ['kycHistory', userId],
        queryFn: ({ queryKey }) => {
            const params = { userId: queryKey[1] };
            return getKYCHistory(params)
        },
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        select: (res) => res?.data?.userKycHistory,
        refetchOnWindowFocus: false
    })


    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            backdrop='static'
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>User KYC History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='mt-3'>
                    <Col sm={12} className='my-2'>
                        <Table bordered striped responsive hover size='sm' className='text-center mt-4' style={{ marginBottom: '55px' }}>
                            <thead className='thead-dark'>
                                <tr >
                                    <th> Initial Level</th>
                                    <th> Changed Level</th>
                                    <th> Action Performed On</th>
                                </tr>
                            </thead>

                            <tbody>
                                {Boolean(data) &&
                                    data?.rows?.map(
                                        (record, index) => {
                                            const { originalValue, changedValue, createdAt } = record;
                                            return (
                                                <tr key={index}>
                                                    <td>{originalValue}</td>
                                                    <td>{changedValue}</td>
                                                    <td>{moment(createdAt).format(commonDateTimeFormat.dateWithTime)}</td>
                                                </tr>
                                            )
                                        }
                                    )}
                                {data?.count === 0 && (
                                    <tr>
                                        <td colSpan={12} className='text-danger text-center'>
                                            No Data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        {loading && <InlineLoader />}
                    </Col>

                </Row>

            </Modal.Body>


        </Modal>
    );
};

export default KYCHistoryModal;

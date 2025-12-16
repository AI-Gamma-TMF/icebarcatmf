import React from 'react';
import {
    Table
} from '@themesberg/react-bootstrap';
import { InlineLoader } from '../../../../../components/Preloader';

const PackageCSVUserTable = ({ uploadCSVLoading, csvPlayerData }) => {
    return (
        <>
            <p>
                <b>Note: </b>{' '}
                <span style={{ color: 'red' }}>
                    To retain existing user records, download the CSV, add user email IDs, and re-import it.
                </span>
            </p>
            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                <thead className='thead-dark'>
                    <tr>
                        {['USER ID', 'USERNAME', ' EMAIL ID', 'IS ACTIVE'].map((h) => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                {uploadCSVLoading ? (
                    <tr>
                        <td colSpan={10} className='text-center'>
                            <InlineLoader />
                        </td>
                    </tr>
                ) : (
                    <tbody>
                        {csvPlayerData?.map((user, _index) => {
                            return (
                                <tr key={user?.userId}>
                                    <td>{user?.userId}</td>
                                    <td>{user?.username || 'NA'}</td>
                                    <td>{user?.email}</td>
                                    <td>{user?.isActive ? 'Yes' : 'No'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                )}
            </Table>
        </>
    );
};

export default PackageCSVUserTable;

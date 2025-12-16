import React from 'react';
import { ConfirmationModal, DeleteConfirmationModal } from '../../../../../components/ConfirmationModal';
import ImportPackageCsvModal from './ImportedPackageCsvModal';

const PackageActionModals = ({ deleteModalShow, setDeleteModalShow, handleDeleteYes, deleteftploading,
    setShow, show, handleYes, active, statusFtploading, importModalShow, setImportModalShow, uploadCSVLoading, handleCSVSumbit, importedFile
}) => {
    return (
        <>
            {deleteModalShow && (
                <DeleteConfirmationModal
                    deleteModalShow={deleteModalShow}
                    setDeleteModalShow={setDeleteModalShow}
                    handleDeleteYes={handleDeleteYes}
                    loading={deleteftploading}
                />
            )}
            {show && (
                <ConfirmationModal
                    setShow={setShow}
                    show={show}
                    handleYes={handleYes}
                    active={active}
                    loading={statusFtploading}
                />
            )}

            {importModalShow && (
                <ImportPackageCsvModal
                    setShow={setImportModalShow}
                    show={importModalShow}
                    handleYes={handleCSVSumbit}
                    loading={uploadCSVLoading}
                    importedFile={importedFile}
                />
            )}
        </>
    );
};

export default PackageActionModals;

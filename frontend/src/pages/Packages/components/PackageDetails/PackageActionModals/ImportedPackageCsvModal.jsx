import React from 'react';
import { Button, Modal , Spinner } from '@themesberg/react-bootstrap';
import { useTranslation } from 'react-i18next';

const ImportPackageCsvModal = ({ show, setShow, handleYes, loading, importedFile }) => {
  const { t } = useTranslation(['translation']);
  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('Confirm Import Action')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex justify-content-center align-items-center mb-2'>
          <label>{`Filename : ${importedFile.name || ''}`}</label>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <h5>Do you want to import file</h5>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={handleYes} disabled={loading}>
          {t('confirmationModal.yes')}
          {loading && <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />}
        </Button>

        <Button
          variant='primary'
          onClick={() => {
            setShow(false);
          }}
        >
          {t('confirmationModal.no')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportPackageCsvModal;

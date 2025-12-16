import React from 'react'
import { Button, Modal , Spinner} from '@themesberg/react-bootstrap'
import './modalStyle.scss'
import { useTranslation } from 'react-i18next'

export const PromocodeBlockModal = ({ show, setShow, handleYes, active, loading, modalText }) => {
  const { t } = useTranslation(['translation'])

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t('confirmationModal.areYouSure')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{active !== true ? t(`Block Promocodes for ${modalText}`) : t(`Unblock Promocodes for ${modalText}`) }</Modal.Body>

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

        <Button variant='primary' onClick={() => setShow(false)}>
          {t('confirmationModal.no')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
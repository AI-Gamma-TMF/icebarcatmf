import React from 'react'
import { Button, Row, Col, Form } from '@themesberg/react-bootstrap'

import ProvidersList from '../ProvidersList'
import { useTranslation } from 'react-i18next'

const AddRestrictedProviders = ({
  unRestrictedItems,
  limit,
  page,
  setLimit,
  setPage,
  totalPages,
  addProvider,
  selectedProviders,
  removeProvider,
  addRestrictedProvider
}) => {
  const { t } = useTranslation(['countries'])

  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Label>
            <h5>{t('restrictedProvider.addProviderMessage')}</h5>
          </Form.Label>
        </Col>

        <Col className='text-right'>
          <Button
            variant='success'
            className='f-right'
            disabled={selectedProviders.count === 0}
            onClick={addRestrictedProvider}
          >
            {t('restrictedProvider.submit')}
          </Button>
        </Col>
      </Row>

      <ProvidersList
        disablePagination
        provider={selectedProviders}
        hasActions
        hasRemoveGamesAction
        removeProvider={removeProvider}
      />

      <Row className='mt-3'>
        <Col xs={4}>
          <Form.Label>
            <h5>{t('restrictedProvider.unRestrictedProviders')}</h5>
          </Form.Label>
        </Col>
      </Row>

      <ProvidersList
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        provider={unRestrictedItems}
        totalPages={totalPages}
        hasActions
        hasAddGamesAction
        addProvider={addProvider}
      />
    </>
  )
}

export default AddRestrictedProviders

import React from 'react'
import { Button, Row, Col, Form, Spinner } from '@themesberg/react-bootstrap'

import GamesList from '../GamesList'
import { useTranslation } from 'react-i18next'

const AddRestrictedGames = ({
  loading,
  unRestrictedItems,
  limit,
  page,
  setLimit,
  setPage,
  totalPages,
  addGame,
  selectedGames,
  removeGame,
  addRestrictedGames
}) => {
  const { t } = useTranslation(['countries'])

  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Label>
            <h5>{t('restrictedGame.addGameMessage')}</h5>
          </Form.Label>
        </Col>

        <Col className='text-right'>
          <Button
            variant='success'
            className='f-right'
            disabled={selectedGames.count === 0}
            onClick={addRestrictedGames}
          >
            {t('restrictedProvider.submit')}
            {loading && 
                          <Spinner
                            style={{marginLeft: '4px'}}
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        }
          </Button>
        </Col>
      </Row>

      <GamesList
        disablePagination
        games={selectedGames}
        hasActions
        hasRemoveGamesAction
        removeGame={removeGame}
      />

      <Row className='mt-3'>
        <Col xs={4}>
          <Form.Label>
            <h5>{t('restrictedGame.unrestrictedGames')}</h5>
          </Form.Label>
        </Col>
      </Row>

      <GamesList
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        games={unRestrictedItems}
        totalPages={totalPages}
        hasActions
        hasAddGamesAction
        addGame={addGame}
      />
    </>
  )
}

export default AddRestrictedGames

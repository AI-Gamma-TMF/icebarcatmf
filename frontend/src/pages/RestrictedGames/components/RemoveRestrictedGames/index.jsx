import React from 'react'
import { Button, Row, Col, Form, Spinner } from '@themesberg/react-bootstrap'

import GamesList from '../GamesList'
import { useTranslation } from 'react-i18next'

const RemoveRestrictedGames = ({
  loading,
  restrictedItems,
  limit,
  page,
  setLimit,
  setPage,
  totalPages,
  addDeleteGame,
  removedGames,
  removeDeleteGame,
  removeRestrictedGame
}) => {
  const { t } = useTranslation(['countries'])

  return (
    <> 
      <Row>
        <Col xs={4}>
          <Form.Label>
            <h5>{t('restrictedGame.removeMessage')}</h5>
          </Form.Label>
        </Col>

        <Col className='text-right'>
          <Button
            variant='success'
            className='f-right'
            disabled={removedGames.count === 0}
            onClick={removeRestrictedGame}
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
        games={removedGames}
        hasActions
        hasRemoveGamesAction
        removeGame={removeDeleteGame}
      />

      <Row className='mt-3'>
        <Col xs={4}>
          <Form.Label>
            <h5>{t('restrictedGame.restrictedGames')}</h5>
          </Form.Label>
        </Col>
      </Row>

      <GamesList
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        games={restrictedItems}
        totalPages={totalPages}
        hasActions
        hasAddGamesAction
        addGame={addDeleteGame}
      />
    </>
  )
}

export default RemoveRestrictedGames

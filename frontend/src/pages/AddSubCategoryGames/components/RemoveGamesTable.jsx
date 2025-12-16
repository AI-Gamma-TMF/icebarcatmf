import React from 'react'
import {
  Button,
  Col,
  Table,
  ButtonGroup,
  Form,
  Row,Spinner
} from '@themesberg/react-bootstrap'

import Trigger from '../../../components/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMinusSquare
} from '@fortawesome/free-solid-svg-icons'

const RemoveGamesTable = ({ t, removeGamesToSubCategory, selectedGames, removeGame ,loading}) => {
  return (
    <>
      <Row>
        <Col>
        <Form.Label>
          <h5>{t('casinoGames.addGames.gameRemoveTitle')}</h5>
        </Form.Label>
        </Col>
        <Col className='text-right mb-2'>
          <Button
            variant='success'
            size='sm'
            disabled={selectedGames?.length === 0 || loading}
            onClick={removeGamesToSubCategory}

          >
            {t('casinoGames.addGames.createButton')}{loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        </Col>
      </Row>

      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {[
              // t('casinoGames.addGames.headers.id'),
              t('casinoGames.addGames.headers.name'),
              t('casinoGames.addGames.headers.actions')
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {selectedGames?.length > 0 &&
                    selectedGames.map(
                      ({
                        masterCasinoGameId,
                        name
                      }) => {
                        return (
                          <tr key={masterCasinoGameId}>

                            {/* <td>{masterCasinoGameId}</td> */}

                            <td>
                              <Trigger message={name} id={masterCasinoGameId +'name'} />
                                <span
                                id={masterCasinoGameId +'name'}
                                  style={{
                                    width: '300px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {name}
                                </span>
                            </td>

                            <td>
                              <ButtonGroup>
                                <Trigger message='Remove this Game' id={masterCasinoGameId +'remove'} />
                                  <Button
                                  id={masterCasinoGameId +'remove'}
                                    className='m-1'
                                    size='sm'
                                    variant='danger'
                                    onClick={() => removeGame(masterCasinoGameId)}
                                  >
                                    <FontAwesomeIcon icon={faMinusSquare} />
                                  </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        )
                      }
                    )}

          {selectedGames?.length === 0 &&
                      (
                        <tr>
                          <td
                            colSpan={3}
                            className='text-danger text-center'
                          >
                            {t('casinoGames.addGames.addGameMessage')}
                          </td>
                        </tr>
                      )}
        </tbody>
      </Table>
      <Row className='mt-4'>
        <Form.Label>
          <h5>{t('casinoGames.addGames.gameAddedTitle')}</h5>
        </Form.Label>
      </Row>
    </>
  )
}

export default RemoveGamesTable

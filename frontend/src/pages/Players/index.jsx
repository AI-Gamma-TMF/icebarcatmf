/*
Filename: Players/index.js
Description: View List of all users.
Author: uchouhan
Created at: 2023/03/03
Last Modified: 2023/03/30
Version: 0.1.0
*/
import React from 'react'
import { Row, Col, Card, } from '@themesberg/react-bootstrap'
import MultiFunctionalTable from '../../components/MultiFunctionTable'
import './players.scss'

const Players = () => {
  return (
    <>
      <div className='players-page dashboard-typography'>
        <Card className='p-2 mb-2 players-page__card'>
          <Row className='d-flex align-items-center mb-2'>
            <Col>
              <h3>Players</h3>
            </Col>
          </Row>
          <MultiFunctionalTable />
        </Card>
      </div>
    </>
  )
}
export default Players
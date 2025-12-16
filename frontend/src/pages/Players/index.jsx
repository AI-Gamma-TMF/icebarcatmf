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

const Players = () => {
  return (
    <>
      <Card className='p-2 mb-2'>
        <Row>
          <Col>
            <h3>Players</h3>
          </Col>
        </Row>
        <MultiFunctionalTable 
        />
      </Card>
    </>
  )
}
export default Players
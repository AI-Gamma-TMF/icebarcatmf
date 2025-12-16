import React from 'react'
import {
    Form,
    Row,
    Col
} from '@themesberg/react-bootstrap'
import { searchRegEx } from '../../../utils/helper'

const StaffFilter = ({ t, search, setSearch, setPage }) => {
    return (
        <Row>
            <Col xs={6}>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
                    {t('search')}
                </Form.Label>

                <Form.Control
                    type='search'
                    placeholder='Search by Email, Name, Group'
                    value={search}
                    style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
                    onChange={(event) => {
                        setPage(1)
                        const mySearch = event.target.value.replace(searchRegEx, '')
                        setSearch(mySearch)
                    }}
                />
            </Col>
        </Row>
    )
}

export default StaffFilter
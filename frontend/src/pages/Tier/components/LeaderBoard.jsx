import React from 'react'
import {
  Row,
  Col,
  Table,
  Form
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PaginationComponent from '../../../components/Pagination'
import Trigger from '../../../components/OverlayTrigger'
import { InlineLoader } from '../../../components/Preloader'
import { leaderTableHeaders } from '../constants'
import { useTranslation } from 'react-i18next'
import {
  faArrowCircleUp,
  faArrowCircleDown,
} from '@fortawesome/free-solid-svg-icons'
import useTierUserDetails from '../hooks/useTierUserDetails'
import { searchRegEx } from '../../../utils/helper'
const LeaderBoard = () => {
  // const { isHidden } = useCheckPermission()
  const { tierUserData,
    isUserDataLoading,
    sort,
    setSort,
    setOrderBy,
    setLimit,
    setPage,
    limit,
    page,
    over,
    setOver,
    selected,
    totalPages,
    search,
    setSearch
  } = useTierUserDetails()
  const { t } = useTranslation(['tier'])
  return (
    <>
      <Row>
        <Col xs={12}>
          <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
            Search
          </Form.Label>

          <Form.Control
            type='search'
            placeholder='Search by User Id or Username'
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

      <>
        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
          <thead className='thead-dark'>
            <tr>
              {leaderTableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== '' && setOrderBy(h.value)}
                  style={{
                    cursor: 'pointer'
                  }}
                  className={
                    selected(h)
                      ? 'border-3 border border-blue'
                      : ''
                  }
                >
                  {t(h.labelKey)}{' '}
                  {selected(h) &&
                    (sort === 'ASC'
                      ? (
                        <FontAwesomeIcon
                          style={over ? { color: 'red' } : {}}
                          icon={faArrowCircleUp}
                          onClick={() => setSort('DESC')}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      )
                      : (
                        <FontAwesomeIcon
                          style={over ? { color: 'red' } : {}}
                          icon={faArrowCircleDown}
                          onClick={() => setSort('ASC')}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      ))}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tierUserData?.count > 0 &&
              tierUserData?.rows?.map(
                ({
                  userId,
                  User,
                  level,
                  scSpend,
                  gcSpend,
                  requiredXp,
                  maxLevel,
                }) => {
                  return (
                    <tr key={userId}>
                      <td>{userId}</td>
                      <td>
                        <Trigger message={User.username} id={User.username} />
                        <span
                          id={User.username}
                          style={{
                            width: '100px',
                            cursor: 'pointer'
                          }}
                          className='d-inline-block text-truncate'
                        >
                          {User.username}
                        </span>
                      </td>

                      <td>{maxLevel}</td>

                      <td>
                        {level}
                      </td>
                      <td>
                        {requiredXp}
                      </td>

                      <td>
                        {scSpend}
                      </td>
                      <td>
                        {gcSpend}
                      </td>

                    </tr>
                  )
                }
              )}

            {tierUserData?.count === 0 &&
              (
                <tr>
                  <td
                    colSpan={7}
                    className='text-danger text-center'
                  >
                    {t('tournaments.noDataFound')}
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
        {isUserDataLoading && <InlineLoader />}
        {tierUserData?.count !== 0 &&
          (
            <PaginationComponent
              page={tierUserData?.count < page ? setPage(1) : page}
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          )}
      </>

    </>
  )
}

export default LeaderBoard
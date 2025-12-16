
import React from 'react'
import { Row, Col, Card, Table } from '@themesberg/react-bootstrap'
import usePlayerListing from './usePlayerListing'
import { tableHeaders } from './constants'
// import useCheckPermission from '../../../utils/checkPermission'
import { ConfirmationModal } from '../../ConfirmationModal'
import PlayerSearch from './PlayerSearch'
import { formatDateMDY } from '../../../utils/dateFormatter'


const AffiliatePlayersList = () => {
  const { t, selected, loading, sort, setStatusShow, statusShow, handleYes, status,
    setSort, playersData, setOrderBy, 
    globalSearch,
    setGlobalSearch,
    orderBy,
  } = usePlayerListing();
    
  // const { isHidden } = useCheckPermission();

  // const [selectedTab, setSelectedTab] = useState('playerSearch')

 const handlePlayerTableSorting =(param)=>{
    if(param.value===orderBy){
      setSort(sort==="asc" ? "desc" : "asc");
    }else{
      setOrderBy(param.value)
      setSort('asc');
    }
  }


  return (
    <>
      <Card className='p-2 mb-2'>
        <Row>
          <Col>
            <h3>{t('title')}</h3>
          </Col>
        </Row>
        <PlayerSearch
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />
        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
          <thead className='thead-dark'>
            <tr>
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== '' && handlePlayerTableSorting(h)}
                  style={{
                    cursor: 'pointer'
                  }}
                  className={
                      selected(h)
                        ? 'border-3 border border-blue'
                        : ''
                    }
                >
                  {h.labelKey}
                </th>
              ))}
            </tr>
          </thead>

         { !loading && <tbody>
              { playersData?.rows?.length>0 && playersData?.rows.map((player) => { return (
                    <tr key={player.userId}
                      >
                      <td>{player.userId}</td>
                      <td>{player.email}</td>
                      <td>{player.createdAt ? formatDateMDY(player.createdAt) : 'NA'}</td>
                      <td>{player.username || 'NA'}</td>
                      <td className='text-link' style={{cursor: 'pointer'}}>
                        {(player.firstName && player.lastName) ? `${player.firstName} ${player.lastName}` : 'NA'}
                      </td>
                      <td>
                        {player.isActive ? <span className='text-success'>{t('activeStatus')}</span> : <span className='text-danger'>{t('inActiveStatus')}</span>}
                      </td>
                     
                    </tr>
                  )})  
              }

              {playersData?.rows?.length === 0 && !loading &&
                <tr>
                  <td colSpan={6} className='text-danger text-center'>
                    No Data Found
                  </td>
                </tr>} 
            </tbody>} 
        </Table>

      </Card>
      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleYes}
        active={status}
      />
    </>
  )
}
export default AffiliatePlayersList
/*
Filename: Casino Game Search/index.js
Description: View casino search list.
Author: rkashyap2
Version: 0.1.0
*/
import React, { useState } from 'react'
import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { Row, Col } from '@themesberg/react-bootstrap'
import { CasinoGameSearchContainer } from './style'
import { useGetPlayerCasinoQuery } from '../../../../reactQuery/hooks/customQueryHook'
import CasinoSearchField from './CasinoSearchField'

const CasinoGameSearch = (props) => {
  const { user } = props
  const [state, setState] = useState({
    startDate: getDateDaysAgo(10),
    endDate: new Date(),
    key: 'selection'
  })
  const successToggler = () => {}
  const {
    data: casinoSearchData,
    isLoading: isLoadingCasino,
    refetch: refetchPlayerCasino
  } = useGetPlayerCasinoQuery({
    params:
    {
      userId: user.userId,
      startDate: formatDateYMD(state.startDate),
      endDate: formatDateYMD(state.endDate)
    },
    successToggler
  })
  const getCasinoData = () => {
    refetchPlayerCasino()
  }
  return (
    <CasinoGameSearchContainer>
      <Row>
        <Col className='casino-search-head-wrap'>
          <h3>Casino Games</h3>
        </Col>
      </Row>
      <CasinoSearchField
        state={state}
        setState={setState}
        casinoSearchData={casinoSearchData}
        // onChangeDate={onChangeDate}
        getCasinoData={getCasinoData}
        isLoading={isLoadingCasino}
      />
    </CasinoGameSearchContainer>
  )
}
export default CasinoGameSearch
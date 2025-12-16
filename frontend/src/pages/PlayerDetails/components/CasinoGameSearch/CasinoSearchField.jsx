import React, { useState } from 'react';
import DateRangePicker from '../../../../components/DateRangePicker';
import { Row, Col, Form as BForm, Button } from '@themesberg/react-bootstrap';
import { CasinoSearchFieldContainer } from './style';
import { timeZones } from '../../../Dashboard/constants';
import { convertTimeZone, getFormattedTimeZoneOffset } from '../../../../utils/helper';
import { getItem } from '../../../../utils/storageUtils';
import { getDateThreeMonthsBefore } from '../../../../utils/dateFormatter';
import { useUserStore } from '../../../../store/store';
// import { playerSearchSchmes } from './schemas'
// import { initialSet } from './constants'
const CasinoSearchField = (props) => {
  const {
    state,
    setState,
    casinoSearchData,
    // onChangeDate,
    getCasinoData,
    isLoading,
    // globalSearch,
    // setGlobalSearch
  } = props;
  const timeZone = getItem('timezone');
  const timezoneOffset =
    timeZone != null ? timeZones.find((x) => x.code === timeZone).value : getFormattedTimeZoneOffset();
  // const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x=> x.value === timezoneOffset)?.code);
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [startDate, _setStartDate] = useState(convertTimeZone(getDateThreeMonthsBefore(), timeZoneCode));
  const [endDate, _setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));

  // useEffect(() => {
  //   setTimeZoneCode(timeZones.find((x) => x.value === timezoneOffset)?.code);
  // }, [timezoneOffset]);

  const convToStr = (value) => {
    if (typeof value === 'number') {
      return value.toString();
    } else return value;
  };
  return (
    <CasinoSearchFieldContainer>
      <Row>
        <Col xs={12} md={6} lg={3}>
          <Row>
            <Col xs={12} className=''>
              <BForm.Group className='mb-3' controlId='idSearch'>
                <BForm.Label>
                  Date Range
                  <span className='text-danger'>*</span>
                </BForm.Label>
                <DateRangePicker
                  size
                  width='100%'
                  state={[state]}
                  setState={(data) => {
                    setState(data[0]);
                  }}
                  timeZoneCode={timezoneOffset}
                  startDate={startDate}
                  endDate={endDate}
                />
              </BForm.Group>
            </Col>
            <Col xs={12} className='casino-search-buttonwrap'>
              <Button variant='primary' type='button' disabled={isLoading} onClick={getCasinoData}>
                {isLoading ? 'Loading' : 'Search'}
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Row>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='total'>
                <BForm.Label>Total Purchase Amount </BForm.Label>
                <BForm.Control
                  type='text'
                  name='total'
                  placeholder='Total Purchase Amount'
                  value={convToStr(casinoSearchData?.totalPurchaseAmount) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>SC Credited Total</BForm.Label>
                <BForm.Control
                  type='text'
                  placeholder='SC Credited Total'
                  name='emailSearch'
                  value={convToStr(casinoSearchData?.scCreditedTotal) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>Redeeming Player</BForm.Label>
                <BForm.Control
                  type='text'
                  name='firstNameSearch'
                  placeholder='Redeeming Player'
                  value={convToStr(casinoSearchData?.redeemingPlayer) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>Manual Added SC</BForm.Label>
                <BForm.Control
                  type='text'
                  name='lastNameSearch'
                  placeholder='Manual Added SC'
                  value={convToStr(casinoSearchData?.manualAddedSc) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>Manual Deducted SC</BForm.Label>
                <BForm.Control
                  type='text'
                  name='lastNameSearch'
                  placeholder='Manual Deducted SC'
                  value={convToStr(casinoSearchData?.manualDeductedSc) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Row>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='idSearch'>
                <BForm.Label>Approved Redemption Total</BForm.Label>
                <BForm.Control
                  type='text'
                  name='idSearch'
                  placeholder='Approved Redemption Total'
                  value={convToStr(casinoSearchData?.approvedRedemptionTotal) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>SC Credited Purchase</BForm.Label>
                <BForm.Control
                  type='text'
                  placeholder='SC Credited Purchase'
                  name='emailSearch'
                  value={convToStr(casinoSearchData?.scCreditedPurchase) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>Paying Player</BForm.Label>
                <BForm.Control
                  type='text'
                  name='firstNameSearch'
                  placeholder='Paying Player'
                  value={convToStr(casinoSearchData?.playingPlayer) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>Manual Added GC</BForm.Label>
                <BForm.Control
                  type='text'
                  name='lastNameSearch'
                  placeholder='Manual Added GC'
                  value={convToStr(casinoSearchData?.manualAddedGc) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>Manual Deducted GC</BForm.Label>
                <BForm.Control
                  type='text'
                  name='lastNameSearch'
                  placeholder='Manual Deducted GC'
                  value={convToStr(casinoSearchData?.manualDeductedGc) || '-'}
                  disabled
                />
              </BForm.Group>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Row>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='idSearch'>
                <BForm.Label>SC Staked</BForm.Label>
                <BForm.Control
                  type='text'
                  name='idSearch'
                  placeholder='SC Staked'
                  value={convToStr(casinoSearchData?.scStacked) || '-'}
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>SC Wins</BForm.Label>
                <BForm.Control
                  type='text'
                  placeholder='SC Wins'
                  name='emailSearch'
                  value={convToStr(casinoSearchData?.scWins) || '-'}
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>Netgaming</BForm.Label>
                <BForm.Control
                  type='text'
                  name='firstNameSearch'
                  placeholder='Netgaming'
                  value={convToStr(casinoSearchData?.netGaming) || '-'}
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>GGR SC</BForm.Label>
                <BForm.Control
                  type='text'
                  name='lastNameSearch'
                  placeholder='GGR SC'
                  value={convToStr(casinoSearchData?.GgrSc) || '-'}
                />
              </BForm.Group>
            </Col>
            <Col xs={12}>
              <BForm.Group className='mb-3' controlId='formGroupEmail'>
                <BForm.Label>Round</BForm.Label>
                <BForm.Control
                  type='text'
                  name='lastNameSearch'
                  placeholder='Round'
                  value={convToStr(casinoSearchData?.rounds) || '-'}
                />
              </BForm.Group>
            </Col>
          </Row>
        </Col>
      </Row>
    </CasinoSearchFieldContainer>
  );
};

export default CasinoSearchField;

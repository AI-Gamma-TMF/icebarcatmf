import { Accordion, Col, Row, Table } from '@themesberg/react-bootstrap'
import '../playerdetails.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const WalletDetail = ({ user, accordionOpen, setAccordionOpen }) => {
    const { userWallet, UserReport } = user
    function formatNumber(coin) {
        if (typeof coin !== 'number') {
            return coin
        }
        const formattedNumber = coin.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
        return formattedNumber
    }
    // const {
    //     data: casinoSearchData,
    // } = useGetPlayerCasinoQuery({
    //     params:
    //     {
    //         userId: user.userId,
    //     },
    // })
    const convToStr = (value) => {
        if (typeof value === 'number') {
            return value.toFixed(2).toString()
        }
        else
            return Number(value).toFixed(2).toString()
    }
    return (

        <>
            <Row className='mt-4' onClick={() => setAccordionOpen(!accordionOpen)} style={{ cursor: 'pointer' }}>
                <h5 className='accordian-heading'>
                    <span>Wallet Details</span>
                    <span>{accordionOpen ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />} </span>
                </h5>
            </Row>

            <Accordion activeKey={accordionOpen ? '0' : ''}>
                <Accordion.Item eventKey="0">
                    <Accordion.Body>
                        <Row>
                            <Col>
                                <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                                    <thead className='thead-dark'>
                                        <tr>
                                            <th>GC Balance</th>
                                            <th>Redeemable SC Balance</th>
                                            <th>Remaining SC</th>
                                            <th>Remaining Bonus SC</th>
                                            <th>Total SC</th>
                                            <th>Total Purchase amount</th>
                                            <th>Vault GC Balance</th>
                                            <th>Redeemable Vault SC Balance</th>
                                            <th>Remaining Vault SC</th>
                                            <th>Remaining Vault Bonus SC</th>
                                            <th>Pending Redemption Amount</th>
                                            <th>Total redemption amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{userWallet?.gcCoin}</td>
                                            <td>{formatNumber(userWallet?.scCoin.wsc)}</td>
                                            <td>{formatNumber(userWallet?.scCoin.psc)}</td>
                                            <td>{formatNumber(userWallet?.scCoin.bsc)}</td>
                                            <td>{formatNumber(userWallet?.totalScCoin)}</td>
                                            <td>{UserReport?.totalPurchaseAmount ? convToStr(UserReport?.totalPurchaseAmount) : '-'}</td>
                                            <td>{userWallet?.vaultGcCoin}</td>
                                            <td>{formatNumber(userWallet?.vaultScCoin.wsc)}</td>
                                            <td>{formatNumber(userWallet?.vaultScCoin.psc)}</td>
                                            <td>{formatNumber(userWallet?.vaultScCoin.bsc)}</td>
                                            <td>{UserReport?.totalPendingRedemptionAmount ? convToStr(UserReport?.totalPendingRedemptionAmount) : '-'}</td>
                                            <td>{UserReport?.totalRedemptionAmount ? convToStr(UserReport?.totalRedemptionAmount) : '-'}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>

                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}

export default WalletDetail

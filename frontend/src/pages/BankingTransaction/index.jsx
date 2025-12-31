import React from 'react'
import TransactionBanking from '../PlayerDetails/components/TransactionBanking'

const BankingTransaction = () => {
    return (
        <div className="dashboard-typography">
            <TransactionBanking isAllUser={true} />
        </div>
    )
}

export default BankingTransaction
import React from 'react'
import CasinoTransactions from '../PlayerDetails/components/CasinoTransactions'

const CasinoTransaction = () => {
    return (
        <div className="dashboard-typography">
            <CasinoTransactions isAllUser={true} />
        </div>
    )
}

export default CasinoTransaction
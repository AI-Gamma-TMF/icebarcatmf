import React, { useState } from 'react'
import { Table } from '@themesberg/react-bootstrap'
import { InlineLoader } from '../../../components/Preloader'
import moment from 'moment'
import { formatAmountWithCommas } from '../../../utils/helper'
import PaginationComponent from '../../../components/Pagination'
import './redeemRateReport.scss'

const RedeemReport = ({ redeemReportData, loading }) => {
  const [pageNo, setPageNo] = useState(1)
  const [limit, setLimit] = useState(15) // rows per page

  // Calculate total pages
  const totalPages = Math.ceil((redeemReportData?.rows?.length || 0) / limit)

  // Slice data for current page
  const currentData = redeemReportData?.rows?.slice(
    (pageNo - 1) * limit,
    pageNo * limit
  )

  return (
    <>
      <div className="table-responsive redeem-report-table-wrap">
        <Table hover size="sm" className="dashboard-data-table redeem-report-table text-center">
        <thead>
          <tr>
            {[
              'Date',
              'Revenue',
              'Redemptions',
              'Pending Redemptions',
              'In Progress Redemptions',
              'Total Revenue',
              'Total Redemptions',
              'Total Pending Redemptions',
              'Total In Progress Redemptions',
              'Redemption Rate',
              'Lifetime Redemption Rate'
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && !currentData?.length ? (
            <tr>
              <td colSpan={11} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : currentData?.length > 0 ? (
            <>
              {currentData.map((data, index) => (
                <tr key={index} className="text-center">
                  <td>{data?.date ? moment(data?.date).format('MM/DD/YYYY') : 'NA'}</td>
                  <td>{formatAmountWithCommas(data?.revenue)}</td>
                  <td>{formatAmountWithCommas(data?.redemptions)}</td>
                  <td>{formatAmountWithCommas(data?.pendingRedemptions)}</td>
                  <td>{formatAmountWithCommas(data?.inProcessRedemptions)}</td>
                  <td>{formatAmountWithCommas(data?.totalRevenue)}</td>
                  <td>{formatAmountWithCommas(data?.totalRedemptions)}</td>
                  <td>{formatAmountWithCommas(data?.totalPendingRedemptions)}</td>
                  <td>{formatAmountWithCommas(data?.totalInprocessRedemptions)}</td>
                  <td>{data?.redemptionsRate}</td>
                  <td>{data?.lifetimeRedemptionsRate}</td>
                </tr>
              ))}

              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center">
                    <InlineLoader />
                  </td>
                </tr>
              ) : null}
            </>
          ) : (
            <tr>
              <td colSpan={11} className="text-center">
                <span className="redeem-report-empty">No data Found</span>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>

      {/* Pagination Below Table */}
      {redeemReportData?.rows?.length > 0 && (
        <PaginationComponent
          page={pageNo}
          totalPages={totalPages}
          setPage={setPageNo}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  )
}

export default RedeemReport

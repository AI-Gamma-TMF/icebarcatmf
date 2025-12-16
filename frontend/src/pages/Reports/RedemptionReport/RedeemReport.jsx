
import React, { useState } from 'react'
import { Table } from '@themesberg/react-bootstrap'
import { InlineLoader } from '../../../components/Preloader'
import Datetime from 'react-datetime'
import moment from 'moment'
import { formatAmountWithCommas } from '../../../utils/helper'
import PaginationComponent from '../../../components/Pagination'

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
      <Table
        bordered
        striped
        responsive
        hover
        size='sm'
        className='text-center mt-4'
      >
        <thead className='thead-dark'>
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
        {loading ? (
          <tr>
            <td colSpan={11} className='text-center'>
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {currentData && currentData?.length > 0 ? (
              currentData.map((data, index) => {
                return (
                  <tr key={index} className='text-center'>
                    <td>
                      {data?.date
                        ? moment(data?.date).format('MM/DD/YYYY')
                        : 'NA'}
                    </td>
                    <td>{formatAmountWithCommas(data?.revenue)}</td>
                    <td>{formatAmountWithCommas(data?.redemptions)}</td>
                    <td>{formatAmountWithCommas(data?.pendingRedemptions)}</td>
                    <td>
                      {formatAmountWithCommas(data?.inProcessRedemptions)}
                    </td>
                    <td>{formatAmountWithCommas(data?.totalRevenue)}</td>
                    <td>{formatAmountWithCommas(data?.totalRedemptions)}</td>
                    <td>
                      {formatAmountWithCommas(data?.totalPendingRedemptions)}
                    </td>
                    <td>
                      {formatAmountWithCommas(
                        data?.totalInprocessRedemptions
                      )}
                    </td>
                    <td>{data?.redemptionsRate}</td>
                    <td>{data?.lifetimeRedemptionsRate}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={11} className='text-danger text-center'>
                  No data Found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>

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

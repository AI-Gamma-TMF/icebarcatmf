import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getSubscriptionReportDetail } from '../../../utils/apiCalls';
import { getItem } from '../../../utils/storageUtils';

const useSubscriptionDetail = () => {
    const timeZone = getItem("timezone");

    const { data: SubscriptionReportData, isLoading, refetch } = useQuery({
        queryKey: [`SubscriptionReportData`, timeZone],
        queryFn: () => {
            const params = {
                timezone: timeZone
            }
            return getSubscriptionReportDetail(params)
        },
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false
    })

    return {
        SubscriptionReportData,
        isLoading,
        refetch
    }
}

export default useSubscriptionDetail

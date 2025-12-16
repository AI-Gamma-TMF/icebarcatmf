import React from 'react'
import useTournamentDetails from '../../Tournaments/hooks/useTournamentDetails'
import useSubscriptionPlanDetail from './useSubscriptionPlanDetail'
import Preloader from '../../../components/Preloader'
import CreateSubscriptionPlan from '../CreateSubscriptionPlan'

const ViewSubscriptionPlan = () => {

    const { subscriptionData,
        loading,
        navigate,
        refetchSubscription } = useSubscriptionPlanDetail()

    if (loading) return <Preloader />
    return <CreateSubscriptionPlan subscriptionData={subscriptionData} type="view" refetchSubscription={refetchSubscription} loading={loading} />
}

export default ViewSubscriptionPlan

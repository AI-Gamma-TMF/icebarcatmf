import React from 'react'
import AdminPages from '../AdminPages'
import AffiliatePages from '../AffiliatePages'
import useMainRoute from './hooks/useMainRoute'

const MainRoute = () => {
  const{ isAffiliateLogin } = useMainRoute();
  return (
    <>
     {isAffiliateLogin ? <AffiliatePages /> : <AdminPages />}
    </>
  )
}

export default MainRoute

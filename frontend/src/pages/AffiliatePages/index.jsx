import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AffiliateRoute } from '../../routes'
import NotFound from '../NotFound'
import AffiliatePrivateRoute from '../../components/AffiliatePrivateRoute'
import Dashboard from '../Dashboard'
import AffiliatePlayersList from '../../components/Affiliates/AffiliatePlayersList'
import AffiliatePlayerDetails from '../../components/Affiliates/AffiliatePlayerDetails'
import CreatePassword from '../CreatePassword'
import AffiliateProfilePage from '../AffiliateProfilePage'
import AffiliateSignIn from '../AffiliateSignIn'
import AffiliateCommissions from '../AffiliateCommissions'
import AffiliateCasinoTransitions from '../AffiliateCasinoTransitions'
import AffiliateTransitions from '../AffiliateTransitions'


const AffiliatePages = () => (
  <Routes>
   <Route
      path={AffiliateRoute.AffiliateSignIn}
      element={<AffiliateSignIn />}
    />

     <Route
      path={AffiliateRoute.AffiliateCreatePassword}
      element={<CreatePassword />}
    />
    
   <Route
      path={AffiliateRoute.AffiliateDashboard}
      element={
        <AffiliatePrivateRoute module={{ AffiliatePlayers: 'R' }}>
          <Dashboard />
        </AffiliatePrivateRoute>
      }
    />

    <Route
      path={AffiliateRoute.AffiliateProfile}
      element={
        <AffiliatePrivateRoute module={{ AffiliatePlayers: 'R' }}>
          <AffiliateProfilePage />
        </AffiliatePrivateRoute>
      }
    />

    <Route
      path={AffiliateRoute.AffiliatePlayers}
      element={
        <AffiliatePrivateRoute module={{ AffiliatePlayers: 'R' }}>
          <AffiliatePlayersList />
        </AffiliatePrivateRoute>
      }
    />

    <Route
      path={AffiliateRoute.AffiliatePlayerDetails}
      element={
        <AffiliatePrivateRoute module={{ AffiliatePlayers: 'R' }}>
          <AffiliatePlayerDetails />
        </AffiliatePrivateRoute>
      }
    /> 

   <Route
      path={AffiliateRoute.AffiliateCommission}
      element={
        <AffiliatePrivateRoute module={{ AffiliatePlayers: 'R' }}>
          <AffiliateCommissions />
        </AffiliatePrivateRoute>
      }
    /> 

    <Route
      path={AffiliateRoute.AffiliateCasinoTransitions}
      element={
        <AffiliatePrivateRoute module={{ AffiliatePlayers: 'R' }}>
         <AffiliateCasinoTransitions />
        </AffiliatePrivateRoute>
      }
    /> 

    <Route
      path={AffiliateRoute.AffiliateTransitions}
      element={
        <AffiliatePrivateRoute module={{ AffiliatePlayers: 'R' }}>
              <AffiliateTransitions />
        </AffiliatePrivateRoute>
      }
    /> 
    <Route path={AffiliateRoute.NotFound} element={<NotFound />} />
    
    <Route
      path='*'
      element={<Navigate replace to={AffiliateRoute.NotFound} />}
    />
  </Routes>
)
export default AffiliatePages
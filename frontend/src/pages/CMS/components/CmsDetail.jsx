import React from 'react'
import useCmsDetails from '../hooks/useCmsDetails'
import Preloader from '../../../components/Preloader'
import CreateCms from './CreateCms'

const CMSDetail = () => {
  const { cmsByPageIdData, loading } = useCmsDetails()
  if(loading) return <Preloader />
  return <CreateCms cmsData={cmsByPageIdData} details />
}

export default CMSDetail

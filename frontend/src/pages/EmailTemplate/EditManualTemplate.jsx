import React from 'react'
import Preloader from '../../components/Preloader'
import CreateEmailTemplate from './createEmailTemplate'
import useEditEmailTemplate from './hooks/useEditEmailTemplate'

const EditManualTemplate = () => {
  const { emailTemplate, loading } = useEditEmailTemplate()
  if(loading) return <Preloader />
  return <CreateEmailTemplate emailData={emailTemplate} />
}

export default EditManualTemplate

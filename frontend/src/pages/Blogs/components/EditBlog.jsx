import React from 'react'
import Preloader from '../../../components/Preloader'
import CreateBlog from './CreateBlog'
import useBlogDetails from '../hooks/useBlogDetails'

const EditBlog = () => {
  const { blogByIdData, loading } = useBlogDetails()
  if(loading) return <Preloader />
  return <CreateBlog blogData={blogByIdData} />
}

export default EditBlog

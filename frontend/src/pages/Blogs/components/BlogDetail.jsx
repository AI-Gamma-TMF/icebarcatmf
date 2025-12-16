import React from 'react'
import CreateBlog from './CreateBlog'
import Preloader from '../../../components/Preloader'
import useBlogDetails from '../hooks/useBlogDetails'

const BlogDetail = () => {
  const { blogByIdData, loading } = useBlogDetails();
  if(loading) return <Preloader />
  return <CreateBlog blogData={blogByIdData} details />
}

export default BlogDetail

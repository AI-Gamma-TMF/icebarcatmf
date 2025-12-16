import React from 'react'
import './Preloader.scss'

const Preloader = () => {
  return <div id='cover-spin' />
}

const SpinnerLoader = () => {
  return <div id='small-spinner' />
}

const InlineLoader = () => {
  return <div id='inline-spinner' />
}

export default Preloader
export { SpinnerLoader, InlineLoader }

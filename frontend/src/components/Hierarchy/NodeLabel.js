import { faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './Hierarchy.scss'

class NodeLabel extends React.PureComponent {
  render () {
    const { nodeData} = this.props

    return (
      <span className='tree-container'>
        <p className='tree-name'>{nodeData.name} &nbsp; {nodeData?.isInitial ? '' : <a href={`/${'admin'}/admin-details/${nodeData.id}`} target='_blank' rel='noreferrer'><FontAwesomeIcon icon={faUser} /></a>}</p>
      </span>
    )
  }
}

export default NodeLabel

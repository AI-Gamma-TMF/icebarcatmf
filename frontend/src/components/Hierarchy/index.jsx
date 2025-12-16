import { useQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import React, { useState } from 'react'
import Tree from 'react-hierarchy-tree-graph'
import { getAdminChildren } from '../../utils/apiCalls'
import { toast } from '../Toast'
import './Hierarchy.scss'
import NodeLabel from './NodeLabel'

const Hierarchy = ({ adminDetails}) => {
  const [child, setChild] = useState(null);
  const [adminChildren, setAdminChildren] = useState(adminDetails)
  
  const addChildrenToAdmin = (newAdminChildren, id, children) => {
    if (newAdminChildren?.id === id) {
      return newAdminChildren.children = [...children]
    }

    if (newAdminChildren?.children?.length) {
      for (const admin of newAdminChildren.children) {
        addChildrenToAdmin(admin, id, children)
      }
    }
  }

  const { refetch } = useQuery({
    queryKey: ['adminChildren', child?.adminId],
    queryFn: () => getAdminChildren(child),
    select: (res) => res?.data?.adminDetails,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
    onSuccess: (data) => {
      const newAdminChildren = cloneDeep(adminChildren)
      const children = data?.map((item) => {
        return {
          id: item.adminUserId,
          name: `${item.firstName || ''} (${item.childCount})`,
          children: [],
          data: item
        }
      })
      addChildrenToAdmin(newAdminChildren, child.adminId, children)
      setAdminChildren(newAdminChildren)
    },
    onError: (error) => {
      if(error?.response?.data?.errors.length > 0) {
        const {errors} = error.response.data;
        errors.map((error) => {
          if(error?.description) toast(error?.description, 'error')
        })
      }
    },
    enabled: !!child
  })

  const containerStyles = {
    width: '100%',
    height: '100vh'
  }
  
  return (
    <div style={containerStyles}>
      {adminDetails && adminChildren && (
        <Tree
          refetch={refetch}
          data={adminChildren}
          translate={{ x: 550, y: 50 }}
          orientation='vertical'
          collapsible={false}
          onClick={(e) => {
            setChild({adminId: e.id})
          }}
          separation={{ siblings: 1.3, nonSiblings: 2 }}
          allowForeignObjects
          nodeLabelComponent={{
            render: <NodeLabel />,
            foreignObjectWrapper: {
              y: -13,
              x: 18,
              height: '25px',
              width: '200px'
            }
          }}
        />
      )}
    </div>
  )
}

export default Hierarchy
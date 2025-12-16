import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAllAdmins, getAdminDetails, adminRoles, getStaffGroups } from '../../../utils/apiCalls'
import { useTranslation } from 'react-i18next'
const useStaffForm = ({ group, role, adminId }) => {
  const navigate = useNavigate()
  const [type, setType] = useState('password')
  const [groupOptions, setGroupOptions] = useState()
  const [selectedGroup, setSelectedGroup] = useState()
  const { t } = useTranslation(['staff', 'translation'])

  const { data: adminRole } = useQuery({
    queryKey: ['adminRoles'],
    queryFn: adminRoles,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
    select: (res) => res?.data.roles
  })

  const { isInitialLoading: loadingAdmins,  data } = useQuery({
    queryKey: ['staffListSupport'],
    queryFn: () => {
      const params = {
        sort: 'desc',
        orderBy: 'adminUserId',
        roleId: 2,
      }
      return getAllAdmins(params)
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
    select: (res) => res?.data?.adminDetails,
    enabled: role === 'Support'
  })

  const { isInitialLoading: loadingDetail, data: adminDetails } = useQuery({
    queryKey: ['staffDetail', adminId, role],
    queryFn: () => {
      if(adminId && role=== "Support") return getAdminDetails({adminUserId: adminId})
      return getAdminDetails()
    },
    select: (res) => res?.data?.adminDetails,
    enabled: ((role === 'Support' && adminId !== '') || role === 'Manager'),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
  })

  useQuery({
    queryKey: ['staffGroup'],
    queryFn: getStaffGroups,
    select: (res) => res?.data?.groupNames,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
    onSuccess: (data) => {
      if (data.length > 0) {
        const options = []
        data.map((g) => {
          if (g !== '' && g !== null) {
            options.push({ label: g, value: g })
          }
        })
        setGroupOptions(options)
      }
    }
  })

  useEffect(() => {
    if (group) {
      setSelectedGroup({ label: group, value: group })
    }
  }, [])

  return {
    navigate,
    adminRole,
    data,
    adminDetails,
    getAllAdmins,
    getAdminDetails,
    loading: loadingDetail || loadingAdmins,
    type,
    setType,
    groupOptions,
    setGroupOptions,
    selectedGroup,
    setSelectedGroup,
    t
  }
}

export default useStaffForm

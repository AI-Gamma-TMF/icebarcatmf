import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRestrictedItems, getUnRestrictedItems } from '../../utils/apiCalls'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDeleteRestrictedItem, useUpdateRestrictedItemMutation } from '../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'
import { toast } from '../../components/Toast'

const useRestrictedProviders = () => {
  const queryClient = useQueryClient()
  const { countryId } = useParams()
  const { t } = useTranslation(['countries'])

  const [selectedTab, setSelectedTab] = useState('restricted-providers')
  const [selectedProviders, setSelectedProviders] = useState({ count: 0, rows: [] })
  const [removedProviders, setRemovedProviders] = useState({ count: 0, rows: [] })
  const [restrictedItemsLimit, setRestrictedItemsLimit] = useState(15)
  const [restrictedItemsPage, setRestrictedItemsPage] = useState(1)

  const [unRestrictedItemsLimit, setUnRestrictedItemsLimit] = useState(15)
  const [unRestrictedItemsPage, setUnRestrictedItemsPage] = useState(1)

  const { data: restrictedItems, isLoading: restrictedItemLoading } = useQuery({
    queryKey: ['restrictedItem', countryId, 'providers', restrictedItemsLimit, restrictedItemsPage],
    queryFn: ({ queryKey }) => {
      const params = {};
      if(queryKey[1]) params.countryId = queryKey[1]
      if(queryKey[2]) params.type = 'providers'
      if(queryKey[3]) params.limit = queryKey[3]
      if(queryKey[4]) params.pageNo = queryKey[4]
      
      return getRestrictedItems(params)
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.restrictedItems
  })

  const { data: unRestrictedItems, isLoading: unRestrictedItemLoading } = useQuery({
    queryKey: ['unRestrictedItem', countryId, 'providers', unRestrictedItemsLimit, unRestrictedItemsPage],
    queryFn: ({ queryKey }) => {
      const params = {};
      if(queryKey[1]) params.itemId = queryKey[1]
      if(queryKey[2]) params.type = 'providers'
      if(queryKey[3]) params.limit = queryKey[3]
      if(queryKey[4]) params.pageNo = queryKey[4]
      
      return getUnRestrictedItems(params)
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.restrictedItems
  })

  const restrictedItemsTotalPages = Math.ceil(restrictedItems?.providers?.count / restrictedItemsLimit)
  const unRestrictedItemsTotalPages = Math.ceil(unRestrictedItems?.providers?.count / unRestrictedItemsLimit)

  const addProvider = (provider) => {
    const providerExists = ({ ...selectedProviders }
      .rows
      .findIndex(g => g.masterCasinoProviderId === provider.masterCasinoProviderId))

    if (providerExists === -1) {
      setSelectedProviders({ count: selectedProviders.count + 1, rows: [...selectedProviders.rows, provider] })
    } else {
      toast(t('restrictedProvider.alreadyAdd'), 'error')
    }
  }

  const removeProvider = (gameId) => {
    const updatedGameRows = [...selectedProviders.rows].filter(g => g.masterCasinoProviderId !== gameId)
    setSelectedProviders({ count: selectedProviders.count - 1, rows: updatedGameRows })
  }

  const { mutate: restrictedItemsUpdate, isLoading: updateRestrictedItemLoading } = useUpdateRestrictedItemMutation({onSuccess: () => {
    setSelectedProviders({ count: 0, rows: [] })
    setSelectedTab('restricted-providers')
    toast(t('restrictedProvider.updateMessage'), 'success')
    queryClient.invalidateQueries({ queryKey: ['restrictedItem'] })
    queryClient.invalidateQueries({ queryKey: ['unRestrictedItem'] })
  }})

  const addRestrictedProvider = () => {
    const providers = [...selectedProviders.rows].map(g => g.masterCasinoProviderId)
    restrictedItemsUpdate({countryId: +countryId, type: 'providers', itemIds: providers})
  }

  const addDeleteProvider = (provider) => {
    const providerExists = ({ ...removedProviders }
      .rows
      .findIndex(g => g.masterCasinoProviderId === provider.masterCasinoProviderId))

    if (providerExists === -1) {
      setRemovedProviders({ count: removedProviders.count + 1, rows: [...removedProviders.rows, provider] })
    } else {
      toast(t('restrictedProvider.alreadyAdd'), 'error')
    }
  }

  const removeDeleteProvider = (gameId) => {
    const updatedGameRows = [...removedProviders.rows].filter(g => g.masterCasinoProviderId !== gameId)
    setRemovedProviders({ count: removedProviders.count - 1, rows: updatedGameRows })
  }

  const { mutate: deleteRestrictedItem } = useDeleteRestrictedItem({onSuccess: ({data}) => {
      toast(data.message, 'success')
      setRemovedProviders({ count: 0, rows: [] })
      setSelectedTab('restricted-providers')
      queryClient.invalidateQueries({ queryKey: ['restrictedItem'] })
      queryClient.invalidateQueries({ queryKey: ['unRestrictedItem'] })
  }})

  const removeRestrictedProvider = () => {
    const providers = [...removedProviders.rows].map(g => g.masterCasinoProviderId)
    deleteRestrictedItem({ countryId: +countryId, type: 'providers', itemIds : providers })
  }

  return {
    t,
    loadin: restrictedItemLoading || unRestrictedItemLoading || updateRestrictedItemLoading,
    restrictedItemsLimit,
    setRestrictedItemsLimit,
    restrictedItemsPage,
    setRestrictedItemsPage,
    unRestrictedItemsLimit,
    setUnRestrictedItemsLimit,
    setUnRestrictedItemsPage,
    unRestrictedItemsPage,
    restrictedItemsTotalPages,
    unRestrictedItemsTotalPages,
    restrictedItems,
    selectedTab,
    setSelectedTab,
    unRestrictedItems,
    addProvider,
    selectedProviders,
    removeProvider,
    addRestrictedProvider,
    removeRestrictedProvider,
    addDeleteProvider,
    removeDeleteProvider,
    removedProviders,
    setRemovedProviders
  }
}

export default useRestrictedProviders

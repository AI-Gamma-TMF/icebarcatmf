import { useState} from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from '../../components/Toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRestrictedItems, getUnRestrictedItems } from '../../utils/apiCalls'
import { useDeleteRestrictedItem, useUpdateRestrictedItemMutation } from '../../reactQuery/hooks/customMutationHook'

const useRestrictedGames = () => {
  const queryClient = useQueryClient()
  const { countryId } = useParams()
  const { t } = useTranslation(['countries'])

  const [selectedTab, setSelectedTab] = useState('restricted-games')
  const [selectedGames, setSelectedGames] = useState({ count: 0, rows: [] })
  const [removedGames, setRemovedGames] = useState({ count: 0, rows: [] })
  const [restrictedItemsLimit, setRestrictedItemsLimit] = useState(15)
  const [restrictedItemsPage, setRestrictedItemsPage] = useState(1)

  const [unRestrictedItemsLimit, setUnRestrictedItemsLimit] = useState(15)
  const [unRestrictedItemsPage, setUnRestrictedItemsPage] = useState(1)

  const { data: restrictedItems, isLoading: restrictedItemLoading } = useQuery({
    queryKey: ['restrictedItem', countryId, 'games', restrictedItemsLimit, restrictedItemsPage],
    queryFn: ({ queryKey }) => {
      const params = {};
      if(queryKey[1]) params.countryId = queryKey[1]
      if(queryKey[2]) params.type = 'games'
      if(queryKey[3]) params.limit = queryKey[3]
      if(queryKey[4]) params.pageNo = queryKey[4]
      
      return getRestrictedItems(params)
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.restrictedItems
  })

  const { data: unRestrictedItems, isLoading: unRestrictedItemLoading } = useQuery({
    queryKey: ['unRestrictedItem', countryId, 'games', unRestrictedItemsLimit, unRestrictedItemsPage],
    queryFn: ({ queryKey }) => {
      const params = {};
      if(queryKey[1]) params.itemId = queryKey[1]
      if(queryKey[2]) params.type = 'games'
      if(queryKey[3]) params.limit = queryKey[3]
      if(queryKey[4]) params.pageNo = queryKey[4]
      
      return getUnRestrictedItems(params)
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.restrictedItems
  })

  const restrictedItemsTotalPages = Math.ceil(restrictedItems?.games?.count / restrictedItemsLimit)
  const unRestrictedItemsTotalPages = Math.ceil(unRestrictedItems?.games?.count / unRestrictedItemsLimit)

  const addGame = (game) => {
    const gameExists = ({ ...selectedGames }
      .rows
      .findIndex(g => g.masterCasinoGameId === game.masterCasinoGameId))

    if (gameExists === -1) {
      setSelectedGames({ count: selectedGames.count + 1, rows: [...selectedGames.rows, game] })
    } else {
      toast(t('restrictedGame.alreadyAdd'), 'error')
    }
  }

  const removeGame = (gameId) => {
    const updatedGameRows = [...selectedGames.rows].filter(g => g.masterCasinoGameId !== gameId)
    setSelectedGames({ count: selectedGames.count - 1, rows: updatedGameRows })
  }

  const { mutate: restrictedItemsUpdate, isLoading: updateRestrictedItemLoading } = useUpdateRestrictedItemMutation({onSuccess: () => {
    setSelectedGames({ count: 0, rows: [] })
    setSelectedTab('restricted-games')
    toast(t('restrictedProvider.updateMessage'), 'success')
    queryClient.invalidateQueries({ queryKey: ['restrictedItem'] })
    queryClient.invalidateQueries({ queryKey: ['unRestrictedItem'] })
  }})

  const addRestrictedGames = () => {
    const games = [...selectedGames.rows].map(g => g.masterCasinoGameId)
    restrictedItemsUpdate({countryId: +countryId, type: 'games', itemIds: games})
  }

  const addDeleteGame = (game) => {
    const gameExists = ({ ...removedGames }
      .rows
      .findIndex(g => g.masterCasinoGameId === game.masterCasinoGameId))

    if (gameExists === -1) {
      setRemovedGames({ count: removedGames.count + 1, rows: [...removedGames.rows, game] })
    } else {
      toast(t('restrictedGame.alreadyAdd'), 'error')
    }
  }

  const removeDeleteGame = (gameId) => {
    const updatedGameRows = [...removedGames.rows].filter(g => g.masterCasinoGameId !== gameId)
    setRemovedGames({ count: removedGames.count - 1, rows: updatedGameRows })
  }

  const { mutate: deleteRestrictedItem, isLoading: deleteRestrictedGameLoading } = useDeleteRestrictedItem({onSuccess: ({data}) => {
      toast(data.message, 'success')
      setRemovedGames({ count: 0, rows: [] })
      setSelectedTab('restricted-games')
      queryClient.invalidateQueries({ queryKey: ['restrictedItem'] })
      queryClient.invalidateQueries({ queryKey: ['unRestrictedItem'] })
  }})

  const removeRestrictedGame = () => {
    const games = [...removedGames.rows].map(g => g.masterCasinoGameId)
    deleteRestrictedItem({ countryId: +countryId, type: 'games', itemIds : games })
  }

  return {
    t,
    loading: restrictedItemLoading || unRestrictedItemLoading,
    updateRestrictedItemLoading,
    deleteRestrictedGameLoading,
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
    addGame,
    selectedGames,
    removeGame,
    addRestrictedGames,
    addDeleteGame,
    removeDeleteGame,
    removeRestrictedGame,
    removedGames
  }
}

export default useRestrictedGames

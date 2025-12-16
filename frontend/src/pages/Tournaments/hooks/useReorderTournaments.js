import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getAllTournamentsList } from '../../../utils/apiCalls'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '../../../components/Toast'
import { AdminRoutes } from '../../../routes'
import { useReorderTournamentMutation } from '../../../reactQuery/hooks/customMutationHook'

const useReorderTournaments = () => {
    const { t } = useTranslation(['tournaments'])
    const navigate = useNavigate()
    const [state, setState] = useState({ rows: [], count: 0 })
    const [status, setStatus] = useState('all')
    const [coinType, setCoinType] = useState('all')
    const queryClient = useQueryClient()

    const { isLoading: fetchLoading } = useQuery({
        queryKey: ['tournaments', status, coinType],
                 onSuccess: (data) => setState({ rows: data?.data?.rows, count: data?.data?.count }),
        queryFn: ({ queryKey }) => {
          const params = { }
          if (queryKey[1]) params.status = queryKey[1];
          if (queryKey[2]) params.entryCoin = queryKey[2];
          return getAllTournamentsList(params)
        },
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
      })

    const reorder = (tournaments, startIndex, endIndex) => {
        const result = Array.from(tournaments)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        return result
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return
        }

        if (result.destination.index === result.source.index) {
            return
        }

        const rows = reorder(
            state?.rows,
            result.source.index,
            result.destination.index
        )
        setState({ rows, count: rows?.length })
    }

    const { mutate: reorderTournaments, isLoading: updateLoading } = useReorderTournamentMutation({
        onSuccess: () => {
            toast('Tournaments Successfully Reordered', 'success')
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            navigate(AdminRoutes.Tournament)
        },
        onError: (error) => {
            console.error("Reordering failed:", error);
        },
    })

    const handleSave = () => {
        const order = state?.rows?.map(list => list.tournamentId);
        reorderTournaments({ order });
    }

    return {
        t,
        loading: fetchLoading || updateLoading,
        state,
        onDragEnd,
        handleSave,
        navigate,
        status,
        setStatus,
        coinType,
        setCoinType
    }
}

export default useReorderTournaments

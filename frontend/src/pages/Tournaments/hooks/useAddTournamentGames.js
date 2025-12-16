import {  useState } from 'react'
import {  useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {  getTournamentGames } from '../../../utils/apiCalls'
import { useDebounce } from 'use-debounce'


const useAddTournamentGames = ({setSelectedGames, isViewMode, type}) => {
    const {tournamentId} = useParams() 
    const { t } = useTranslation('players')
    const [limit, setLimit] = useState(15)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounce(search.trim(), 500)
    const [providerFilter, setProviderFilter] = useState()
    const [subCategoryFilter, setSubCategoryFilter] = useState('all')

    const resetFilters = () => { 
        setSearch("");
        setProviderFilter("all");
        setSubCategoryFilter("all");     
        setLimit(15);
        setPage(1);
        setSelectedGames([])
    };

    const { data: GamesData = [], isLoading: loading, refetch: GamesRefetch } = useQuery({
        queryKey: ['GamesList', limit, page, debouncedSearch, providerFilter, subCategoryFilter, tournamentId],
        queryFn: () => {
            const params = {
                pageNo: page,
                limit: limit,
            };

             // Default sorting and tournament ID handling
             params.orderBy = type === "EDIT" ? "tournamentId" : undefined;
             params.tournamentId = type === "EDIT" ? tournamentId : undefined;

            if (debouncedSearch) params.search = debouncedSearch;
            if (providerFilter && providerFilter !== 'all') params.providerId = providerFilter;
            if (subCategoryFilter && subCategoryFilter !== 'all') params.gameSubCategoryId = subCategoryFilter;     
            return getTournamentGames(params)
        },
        refetchOnWindowFocus: false,
        select: (res) => res?.data,
        enabled : !isViewMode
    })

    const totalPages = Math.ceil(GamesData?.games?.count / limit)

    return {
        setLimit,
        setPage,
        totalPages,
        limit,
        page,
        t,
        GamesData,
        loading,
        search,
        setSearch,
        GamesRefetch,
        resetFilters,
        providerFilter,
        setSubCategoryFilter,
        subCategoryFilter,
        setProviderFilter,
    }
}

export default useAddTournamentGames
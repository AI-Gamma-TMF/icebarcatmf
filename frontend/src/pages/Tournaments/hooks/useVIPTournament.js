import {  useState } from 'react'
import {  useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {   getAllTierTournamentList, getTournamentUserList } from '../../../utils/apiCalls'
import { useDebounce } from 'use-debounce'

const useVIPTournament = ({ _setSelectedUser, isViewMode, type }) => {  
    const { tournamentId } = useParams();
    const { t } = useTranslation('players');
    const [limit, setLimit] = useState(15);
    const [page, setPage] = useState(1);
    const [emailSearch, setEmailSearch] = useState('');
    const [debouncedSearch] = useDebounce(emailSearch.trim(), 500);
    const [playerId, setPlayerId] = useState('');
    const [debouncedPlayerId] = useDebounce((playerId || '').trim(), 500);
    const [username, setUsername] = useState('');
    const [debouncedUsername] = useDebounce(username.trim(), 500);
    const [tierSearch, setTierSearch] = useState('all');
    // const [vipStatus, setVipStatus] = useState('all')

    const resetFilters = () => {
        setEmailSearch("");
        setPlayerId("");
        setUsername("");
        setTierSearch("all")
        setLimit(15);
        setPage(1)
        // setVipStatus('all')
    };

    const { data: UserData = [], isLoading: loading, refetch: userDataRefetch } = useQuery({
        queryKey: ['UserList', limit, page, debouncedSearch, debouncedPlayerId, debouncedUsername, tierSearch, tournamentId],
        queryFn: ({ queryKey }) => {
            const params = {
                pageNo: queryKey[2],
                limit: queryKey[1],
            };
            
            // Default sorting and tournament ID handling
            params.orderBy = type === "EDIT" ? "vipTournamentId" : undefined;
            params.vipTournamentId = type === "EDIT" ? tournamentId : undefined;

            // Conditional parameter handling
            if (queryKey[3]) params.emailSearch = queryKey[3];
            if (queryKey[4]) params.idSearch = queryKey[4];
            if (queryKey[5]) params.userNameSearch = queryKey[5];
            if (queryKey[6]) params.tierSearch = queryKey[6];
            if (queryKey[7]) params.vipTournamentId = queryKey[7];
            // if(queryKey[8]) params.vipStatus = queryKey[8]

            return getTournamentUserList(params);
        },
        refetchOnWindowFocus: false,
        select: (res) => res?.data,
        enabled: !isViewMode,
    });

    const { data: tierList } = useQuery({
        queryKey: ['tierList'],
        queryFn: getAllTierTournamentList,
        select: (res) => res?.data?.tiers,
        refetchOnWindowFocus: false,
        retry: false
    });

    const totalPages = Math.ceil(UserData?.users?.count / limit);

    return {
        setLimit,
        setPage,
        totalPages,
        limit,
        page,
        t,
        UserData,
        loading,
        emailSearch,
        setEmailSearch,
        userDataRefetch,
        resetFilters,
        playerId,
        setPlayerId,
        username,
        setUsername,
        tierList,
        tierSearch,
        setTierSearch,
        // vipStatus,
        // setVipStatus
    };
};

export default useVIPTournament;

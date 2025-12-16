import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from '../../../components/Toast';
import { useQuery } from '@tanstack/react-query';
import { getAllCasinoProviders, getAllCasinoGames } from '../../../utils/apiCalls';
import { useDebounce } from 'use-debounce';
import { AdminRoutes } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { useAddGamesToSubCategory, useDeleteCasinoGame } from '../../../reactQuery/hooks/customMutationHook';

const useAddGames = () => {
  const { masterGameSubCategoryId } = useParams();

  const { t } = useTranslation(['casino']);
  const navigate = useNavigate();
  const location = useLocation();
  const subCategoryName = location?.state?.subCategoryName;

  const [selectedTab, setSelectedTab] = useState('view-games');
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);

  const [remLimit, setRemLimit] = useState(15);
  const [remPage, setRemPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const [searchMaster, setSearchMaster] = useState('');
  const [debouncedSearchMaster] = useDebounce(searchMaster, 500);

  const [selectedGames, setSelectedGames] = useState([]);
  const [removedGames, setRemovedGames] = useState([]);

  const [selectedProvider, setSelectedProvider] = useState('');
  const [providerId, setProviderId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [addGameproviderId, setAddGameProviderId] = useState('');
  const [addGameStatusFilter, setaddGameStatusFilter] = useState('');

  const { data: allProviders } = useQuery({
    queryKey: ['providersList'],
    queryFn: () => {
      return getAllCasinoProviders();
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.casinoProvider,
  });

  const { data: masterGames, isLoading: loading } = useQuery({
    queryKey: ['casinoSubCategories', limit, page, debouncedSearchMaster,  addGameproviderId, addGameStatusFilter],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.name = queryKey[3];
      if (queryKey[4]) params.providerId = queryKey[4];
      if (queryKey[5]) params.status = queryKey[5];
      params.masterGameSubCategoryId = masterGameSubCategoryId;
      params.type = 'NOT';
      return getAllCasinoGames(params);
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
  });

  const { data: viewGames, isLoading: viewLoading } = useQuery({
    queryKey: ['casinoSubCategories', debouncedSearch, providerId, statusFilter],
    queryFn: ({ queryKey }) => {
      const params = { name: queryKey[1], providerId: queryKey[2] };
      if (queryKey[3]) params.status = queryKey[3]
      params.masterGameSubCategoryId = masterGameSubCategoryId;
      // params.flag = true;
      return getAllCasinoGames(params);
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
  });

  const totalPages = Math.ceil(masterGames?.count / limit);

  const getProviderName = (id) => allProviders?.rows.find((val) => val.masterCasinoProviderId === id)?.name;

  const addGame = (game) => {
    const gameExists = [...selectedGames].findIndex((g) => g.masterCasinoGameId === game.masterCasinoGameId);

    if (gameExists === -1) {
      setSelectedGames([...selectedGames, game]);
    } else {
      toast(t('casinoGames.addGames.addGameToast'), 'error');
    }
  };

  const removeGame = (gameId) => {
    const updatedGames = [...selectedGames].filter((g) => g.masterCasinoGameId !== gameId);
    setSelectedGames(updatedGames);
  };

  const { mutate: addGamesToSubCat, isLoading: updateloading } = useAddGamesToSubCategory({
    onSuccess: () => {
      toast(t('casinoGames.addGames.gameSuccessToast'), 'success');
      navigate(AdminRoutes.CasinoSubCategories);
    },
  });

  const addDeleteGames = (game) => {
    const gameExists = [...removedGames].findIndex((g) => g.masterCasinoGameId === game.masterCasinoGameId);

    if (gameExists === -1) {
      setRemovedGames([...removedGames, game]);
    } else {
      toast(t('casinoGames.addGames.addGameToast'), 'error');
    }
  };

  const removeDeleteGames = (gameId) => {
    const updatedGameRows = [...removedGames].filter((g) => g.masterCasinoGameId !== gameId);
    setRemovedGames(updatedGameRows);
  };

  const addGamesToSubCategory = () => {
    const games = [...selectedGames].map((g) => g.masterCasinoGameId);
    addGamesToSubCat({ masterGameSubCategoryId: parseInt(masterGameSubCategoryId), games });
  };

  const { mutate: deleteSubCategoryGame, isLoading: deleteloading } = useDeleteCasinoGame({
    onSuccess: ({ data }) => {
      toast(data.message, 'success');
      navigate(AdminRoutes.CasinoSubCategories);
    },
  });

  const removeGamesToSubCategory = () => {
    const games = [...removedGames].map((g) => g.masterCasinoGameId);
    deleteSubCategoryGame({ masterCasinoGameIds: games, masterGameSubCategoryId: +masterGameSubCategoryId });
  };

  return {
    t,
    viewGames,
    selectedTab,
    setSelectedTab,
    loading: loading || viewLoading,
    updateloading,
    deleteloading,
    page,
    limit,
    search,
    setLimit,
    setPage,
    setSearch,
    searchMaster,
    setSearchMaster,
    totalPages,
    masterGames,
    addGame,
    removeGame,
    selectedGames,
    addGamesToSubCategory,
    subCategoryName,
    selectedProvider,
    setSelectedProvider,
    getProviderName,
    remPage,
    setRemPage,
    setRemLimit,
    remLimit,
    addDeleteGames,
    removedGames,
    removeDeleteGames,
    removeGamesToSubCategory,
    statusFilter,
    setStatusFilter,
    providerId,
    setProviderId,
    allProviders,
    addGameproviderId, 
    setAddGameProviderId,
    addGameStatusFilter, 
    setaddGameStatusFilter
  };
};

export default useAddGames;

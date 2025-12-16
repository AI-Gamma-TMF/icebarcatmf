import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAllCasinoSubCategories, getCasinoSubcategoryGames } from '../../../utils/apiCalls';
import { useReorderSubCategoryGamesMutation } from '../../../reactQuery/hooks/customMutationHook';
import { toast } from '../../../components/Toast';
import { useTranslation } from 'react-i18next';

const useGameReorder = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['casino']);

  const [reOrderedGame, setReorderedGame] = useState({ rows: [], count: 0 });
  const [casinoGames, setCasinoGames] = useState({ rows: [], count: 0 });
  const [tempCasinoGames, setTempCasinoGames] = useState({ rows: [], count: 0 });

  const [categoryFilter, setCategoryFilter] = useState(1);
  const [casinoCategoryId, setCasinoCategoryId] = useState('');
  const [selectedId, setSelectedId] = useState([]);
  const [selectedReorderGameId, setSelectedReorderGameId] = useState([]);

  // const { data: casinoCategories, isLoading: categoriesLoading } = useQuery({
  //   queryKey: ['casinoCategories'],
  //   queryFn: () => getAllCasinoCategories(),
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   retry: false,
  //   staleTime: Infinity,
  //   select: (res) => (res && res.data && res.data.casinoCategories) || [],
  // });

  const { data: subCategories, isLoading: subCategoriesLoading } = useQuery({
    queryKey: ['casinoSubCategories', categoryFilter],
    queryFn: () => {
      const params = {};
      // if (queryKey[1]) params.masterGameCategoryId = queryKey[1];
      return getAllCasinoSubCategories(params);
    },
    select: (res) => (res && res.data && res.data.subCategory) || [],
    refetchOnWindowFocus: false,
  });

  const { isInitialLoading: subCategoryGamesLoading, refetch: refetchSubcategoryGames } = useQuery({
    queryKey: ['casinoSubCategoryGames', casinoCategoryId, true],
    queryFn: ({ queryKey }) => {
      const params = {};
      if (queryKey[1]) params.masterGameSubCategoryId = queryKey[1];
      if (queryKey[2]) params.flag = queryKey[2];
      return getCasinoSubcategoryGames(params);
    },
    enabled: !!casinoCategoryId,
    onSuccess: (data) => {
      setCasinoGames({ rows: data.rows || [], count: data.count || 0 });
      setTempCasinoGames({ rows: data.rows || [], count: data.rows ? data.count : 0 });
    },
    select: (res) => (res && res.data && res.data.data) || [],
    refetchOnWindowFocus: false,
  });

  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);

  const reorder = (reorderItem, startIndex, endIndex) => {
    const result = Array.from(reorderItem);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const rows = reorder(reOrderedGame.rows, result.source.index, result.destination.index);
    setReorderedGame({ rows: rows || [], count: rows ? rows.length : 0 });
  };

  const handleAddGame = (e, item) => {
    const data = [...selectedId];
    if (e.target.checked) {
      data.push(item.masterCasinoGameId);
      setSelectedId(data);
    } else {
      const updatedSelectedId = data.filter((row) => row !== item.masterCasinoGameId);
      setSelectedId(updatedSelectedId);
    }
  };

  // const addGame = () => { };

  const handRemoveGame = (item) => {
    const newAselectedId = selectedId ? selectedId.filter((gameItem) => gameItem !== item.masterCasinoGameId) : [];
    setSelectedId(newAselectedId);

    setCasinoGames((oldItem) => {
      const newArray = [...(oldItem.rows || []), item];
      return { rows: newArray, count: newArray.length };
    });
    setReorderedGame((oldItem) => {
      const newArray = oldItem?.rows
        ? oldItem.rows.filter((gameItem) => gameItem.masterCasinoGameId !== item.masterCasinoGameId)
        : [];
      return { rows: newArray, count: newArray.length };
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const data = [...selectedId];
      for (const index in casinoGames?.rows || []) {
        const id = casinoGames?.rows?.[index]?.masterCasinoGameId;
        if (!data.includes(id)) {
          data.push(id);
        }
      }
      setSelectedId(data);
    } else {
      setSelectedId([]);
    }
  };

  const handleReorderSelectAll = (e) => {
    if (e.target.checked) {
      const data = [...selectedReorderGameId];
      for (const index in reOrderedGame?.rows || []) {
        const id = reOrderedGame?.rows?.[index]?.masterCasinoGameId;
        if (!data.includes(id)) {
          data.push(id);
        }
      }
      setSelectedReorderGameId(data);
    } else {
      setSelectedReorderGameId([]);
    }
  };

  const handleReorderAddGame = (e, item) => {
    const data = [...selectedReorderGameId];
    if (e.target.checked) {
      data.push(item.masterCasinoGameId);
      setSelectedReorderGameId(data);
    } else {
      const updatedSelectedId = data.filter((row) => row !== item.masterCasinoGameId);
      setSelectedReorderGameId(updatedSelectedId);
    }
  };

  const removeReorderAddGame = () => {
    const selectedGame = reOrderedGame.rows
      ? reOrderedGame.rows.filter((item) => selectedReorderGameId.includes(item.masterCasinoGameId))
      : [];
    const unSelectedGame = reOrderedGame.rows
      ? reOrderedGame.rows.filter((item) => !selectedReorderGameId.includes(item.masterCasinoGameId))
      : [];
    setReorderedGame(() => {
      return { rows: unSelectedGame, count: unSelectedGame.length };
    });
    setCasinoGames(() => {
      return { rows: [...selectedGame, ...casinoGames.rows], count: [...selectedGame, ...casinoGames.rows].length };
    });
    setSelectedReorderGameId([]);
  };

  const addCasinoGame = () => {
    const selectedGame = casinoGames.rows
      ? casinoGames.rows.filter((item) => selectedId.includes(item.masterCasinoGameId))
      : [];
    const unSelectedGame = casinoGames.rows
      ? casinoGames.rows.filter((item) => !selectedId.includes(item.masterCasinoGameId))
      : [];
    setReorderedGame(() => {
      return { rows: [...reOrderedGame.rows, ...selectedGame], count: [...reOrderedGame.rows, ...selectedGame].length };
    });
    setCasinoGames(() => {
      return { rows: unSelectedGame, count: unSelectedGame.length };
    });
    setSelectedId([]);
  };

  // const removeCasinoGame = () => {
  //   setCasinoGames(() => {
  //     const newArray = [...(tempCasinoGames?.rows || [])];
  //     return { rows: newArray, count: newArray.length };
  //   });
  //   setReorderedGame(() => {
  //     const newArray = [];
  //     return { rows: newArray, count: newArray.length };
  //   });
  // };
  const { mutate: reorderSubCategoryGames, isLoading: updateLoading } = useReorderSubCategoryGamesMutation({
    onSuccess: () => {
      toast(t('casinoGames.reorder.reorderGameSuccess'), 'success');
      refetchSubcategoryGames();
      setReorderedGame({ rows: [], count: 0 });
    },
  });

  const handleSave = () => {
    setSelectedId([]);
    const orderedGames = [];
    const unOrderedGames = [];
    reOrderedGame &&
      reOrderedGame.rows &&
      reOrderedGame.rows.map((list) =>
       
        orderedGames.push(list.gameSubcategoryId)
      );
    casinoGames &&
      casinoGames.rows &&
      casinoGames.rows.map((list) =>
      
        unOrderedGames.push(list.gameSubcategoryId)
      );

    const data = {
      // order: [...orderedGames, ...unOrderedGames],
      order: [...orderedGames],
      masterGameSubCategoryId: +casinoCategoryId,
    };
    reorderSubCategoryGames(data);
  };

  return {
    t,
    loading: subCategoriesLoading || subCategoryGamesLoading || updateLoading,
    reOrderedGame,
    onDragEnd,
    handleSave,
    navigate,
    casinoGames,
    handRemoveGame,
    handleAddGame,
    // casinoCategories,
    categoryFilter,
    setCategoryFilter,
    // totalPages,
    setLimit,
    setPage,
    limit,
    page,
    subCategories,
    casinoCategoryId,
    selectedId,
    setCasinoCategoryId,
    setReorderedGame,
    setCasinoGames,
    handleSelectAll,
    tempCasinoGames,
    addCasinoGame,
    selectedReorderGameId,
    setSelectedReorderGameId,
    handleReorderSelectAll,
    handleReorderAddGame,
    removeReorderAddGame,
  };
};

export default useGameReorder;

import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getGamePageCardDetail, getGamePageDetail } from '../../../utils/apiCalls'
import useGamePageListing from './useGamePageLIsting';
import { useDeleteGameCard } from '../../../reactQuery/hooks/customMutationHook';
import { toast } from '../../../components/Toast';

const useGamePageDetails = () => {
  const { gamePageId } = useParams();
  const navigate = useNavigate();
  const{setGamePageId,setGamePageCardId,gamePageCardId, deleteModalShow,
    setDeleteModalShow,} = useGamePageListing();



  const { isInitialLoading: loading, data: gamePageDetail } = useQuery({
    queryKey: ['gamePageDetail', gamePageId ],
    queryFn: () => getGamePageDetail({gamePageId}),
    select: (res) => res?.data?.GamePageDetails?.rows[0],
    refetchOnWindowFocus: false,
  })


  const { isInitialLoading: gameCardLoading, refetch:refetchGameData,data: gamePageCardsDetail } = useQuery({
    queryKey: ['gamePageCardDetail', gamePageId ],
    queryFn: () => getGamePageCardDetail({gamePageId}),
    select: (res) => res?.data?.GamePageCardDetails,
    refetchOnWindowFocus: false,
  })

    const { mutate: deleteGameCard, isLoading: deleteGameCardLoading } = useDeleteGameCard({
      onSuccess: () => {
        toast("Game Card Deleted Successfully", "success");
        refetchGameData();
        // queryClient.invalidateQueries({ queryKey: ["gamePageDetail",gamePageId] });
        setDeleteModalShow(false);
      },
    });


    const handleGameCardDelete = (gamePageCardId, gamePageId) => {
      setGamePageId(gamePageId)
      setGamePageCardId(gamePageCardId);
      setDeleteModalShow(true);
    };
  
  
    const handleGameCardDeleteYes = () => {
      deleteGameCard({ gamePageId: +gamePageId,gamePageCardId });

    };

  return {
    gamePageDetail,
    loading,
    navigate,
    gamePageCardsDetail,
    gameCardLoading,
    deleteGameCard,
    deleteGameCardLoading,
    handleGameCardDelete,
    handleGameCardDeleteYes,
    deleteModalShow,
    setDeleteModalShow
  }
}

export default useGamePageDetails

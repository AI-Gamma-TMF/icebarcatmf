import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getGamePageCardDetail } from '../../../utils/apiCalls'


const useEditGameCard = () => {
    
    const { gamePageCardId } = useParams();
    const navigate = useNavigate()

    const { isInitialLoading: gameCardEditLoading, data: gameCardDetail } = useQuery({
        queryKey: ['gamePageCardDetail', gamePageCardId],
        queryFn: () => getGamePageCardDetail({ gamePageCardId }),
        select: (res) => res?.data?.GamePageCardDetails?.rows?.[0],
        refetchOnWindowFocus: false,
    })

    return {
        gameCardEditLoading,
        gameCardDetail,
        navigate,
        gamePageCardId
    }

}


export default useEditGameCard;


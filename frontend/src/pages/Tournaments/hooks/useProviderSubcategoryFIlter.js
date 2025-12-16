import { useQuery } from '@tanstack/react-query'
import { getAllTournamentProviders, getAllTournamentSubCategories } from '../../../utils/apiCalls'


  const useProviderSubcategoryFilter = ({details}) => {
   
    const { data: allProviders } = useQuery({
        queryKey: ['providersList'],
        queryFn: () => {
          return getAllTournamentProviders()
        },
        refetchOnWindowFocus: false,
        select: (res) => res?.data?.casinoProvider,
        enabled: !details
      })
    
      const { data: subCategories } = useQuery({
        queryKey: ['subCategories'],
        queryFn: () => {  
            return getAllTournamentSubCategories()
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 'Infinity',
        select: (res) => res?.data?.subCategory,
        enabled: !details
      })
    
    return {
        allProviders,
        subCategories
    }
  }

  export default useProviderSubcategoryFilter
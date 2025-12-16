import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getBlockedUser } from '../../../utils/apiCalls.js'
import { errorHandler, useUpdateDomainBlockMutation } from '../../../reactQuery/hooks/customMutationHook/index.js'
import { toast } from '../../../components/Toast/index.jsx'
import { AdminRoutes } from '../../../routes.js'
import { useNavigate } from "react-router-dom";

const useEditBlockedDomain = (domainId) => {
  const navigate = useNavigate();
  const [isInitialValues, setIsInitialValues] = useState(true);

  const { data: domainNameDetail } = useQuery({
    queryKey: ['domainNameDetail', domainId],
    queryFn: ({ queryKey }) => {
      const params = { domainId: queryKey[1] };
      return getBlockedUser(params);
    },
    select: (res) => res?.data?.blockedDomains?.rows[0],
    refetchOnWindowFocus: false,
    retry:false,
    onSuccess: () => {
      setIsInitialValues(false);
    }
  });

  const { mutate: updateDomainName, isLoading: updateLoading } = useUpdateDomainBlockMutation({
    onSuccess: () => {
      toast("Domain Updated Successfully", "success");     
      navigate(AdminRoutes.DomainBlock)
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  const handleEditDomainNameSubmit = (formValues) => {    
    const body = {
      domainId: Number(domainId),
      domainName: formValues.domainName,     
    };
    updateDomainName(body);
  };

  return {
    domainNameDetail, handleEditDomainNameSubmit, isInitialValues, updateLoading 
  }
}

export default useEditBlockedDomain
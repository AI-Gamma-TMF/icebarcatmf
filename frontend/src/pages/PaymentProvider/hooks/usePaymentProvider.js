import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaymentProvider } from "../../../utils/apiCalls";
import { toast } from "../../../components/Toast";
import { errorHandler, useUpdatePaymentProviderMutation } from "../../../reactQuery/hooks/customMutationHook";
import { useState } from "react";

const usePaymentProvider = () => {
  const queryClient = useQueryClient();
  const [paymentProviderId, setPaymentProviderId] = useState(null)
  const [show, setShow] = useState(false)
  const [active, setActive] = useState()
  const [orderBy, setOrderBy] = useState('paymentMethodId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
 
  const {
    isLoading: loading,
    data: paymentProviderList,
  } = useQuery({
    queryKey: ['PaymentProvider', orderBy, sort],
    queryFn: ({queryKey}) => {
      const params={}
      if(queryKey[1]) params.orderBy = queryKey[1]
      if(queryKey[2]) params.sort = queryKey[2]
      return getPaymentProvider(params);
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
  });

 const { mutate: updateStatus } = useUpdatePaymentProviderMutation(
  {onSuccess: ({data}) => {
      if(data.success) {
        if(data.message) 
        toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['PaymentProvider'] })
      }
      setShow(false)
    }, 
   onError: (error) => {
      setShow(false)
      errorHandler(error)
    }})

  const handleShow = (id, active) => {
    setPaymentProviderId(id)
    setActive(!active)
    setShow(true)
  }

  const handleYes = () => {
    updateStatus({
      paymentMethodId: paymentProviderId,
      isActive: active
    }) 
  }
 
  const selected = (h) => orderBy === h.value && h.labelKey !== "Actions";

  return {
   loading,
   paymentProviderList,
   handleShow,
   handleYes,
   show,
   setShow,
   active,
   selected,
   orderBy,
   sort,
   setSort,
   setOrderBy,
   over,
   setOver
  };
};

export default usePaymentProvider;
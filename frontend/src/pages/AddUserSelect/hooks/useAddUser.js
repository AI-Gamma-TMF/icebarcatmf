import { useSendTestMail } from '../../../reactQuery/hooks/customMutationHook'

const useAddUser = () => {
 

  // const navigate = useNavigate()
  // const location = useLocation()

   const { mutate: sendMail, isLoading: sendMailLoading} =
      useSendTestMail({
        onSuccess: () => {
          // toast("Email Sent Successfully ", "success");
          // queryClient.invalidateQueries({ queryKey: ["cmsList"] });
          
        },
        onError: () => {
      
            // toast('Error in Sending Test Mails', "error");
            // errorHandler(errors);
        },
      });
  

 

  return {
    // setSelectedTab,
   sendMailLoading,sendMail
  }
}

export default useAddUser

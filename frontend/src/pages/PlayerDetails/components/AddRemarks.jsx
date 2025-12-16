// import React from 'react'
// import SimpleEditForm from './EditInfo/SimpleEditForm'
// import { toast } from '../../../components/Toast'
// import { useAddComments } from '../../../reactQuery/hooks/customMutationHook'

// function AddRemarks({ userData, handelRefetchActivity }) {

//   const { mutate: addComments } = useAddComments({
//     onSuccess: (data) => {
//       if (data.data.message) {
//       handelRefetchActivity(true)
//         toast(data.data.message, 'success')
//       } else {
//         toast(data.data.message, 'error')
//       }
//     },
//     onError: (error) => {
//       if (error?.response?.data?.errors.length > 0) {
//         const { errors } = error.response.data;
//         errors.map((error) => {
//           if (error?.errorCode === 500) {
//             toast('Something Went Wrong', 'error')
//           }
//           if (error?.description) {
//             toast(error?.description, 'error')
//           }
//         })
//       }
//     }
//   })

//   const handleSubmit = (data, isFav) => {
//     const payload = {
//       userId: userData.userId,
//       reason: data.reason,
//       favorite: isFav
//     }
//     addComments(payload)
//   }

//   return (
//     <SimpleEditForm
//       title='Remarks'
//       placeholder = 'Remarks'
//       showSaveBtn={true}
//       onSubmit={handleSubmit}
//     />
//   )

// }

// export default AddRemarks

// not in use 
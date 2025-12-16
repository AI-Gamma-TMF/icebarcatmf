
// import { useParams } from 'react-router-dom'
// import { useUpdateMoneyMutation } from '../../../reactQuery/hooks/customMutationHook'

// const useManageMoney = ({getUserDetails}) => {
//   const { userId } = useParams()
//   const {mutateAsync: addDepositToOtherStart} = useUpdateMoneyMutation()

//   const deposit = async (data) => {
//     await addDepositToOtherStart({
//       body: {
//         addAmount: data?.transactionType === 'add-money' ? parseFloat(data?.addAmount.toFixed(2)) : (parseFloat(data?.addAmount?.toFixed(2)) * (-1)),
//         walletType: data?.walletType === 'cash' ? 'CASH' : 'NONCASH',
//         userId
//       }
//     })
//     getUserDetails()
//   }

//   return {
//     deposit
//   }
// }

// export default useManageMoney


// not in use 
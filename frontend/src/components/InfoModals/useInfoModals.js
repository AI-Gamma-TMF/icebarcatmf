// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { getBonusStart } from '../../store/redux-slices/bonus'
// import { useParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { getBonusStart } from '../../store/redux-slices/bonus'
// import { useParams } from 'react-router-dom'

// const useInfoModals = ({ bonusId, currencyCode }) => { 
//   const dispatch = useDispatch()
//   const { bonusDetail } = useSelector(state => state.bonus)
//   const { userId } = useParams()
//   const [keys, setKeys] = useState([])
// const useInfoModals = ({ bonusId, currencyCode }) => { 
//   const dispatch = useDispatch()
//   const { bonusDetail } = useSelector(state => state.bonus)
//   const { userId } = useParams()
//   const [keys, setKeys] = useState([])

//   const dataToShow = (key) => {
//     switch (key) {
//       case 'DEPOSIT':
//         setKeys([
//           { label: 'Days To Clear', value: bonusDetail?.daysToClear },
//           { label: 'Wagering Multiplier', value: bonusDetail?.wageringMultiplier },
//           { label: 'Bonus Percentage', value: bonusDetail?.depositBonusPercent + '%' },
//           { label: 'Min Deposit', value: bonusDetail?.currency?.[currencyCode]?.minDeposit }
//         ])
//         break
//   const dataToShow = (key) => {
//     switch (key) {
//       case 'DEPOSIT':
//         setKeys([
//           { label: 'Days To Clear', value: bonusDetail?.daysToClear },
//           { label: 'Wagering Multiplier', value: bonusDetail?.wageringMultiplier },
//           { label: 'Bonus Percentage', value: bonusDetail?.depositBonusPercent + '%' },
//           { label: 'Min Deposit', value: bonusDetail?.currency?.[currencyCode]?.minDeposit }
//         ])
//         break

//       case 'JOINING':
//         setKeys([
//           // { label: 'Min Deposit Percentage', value: bonusDetail?.depositBonusPercent + '%' },
//           // { label: 'Days To Clear', value: bonusDetail?.daysToClear }
//         ])
//         break

//       default:
//         break
//     }
//     return keys
//   }

//   useEffect(() => {
//     bonusDetail?.bonusType &&
//             bonusDetail?.bonusType !== 'freespins' &&
//                 dataToShow(bonusDetail?.bonusType?.toUpperCase())
//   }, [bonusDetail?.bonusType, bonusId])

//   useEffect(() => {
//     if (bonusId) {
//       dispatch(getBonusStart({ bonusId, userId }))
//     }
//   }, [bonusId])

//   return {
//     bonusDetail,
//     keys
//   }
// }

// export default useInfoModals

// not in use

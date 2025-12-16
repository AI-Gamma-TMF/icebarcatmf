// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
// import { cancelBonusStart, getUserBonusStart } from '../../../../store/redux-slices/bonus'

// const useYourBonuses = () => {
//   const dispatch = useDispatch()
//   const { userId } = useParams()
//   const { userBonus, loading } = useSelector(state => state.bonus)
//   const [limit, setLimit] = useState(10)
//   const [page, setPage] = useState(1)
//   const [status, setStatus] = useState('')
//   const [bonusType, setBonusType] = useState('')
//   const totalPages = Math.ceil(userBonus?.count / limit)
//   const [infoModal, setInfoModal] = useState(false)
//   const [bonusData, setBonusData] = useState({})

//   useEffect(() => {
//     dispatch(getUserBonusStart({
//       limit,
//       pageNo: page,
//       bonusType,
//       status,
//       userId
//     }))
//   }, [limit, page, bonusType, status])

//   const cancelBonusHandler = (userBonusId) => {
//     dispatch(cancelBonusStart({ data: { userBonusId, userId }, limit, pageNo: page, bonusType, status, userId }))
//   }

//   return {
//     loading,
//     userBonus,
//     limit,
//     page,
//     totalPages,
//     status,
//     bonusType,
//     cancelBonusHandler,
//     setBonusType,
//     setStatus,
//     setLimit,
//     setPage,
//     infoModal,
//     setInfoModal,
//     bonusData,
//     setBonusData
//   }
// }

// export default useYourBonuses

// not in use

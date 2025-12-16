// import * as React from 'react'
// import { useGetAllowedStateListQuery } from '../../../reactQuery/hooks/customQueryHook'
// import { useTranslation } from 'react-i18next'
// import { errorHandler, useUpdateAllowedStates } from '../../../reactQuery/hooks/customMutationHook'
// import { toast } from '../../../components/Toast'
// import { useNavigate } from 'react-router-dom'

// const reducer = (state, action) => {
    
//     switch(action.type){
//         case 'add':
//             return state.map(x=>x.state_id===action.value ? {...x, isAllowed: true} : x)
        
//         case 'initiate': 
//             return action.value

//         case 'remove': 
//             return state.map(x=>x.state_id === action.value ? { ...x, isAllowed: false}: x)
        
//         case 'reset':
//             return action.initialState;
        
//         default:
//             return state
//     }
// }

// const useGeoBlocking = () => {
//     const [state, dispatch] = React.useReducer(reducer, []);
//     const { t } = useTranslation(['geoblocking']);
//     const navigate = useNavigate()

    
//     const {
//         data: stateData,
//         isLoading: isGetStateLoading,
//         isSuccess: isGetStateSuccess,
//         refetch: fetchStateData  // Now accessible
//     } = useGetAllowedStateListQuery({ params: {}, enabled: true  });    

   

//     const {
//         mutate: updateAllowedStatesFn,
//         isLoading: isAllowedStatesLoading,
//     } = useUpdateAllowedStates({
//         onSuccess: (data) => {
//             if (data.data.message) {
//               toast(data.data.message, 'success');
//             } else {
//               toast(data.data.message, 'error');
//             }
//           },
//           onError: (error) => {
//             errorHandler(error)
//           }
//     });

//     const tableHeaders = [
//         { labelKey: 'id', value: 'userId' },
//         { labelKey: 'State Name', value: 'email' },
//         { labelKey: 'State Code', value: 'created_at' },
//         { labelKey: 'State Status', value: 'username' },
//         { labelKey: 'action', value: '' }
//     ];

//     React.useEffect(() => {
//         if (isGetStateSuccess) {
//             dispatch({
//                 type: "initiate",
//                 value: stateData
//             });
//         }
//     }, [isGetStateSuccess, stateData]);

//     // Function to handle reset by re-fetching data
//     const resetToggler = () => {
//         fetchStateData();  // Trigger a fresh API call
//         toast("Reset Data Successfully Done!", 'success');
//     };

//     return {
//         state,
//         initialState: stateData,
//         isLoading: isGetStateLoading,
//         isUpdateListLoading: isAllowedStatesLoading,
//         tableHeaders,
//         t,
//         updateAllowedStatesFn,
//         dispatch,
//         resetToggler , // Expose resetToggler for use in the component
//         navigate,
//     };
// };

// export default useGeoBlocking;


// not in use 
import { create } from 'zustand';
import { getItem } from '../utils/storageUtils';

const userPermistion = {
  AffiliatePlayers: [
    "C",
    "R",
    "U",
    "T",
    "D"
  ],
  AffiliateProfile: [
    "C",
    "R",
    "U",
    "T",
    "Issue"
  ],


}
export const useUserStore = create((set) => ({
  userDetails: null,
  permissions: null,
  isUserAffiliate: false,
  loginCountSocketConnection: false,
  livePlayersCountConnection: false,
  notificationsSocketConnection: false,
  jackpotSocketConnection: false,
  timeZoneCode: getItem('timezone') || 'GMT',
  setUserDetails: (data) => set(() => ({ userDetails: data, permissions: data?.userPermission?.permission || userPermistion })),
  setIsUserAffiliate: (data) => set(() => ({ isUserAffiliate: data })),
  setloginCountSocketConnection: (data) => { set(() => ({ loginCountSocketConnection: data })) },
  setlivePlayersCountConnection: (data) => { set(() => ({ livePlayersCountConnection: data })) },
  setNotificationsSocketConnection: (data) => { set(() => ({ notificationsSocketConnection: data })) },
  setJackpotSocketConnection: (data) => { set(() => ({ jackpotSocketConnection: data })) },
  setTimeZoneCode: (data) => { set(() => ({ timeZoneCode: data })) }
}));

export const useSelectedPackageStore = create((set) => ({
  selectedPackage: null,
  setSelectedPackage: (data) => set(() => ({ selectedPackage: data })),
}));

export const useFooterTabStore = create((set) => ({
  selectedTab: 'redemption',
  setSelectedTab: (data) => set(() => ({ selectedTab: data })),
}));


// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';

// const userPermission = {
//   AffiliatePlayers: ["C", "R", "U", "T", "D"],
//   AffiliateProfile: ["C", "R", "U", "T", "Issue"],
// };

// const useUserStore = create(devtools((set) => {
//   const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
//   const storedIsUserAffiliate = JSON.parse(localStorage.getItem('isUserAffiliate'));

//   return {
//     userDetails: storedUserDetails || null,
//     permissions: storedUserDetails?.userPermission?.permission,
//     isUserAffiliate: storedIsUserAffiliate || false,
//     setUserDetails: (data) => {
//       localStorage.setItem('userDetails', JSON.stringify(data));
//       set(() => ({ userDetails: data }));
//     },
//     setIsUserAffiliate: (data) => {
//       localStorage.setItem('isUserAffiliate', JSON.stringify(data));
//       set(() => ({ isUserAffiliate: data }));
//     },
//   };
// }));

// const useSelectedPackageStore = create(set => {
//   const storedSelectedPackage = JSON.parse(localStorage.getItem('selectedPackage'));

//   return {
//     selectedPackage: storedSelectedPackage || null,
//     setSelectedPackage: (data) => {
//       localStorage.setItem('selectedPackage', JSON.stringify(data));
//       set(() => ({ selectedPackage: data }));
//     },
//   };
// });

// const useFooterTabStore = create(set => {
//   const storedSelectedTab = localStorage.getItem('selectedTab') || 'redemption';

//   return {
//     selectedTab: storedSelectedTab,
//     setSelectedTab: (data) => {
//       localStorage.setItem('selectedTab', data);
//       set(() => ({ selectedTab: data }));
//     },
//   };
// });

// export { useUserStore, useSelectedPackageStore, useFooterTabStore };

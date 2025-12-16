export const FREE_SPINS_STATUS = {
  UPCOMING: 0,
  RUNNING: 1,
  COMPLETED: 2,
  CANCELLED: 3
}


export const tableHeaders = [
  {labelKey:'Id', value:'freeSpinId'},
  {labelKey:'Title', value:'title'},
  {labelKey:'Provider', value:'masterCasinoProviderName'},
  {labelKey:'Game', value:'masterCasinoGameName'},
  {labelKey:'Spin Amount', value:'freeSpinAmount'},
  {labelKey:'Spin Round', value:'freeSpinRound'},
  {labelKey:'Coin Type', value:'coinType'},
  {labelKey:'Spin Type', value:'freeSpinType'},
  {labelKey:'Start Date', value:'startDate'},
  {labelKey:'End Date', value:'endDate'},
  {labelKey:'Status', value:'status'},
  {labelKey:'Action', value:''},
]
export const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
];

export const typeOptions = [
  { label: 'Select type filter', value: '' },
  {label: "Purchase Report" , value:"purchase_report_csv_download"},
  { label: 'Players', value: 'players_csv_download' },
  { label: 'Player Activity', value: 'player_activity_csv_download' },
  { label: 'Casino Transactions', value: 'casino_transactions_csv_download' },
  { label: 'Promocode Block', value: 'promocode_blocked_users_csv_download' },
  { label: 'Transactions Banking', value: 'transactions_banking_csv_download' },
  { label: 'Vault', value: 'vault_data_csv_download' },
  { label: 'Redeem Requests', value: 'redeem_requests_csv_download' },
  { label: 'Tournament', value: 'tournament_csv_download' },
  { label: 'Promocode Applied History', value: 'promocode_applied_history_csv_download' },
  { label: 'Game Dashboard', value: 'game_dashboard_csv_download' },
  {label:'User Daily Report', value:'merv_report_csv_download'}
];

export const tableHeaders = [
  { labelKey: 'tableHeaders.id', value: 'id' },
  { labelKey: 'tableHeaders.type', value: 'type' },
  { labelKey: 'tableHeaders.updatedAt', value: 'updatedAt' },
  { labelKey: 'tableHeaders.status', value: 'status' },
  { labelKey: 'tableHeaders.downloadURL', value: '' },
];

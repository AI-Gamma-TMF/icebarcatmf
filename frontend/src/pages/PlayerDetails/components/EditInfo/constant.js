export const coinConst = [
  { value: 'gc', label: 'Gold Coins' },
  { value: 'sc', label: 'Sweep Coins' },
  { value: 'wsc', label: 'SC-WSC' },
  { value: 'bsc', label: 'SC-BSC' },
  { value: 'psc', label: 'SC-PSC' },
  { value: 'both', label: 'Both' }
]
export const deductConst = [
  { value: '1', label: 'Add' },
  { value: '2', label: 'Deduct' }
]
export const allowOnlyNumber = (value) => {
  return value.toString().replace(/[^0-9]/g, '')
}
export const verificationLevel = [
  { value: 'K1', label: 'Email Verification' },
  { value: 'K4', label: 'Kyc Verification' },
]
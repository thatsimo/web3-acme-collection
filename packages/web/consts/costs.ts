import { parseEther } from 'viem'

export const customNameCost = {
  value: parseEther('0.0004'),
  label: '0.0004',
  currency: 'ETH',
}

export const mintLT15 = {
  value: parseEther('0.00000005'),
  label: '0.00000005',
  currency: 'ETH',
}

export const mintGTE15 = {
  value: parseEther('0.0006'),
  label: '0.0006',
  currency: 'ETH',
}

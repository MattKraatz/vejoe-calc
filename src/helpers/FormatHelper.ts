import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

export function formatCurrency(value: number) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  });
}

export function formatWei(wei: BigNumber) {
  return Number(formatEther(wei)).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

export function formatWeiToCurrency(wei: BigNumber) {
  return formatCurrency(Number(formatEther(wei)));
}
